import type { Metadata } from "next";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { isStaticExport } from "@/lib/site";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  let itemName: string | null = null;
  // On a static host there's no server-side Stripe lookup (and no request-time
  // searchParams). The generic confirmation below is shown instead.
  if (!isStaticExport) {
    const { session_id } = await searchParams;
    const stripe = getStripe();
    if (stripe && session_id) {
      try {
        const session = await stripe.checkout.sessions.retrieve(session_id, {
          expand: ["line_items"],
        });
        itemName = session.line_items?.data?.[0]?.description ?? null;
      } catch {
        // Ignore — show the generic confirmation.
      }
    }
  }

  return (
    <main className="shop-design shop-success" data-ink="cobalt">
      <p className="shop-kicker">Order confirmed</p>
      <h1>It&apos;s<br />yours.</h1>
      <p className="shop-success__line">
        {itemName ? `Your ${itemName} is on the way.` : "Your order's in. It's on the way."}
      </p>
      <p className="shop-success__note">A receipt is headed to your inbox.</p>
      <Link href="/shop" className="shop-text-link">
        Back to the shop <span>↗</span>
      </Link>
    </main>
  );
}
