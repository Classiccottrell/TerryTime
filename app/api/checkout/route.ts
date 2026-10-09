import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { CURRENCY, checkPrice, isFulfillable } from "@/lib/catalog-core";
import { routeForPath } from "@/lib/shop-routes.mjs";
import { quoteCheckoutShipping } from "@/lib/shipping";

export const runtime = "nodejs";

function siteOrigin(req: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    req.headers.get("origin") ||
    new URL(req.url).origin
  );
}

/**
 * Which A/B storefront the buyer was on, read from the Referer path. Recorded
 * on the Stripe session so conversion can be compared per store; falls back to
 * "other" (e.g. the lifestyle page) so a missing header never blocks checkout.
 */
function storeFromReferer(req: Request) {
  try {
    const referer = req.headers.get("referer");
    return referer ? routeForPath(new URL(referer).pathname) : undefined;
  } catch {
    return undefined;
  }
}

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Checkout isn't live yet — set STRIPE_SECRET_KEY to enable it. Drops are announced to the collective first.",
      },
      { status: 503 }
    );
  }

  let productId: string | undefined;
  let quantity = 1;
  try {
    const body = await req.json();
    productId = body?.productId;
    if (Number.isInteger(body?.quantity) && body.quantity > 0) {
      quantity = Math.min(body.quantity, 20);
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // productId is a Stripe Price id. Price and product come from Stripe, never the client.
  if (typeof productId !== "string" || !/^price_[A-Za-z0-9]+$/.test(productId)) {
    return NextResponse.json({ error: "Unknown product." }, { status: 404 });
  }
  let found: ReturnType<typeof checkPrice>;
  try {
    found = checkPrice(await stripe.prices.retrieve(productId, { expand: ["product"] }));
  } catch {
    found = { ok: false, status: 404, error: "Unknown product." };
  }
  if (!found.ok) {
    return NextResponse.json({ error: found.error }, { status: found.status });
  }
  const { product, variant } = found;

  // Fail closed: a Printful item with no sync id would take payment and then
  // be unfulfillable. ALLOW_UNMAPPED_VARIANTS=true is for Stripe test mode only.
  if (!isFulfillable(product, variant) && process.env.ALLOW_UNMAPPED_VARIANTS !== "true") {
    console.error(`[checkout] Refusing ${variant.id}: not linked to Printful (run npm run sync:printful).`);
    return NextResponse.json(
      { error: "That size isn't available right now. Try another or check back soon." },
      { status: 409 }
    );
  }

  const origin = siteOrigin(req);
  const store = storeFromReferer(req);
  // Priced server-side from Printful's rates; the client never sends a price.
  const shipping =
    product.shippingCents !== undefined
      ? { amountCents: product.shippingCents, estimate: "5–10", source: "flat" }
      : await quoteCheckoutShipping(variant.printfulVariantId, quantity);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity,
          // Amount from the Stripe catalog Price (variant.id). Inline so the buyer's page and
          // receipt show the size; the catalog price id is kept in the session metadata.
          price_data: {
            currency: CURRENCY,
            unit_amount: variant.priceCents,
            product_data: {
              name: `${product.name} — ${variant.color ? `${variant.color} / ` : ""}${variant.label}`,
              ...(product.voice && { description: product.voice }),
              metadata: { stripe_product: product.stripeProductId, stripe_price: variant.id },
            },
          },
        },
      ],
      // Stripe collects the full address; shipping is one rate covering both countries.
      shipping_address_collection: { allowed_countries: ["CA", "US"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: `Standard shipping · est. ${shipping.estimate} business days`,
            fixed_amount: { amount: shipping.amountCents, currency: CURRENCY },
          },
        },
      ],
      metadata: {
        productId: product.id,
        variantId: variant.id,
        size: variant.size,
        quantity: String(quantity),
        store: store?.shortLabel.toLowerCase() ?? "other",
        ab_variant: store?.variant ?? "none",
        shipping_cents: String(shipping.amountCents),
        shipping_source: shipping.source,
      },
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${store?.href ?? "/shop"}?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Stripe error:", err);
    return NextResponse.json(
      { error: "Couldn't start checkout. Try again in a moment." },
      { status: 502 }
    );
  }
}
