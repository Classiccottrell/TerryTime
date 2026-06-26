import type { Metadata } from "next";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let itemName: string | null = null;
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

  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="font-[family-name:var(--font-display)] text-7xl sm:text-8xl text-forest leading-none">
        IT'S YOURS.
      </p>
      <p className="mt-6 font-[family-name:var(--font-serif)] text-xl text-newsprint">
        {itemName
          ? `Your ${itemName} is on the way.`
          : "Your order's in. The stickers are on the way."}
      </p>
      <p className="mt-2 font-[family-name:var(--font-mono)] text-sm text-gray">
        A receipt is headed to your inbox. Berry signed off on it.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/shop"
          className="border-2 border-yellow px-8 py-3 font-[family-name:var(--font-display)] text-lg tracking-widest text-yellow hover:bg-yellow hover:text-ink transition-colors"
        >
          BACK TO THE SHOP
        </Link>
        <Link
          href="/community"
          className="border-2 border-newsprint px-8 py-3 font-[family-name:var(--font-display)] text-lg tracking-widest text-newsprint hover:border-yellow hover:text-yellow transition-colors"
        >
          JOIN THE COLLECTIVE
        </Link>
      </div>
    </div>
  );
}
