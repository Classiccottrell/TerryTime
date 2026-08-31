import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createPrintfulOrder } from "@/lib/printful";

export const runtime = "nodejs";

/**
 * Stripe webhook receiver. Verifies the signature, then on a completed
 * checkout creates a matching Printful order (see lib/printful.ts) as a
 * DRAFT — it lands in the Printful dashboard unconfirmed, nothing ships
 * automatically. Configure the endpoint (Stripe dashboard, or `stripe
 * listen` for local dev) and set STRIPE_WEBHOOK_SECRET.
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

      const printfulVariantId = Number(session.metadata?.printfulVariantId);
      const shipping = session.collected_information?.shipping_details;

      if (!printfulVariantId || !shipping?.address) {
        console.error(
          `[webhook] Can't create Printful order for ${session.id} — missing variant id or shipping address.`
        );
        break;
      }

      try {
        const order = await createPrintfulOrder({
          externalId: session.id,
          printfulVariantId,
          quantity: 1,
          recipient: {
            name: shipping.name ?? session.customer_details?.name ?? "Customer",
            email: session.customer_details?.email ?? undefined,
            address1: shipping.address.line1 ?? "",
            address2: shipping.address.line2 ?? undefined,
            city: shipping.address.city ?? "",
            state_code: shipping.address.state ?? undefined,
            country_code: shipping.address.country ?? "",
            zip: shipping.address.postal_code ?? "",
          },
        });
        console.log(
          `[webhook] Printful draft order ${order?.id ?? "(unknown id)"} created for ${session.id} — review and confirm it in the Printful dashboard.`
        );
      } catch (err) {
        // Payment already succeeded — log loudly so this gets a manual
        // follow-up rather than silently losing the order.
        console.error(`[webhook] Printful order creation FAILED for ${session.id}:`, err);
      }
      break;
    }
    default:
      // Ignore unhandled event types.
      break;
  }

  return NextResponse.json({ received: true });
}
