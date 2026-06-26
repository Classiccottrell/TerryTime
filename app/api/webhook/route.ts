import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Stripe webhook receiver. Verifies the signature and acts on completed
 * checkouts. Configure the endpoint in the Stripe dashboard and set
 * STRIPE_WEBHOOK_SECRET. This is where you'd hand the order to Printful for
 * fulfilment.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhooks not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const payload = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log(
        `[webhook] Paid: ${session.metadata?.productId ?? "unknown"} — ${session.id}`
      );
      // TODO: create a Printful order from session line items here.
      break;
    }
    default:
      // Ignore unhandled event types.
      break;
  }

  return NextResponse.json({ received: true });
}
