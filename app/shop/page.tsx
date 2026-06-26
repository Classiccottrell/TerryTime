import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/lib/products";
import { Reveal } from "@/components/Reveal";
import { BuyButton } from "@/components/BuyButton";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Free downloads and premium sticker packs. One sticker. Infinite hustle. The free + paid funnel, relentlessly.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;
  const free = products.filter((p) => p.free);
  const paid = products.filter((p) => !p.free);

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-16">
      <header className="max-w-2xl">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-yellow">
          The Goods
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-6xl sm:text-7xl text-offwhite">
          One sticker. Infinite hustle.
        </h1>
        <p className="mt-5 font-[family-name:var(--font-serif)] text-xl text-newsprint">
          Mix free and paid relentlessly. Download the free stuff. Remix it. Tag it. The
          packs you love most are the ones you'll end up holding.
        </p>
      </header>

      {canceled && (
        <div className="mt-8 border-2 border-red bg-ink p-4 font-[family-name:var(--font-mono)] text-sm text-newsprint">
          <span className="text-red">Checkout canceled.</span> No charge. Berry says take your
          time.
        </div>
      )}

      {/* Free */}
      <section className="mt-14">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-[family-name:var(--font-display)] text-3xl text-forest">FREE</span>
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-gray">
            download & remix
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {free.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Paid */}
      <section className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-[family-name:var(--font-display)] text-3xl text-yellow">PACKS</span>
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-gray">
            premium drops
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paid.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Note */}
      <div className="mt-16 border border-mediumdark bg-ink p-6 font-[family-name:var(--font-mono)] text-sm text-gray">
        <span className="text-red">Note —</span> paid packs check out securely through Stripe;
        orders are passed to print-on-demand fulfilment. Want drops before anyone else?{" "}
        <Link href="/community" className="text-yellow hover:underline">
          Get on the list →
        </Link>
      </div>
    </div>
  );
}

function ProductCard({ p }: { p: (typeof products)[number] }) {
  return (
    <div
      className="h-full border border-mediumdark bg-ink p-6 flex flex-col"
      style={{ borderTop: `4px solid ${p.accent}` }}
    >
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-gray">
          {p.voice}
        </span>
        <span
          className="font-[family-name:var(--font-display)] text-2xl"
          style={{ color: p.free ? "#2d5f2e" : "#ffe135" }}
        >
          {p.price}
        </span>
      </div>
      <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-offwhite">
        {p.name}
      </h3>
      <p className="mt-2 flex-1 font-[family-name:var(--font-serif)] text-newsprint">
        {p.blurb}
      </p>
      <p className="mt-4 font-[family-name:var(--font-spacemono)] text-xs text-gray">{p.count}</p>
      <BuyButton product={p} />
    </div>
  );
}
