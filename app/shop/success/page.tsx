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
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="eyebrow text-stone mb-6">Order confirmed</p>
      <p className="font-[family-name:var(--font-display)] text-7xl sm:text-9xl text-forest leading-none tracking-tight">
        IT'S YOURS.
      </p>
      <p className="mt-6 font-[family-name:var(--font-serif)] text-xl text-ink">
        {itemName ? `Your ${itemName} is on the way.` : "Your order's in. The stickers are on the way."}
      </p>
      <p className="mt-2 font-[family-name:var(--font-mono)] text-sm text-stone">
        A receipt is headed to your inbox. Berry signed off on it.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/shop"
          className="bg-ink text-paper px-8 py-3 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest hover:bg-red transition-colors"
        >
          Back to the Shop
        </Link>
        <Link
          href="/community"
          className="border border-ink px-8 py-3 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest text-ink hover:bg-yellow transition-colors"
        >
          Join the Collective
        </Link>
      </div>
    </div>
  );
}
