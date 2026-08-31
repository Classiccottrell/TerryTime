import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { BuyButton } from "@/components/BuyButton";
import { CanceledBanner } from "@/components/CanceledBanner";

export const metadata: Metadata = {
  title: "Shop",
  description: "Terry stickers and merch — the full live Printful catalog, Stripe checkout.",
};

// Full live Printful catalog (see lib/products.ts).
const catalog = products;

export default function ShopPage() {
  return (
    <div className="shop-brutal" data-ink="cobalt">
      {/* ---- Header: wordmark + nav ---- */}
      <header className="brutal-border border-x-0 border-t-0 sticky top-0 z-40 bg-[var(--brutal-white)]">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold uppercase tracking-tight">
            Terry<span style={{ color: "var(--brutal-black)" }}>·</span>Time
          </Link>
          <nav className="flex items-center gap-6 text-sm font-bold uppercase tracking-wide">
            <Link href="/shop" className="brutal-btn !py-1.5 !px-3">Shop</Link>
            <Link href="#" className="brutal-btn !py-1.5 !px-3">Cart</Link>
          </nav>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="mx-auto max-w-[1400px] px-6 pt-16 pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4">
              [BRAND COPY — replace]
            </p>
            <h1 className="text-6xl sm:text-7xl font-bold uppercase tracking-tight leading-[0.9]">
              It&rsquo;s Terry
              <br />
              Time.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed">
              [BRAND COPY — replace: one or two sentences on what Terry Time is and why
              you should own a piece of it. Real stickers, real Printful stock, no filler.]
            </p>
          </div>

          {/* Photo collage: cobalt-tinted, asymmetric, rotated frames.
              NOTE: grayscale photo + translucent cobalt multiply overlay,
              not a flattened blue image — deliberate correction from an
              earlier draft. */}
          <div className="relative h-[420px] sm:h-[480px]">
            <CollageFrame
              src="/img/shop/graffiti-face.jpg"
              alt="East Van graffiti face"
              className="absolute left-0 top-0 w-[62%] h-[65%] -rotate-3 z-30"
            />
            <CollageFrame
              src="/img/shop/hedge-portrait.jpg"
              alt="Hedge portrait"
              className="absolute right-0 top-6 w-[48%] h-[55%] rotate-2 z-20"
            />
            <CollageFrame
              src="/img/shop/skyline-dusk.jpg"
              alt="East Van skyline at dusk"
              className="absolute left-[18%] bottom-0 w-[55%] h-[48%] rotate-1 z-10"
            />
          </div>
        </div>
      </section>

      <CanceledBanner />

      {/* ---- Product list: indexed, asymmetric two-column ---- */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24">
        <div className="brutal-divider mb-10" />
        <div className="grid gap-10 md:grid-cols-2">
          {catalog.map((p, i) => (
            <article
              key={p.id}
              className={`brutal-border p-6 flex flex-col gap-4 ${
                i % 2 === 1 ? "md:mt-16" : ""
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg font-bold">{p.price}</span>
              </div>
              <div className="relative w-full aspect-square brutal-border">
                <Image
                  src={p.image ?? `/img/products/${p.id}.svg`}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-4"
                  unoptimized={Boolean(p.image?.startsWith("http"))}
                />
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight">{p.name}</h3>
              <p className="text-sm leading-relaxed flex-1">{p.blurb}</p>
              <BuyButton product={p} />
            </article>
          ))}
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="brutal-border border-x-0 border-b-0">
        <div className="mx-auto max-w-[1400px] px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest">
          <span>&copy; {new Date().getFullYear()} Terry Time</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/shop" className="hover:underline">Shop</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CollageFrame({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <div className={`brutal-border overflow-hidden ${className}`}>
      <div className="relative w-full h-full grayscale">
        <Image src={src} alt={alt} fill sizes="50vw" className="object-cover" />
        {/* Translucent cobalt wash, multiply-blend — not a flattened blue image */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "var(--ink-cobalt)", opacity: 0.45, mixBlendMode: "multiply" }}
        />
      </div>
    </div>
  );
}
