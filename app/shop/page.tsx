import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { Reveal } from "@/components/Reveal";
import { BuyButton } from "@/components/BuyButton";
import { CanceledBanner } from "@/components/CanceledBanner";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Free downloads and premium sticker packs. One sticker. Infinite hustle. The free + paid funnel, relentlessly.",
};

export default function ShopPage() {
  const free = products.filter((p) => p.free);
  const paid = products.filter((p) => !p.free);

  return (
    <div className="mx-auto max-w-[1600px] px-6 sm:px-8 py-16">
      <header className="border-t-2 border-ink pt-6 max-w-3xl">
        <p className="eyebrow text-stone">The Goods</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-6xl sm:text-8xl tracking-tight leading-[0.85] text-ink">
          One sticker. Infinite hustle.
        </h1>
        <p className="mt-6 font-[family-name:var(--font-serif)] text-xl text-ink/80">
          Mix free and paid relentlessly. Download the free stuff. Remix it. Tag it. The
          packs you love most are the ones you'll end up holding.
        </p>
      </header>

      <CanceledBanner />

      {/* Free */}
      <section className="mt-14">
        <div className="flex items-center gap-3 mb-6 border-b border-ink pb-3">
          <span className="font-[family-name:var(--font-display)] text-3xl text-forest tracking-tight">
            FREE
          </span>
          <span className="eyebrow text-stone">download & remix</span>
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
        <div className="flex items-center gap-3 mb-6 border-b border-ink pb-3">
          <span className="font-[family-name:var(--font-display)] text-3xl text-ink tracking-tight">
            PACKS
          </span>
          <span className="eyebrow text-stone">premium drops</span>
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
      <div className="mt-16 bg-ink text-paper p-6 font-[family-name:var(--font-mono)] text-sm">
        <span className="text-yellow">Note —</span> paid packs check out securely through Stripe;
        orders are passed to print-on-demand fulfilment. Want drops before anyone else?{" "}
        <Link href="/community" className="text-yellow underline underline-offset-4">
          Get on the list →
        </Link>
      </div>
    </div>
  );
}

function ProductCard({ p }: { p: (typeof products)[number] }) {
  return (
    <div className="ed-card flex h-full flex-col">
      <div className="ed-card__media relative h-40">
        <Image
          src={`/img/products/${p.id}.svg`}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute bottom-3 left-5 eyebrow text-paper/80">{p.voice}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-[family-name:var(--font-grotesk)] font-bold text-2xl tracking-tight text-ink">
            {p.name}
          </h3>
          <span
            className="font-[family-name:var(--font-display)] text-2xl"
            style={{ color: p.free ? "#1f6f43" : "#141312" }}
          >
            {p.price}
          </span>
        </div>
        <p className="mt-2 flex-1 font-[family-name:var(--font-serif)] text-ink/80">{p.blurb}</p>
        <p className="mt-4 font-[family-name:var(--font-spacemono)] text-xs text-stone">{p.count}</p>
        <BuyButton product={p} />
      </div>
    </div>
  );
}
