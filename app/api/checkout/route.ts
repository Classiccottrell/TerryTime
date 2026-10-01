import { NextResponse } from "next/server";
import { getStripe, CURRENCY } from "@/lib/stripe";
import { getVariant, isFulfillable } from "@/lib/products";
import { routeForPath } from "@/lib/shop-routes.mjs";
import { parseDestination, type Destination } from "@/lib/regions";
import { quoteShipping } from "@/lib/shipping";

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
  let destinationInput: unknown;
  let quantity = 1;
  try {
    const body = await req.json();
    productId = body?.productId;
    destinationInput = body?.destination;
    if (Number.isInteger(body?.quantity) && body.quantity > 0) {
      quantity = Math.min(body.quantity, 20);
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const found = productId ? getVariant(productId) : undefined;
  if (!found) {
    return NextResponse.json({ error: "Unknown product." }, { status: 404 });
  }
  const { product, variant } = found;
  if (product.free || variant.priceCents <= 0) {
    return NextResponse.json(
      { error: "This item is free — just download it." },
      { status: 400 }
    );
  }

  const dest = parseDestination(destinationInput);
  if (!dest.ok) {
    return NextResponse.json({ error: dest.error }, { status: 400 });
  }
  const destination: Destination = dest.destination;

  // Fail closed: a variant with no Printful sync id would take payment and then
  // be unfulfillable. ALLOW_UNMAPPED_VARIANTS=true is for Stripe test mode only.
  if (!isFulfillable(variant) && process.env.ALLOW_UNMAPPED_VARIANTS !== "true") {
    console.error(`[checkout] Refusing ${variant.id}: not linked to Printful (run npm run sync:printful).`);
    return NextResponse.json(
      { error: "That size isn't available right now. Try another or check back soon." },
      { status: 409 }
    );
  }

  const origin = siteOrigin(req);
  const store = storeFromReferer(req);
  // Priced server-side from Printful's rate to this address; the client's number is never used.
  const shipping = await quoteShipping({
    printfulVariantId: variant.printfulVariantId,
    quantity,
    destination,
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity,
          // Inline price_data so no Stripe dashboard setup is needed — only a key.
          price_data: {
            currency: CURRENCY,
            unit_amount: variant.priceCents,
            product_data: {
              name: `${product.name} — ${variant.color} / ${variant.label}`,
              description: `${product.voice}`,
            },
          },
        },
      ],
      // Locked to the country they chose (and were quoted for); Stripe collects the full address.
      shipping_address_collection: { allowed_countries: [destination.country] },
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
        ship_to: `${destination.country}-${destination.state}`,
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
