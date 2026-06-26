import { NextResponse } from "next/server";
import { getStripe, CURRENCY } from "@/lib/stripe";
import { getProduct } from "@/lib/products";

export const runtime = "nodejs";

function siteOrigin(req: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    req.headers.get("origin") ||
    new URL(req.url).origin
  );
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

  const product = productId ? getProduct(productId) : undefined;
  if (!product) {
    return NextResponse.json({ error: "Unknown product." }, { status: 404 });
  }
  if (product.free || product.priceCents <= 0) {
    return NextResponse.json(
      { error: "This item is free — just download it." },
      { status: 400 }
    );
  }

  const origin = siteOrigin(req);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity,
          // Inline price_data so no Stripe dashboard setup is needed — only a key.
          price_data: {
            currency: CURRENCY,
            unit_amount: product.priceCents,
            product_data: {
              name: product.name,
              description: `${product.voice} — ${product.count}`,
            },
          },
        },
      ],
      // Stickers ship — collect an address.
      shipping_address_collection: { allowed_countries: ["CA", "US"] },
      metadata: { productId: product.id },
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop?canceled=1`,
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
