import { NextResponse } from "next/server";
import { getVariant } from "@/lib/products";
import { parseDestination } from "@/lib/regions";
import { quoteShipping } from "@/lib/shipping";

export const runtime = "nodejs";

/**
 * Shows the buyer their shipping cost before they commit. /api/checkout
 * computes the same quote again server-side; nothing the client sends here
 * is trusted for the charge.
 */
export async function POST(req: Request) {
  let body: { variantId?: string; destination?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const found = body.variantId ? getVariant(body.variantId) : undefined;
  if (!found) return NextResponse.json({ error: "Unknown product." }, { status: 404 });

  const dest = parseDestination(body.destination);
  if (!dest.ok) return NextResponse.json({ error: dest.error }, { status: 400 });

  const quote = await quoteShipping({
    printfulVariantId: found.variant.printfulVariantId,
    quantity: 1,
    destination: dest.destination,
  });
  return NextResponse.json({
    amountCents: quote.amountCents,
    estimate: quote.estimate,
    totalCents: found.variant.priceCents + quote.amountCents,
  });
}
