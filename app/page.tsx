import Link from "next/link";
import { characters } from "@/lib/characters";
import { products } from "@/lib/products";
import { CharacterCard } from "@/components/CharacterCard";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="grain relative overflow-hidden border-b border-mediumdark">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, #1a1a1a 0%, #0f0f0f 55%, #000 100%)",
          }}
        />
        <div className="relative mx-auto max-w-[1440px] px-6 py-24 sm:py-32 text-center">
          <p className="font-[family-name:var(--font-mono)] text-xs sm:text-sm uppercase tracking-[0.4em] text-yellow mb-6">
            East Van · Underground · Since whenever
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-6xl sm:text-8xl lg:text-[10rem] leading-[0.85] text-offwhite">
            TERRY TERRY
            <br />
            <span className="text-yellow">LARRY</span> <span className="text-red">BERRY</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-[family-name:var(--font-serif)] text-xl sm:text-2xl text-newsprint">
            An art collective masquerading as a sticker brand. Four voices, one fractured
            psyche. The Sketcher draws. The Philosopher doubts. The Documentarian shoots.
            The Editor says no.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="border-2 border-yellow bg-ink px-8 py-3 font-[family-name:var(--font-display)] text-lg tracking-widest text-yellow transition-colors hover:bg-yellow hover:text-ink"
            >
              ENTER THE STUDIO
            </Link>
            <Link
              href="/characters"
              className="border-2 border-newsprint px-8 py-3 font-[family-name:var(--font-display)] text-lg tracking-widest text-newsprint transition-colors hover:border-yellow hover:text-yellow"
            >
              MEET THE FOUR
            </Link>
          </div>
        </div>
        <div className="divider-line" />
      </section>

      {/* ---------- THE FOUR ---------- */}
      <section className="mx-auto max-w-[1440px] px-6 py-20">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-gray">
                01 — The Collective
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-5xl sm:text-6xl text-offwhite">
                Four voices that <span className="text-yellow">blend</span>, never reduce.
              </h2>
            </div>
            <Link
              href="/characters"
              className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-newsprint hover:text-yellow"
            >
              All four →
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {characters.map((c, i) => (
            <Reveal key={c.slug} delay={i * 80}>
              <CharacterCard c={c} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- MANIFESTO STRIP ---------- */}
      <section className="border-y border-mediumdark bg-ink">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <Reveal>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-red mb-6">
              02 — The Idea
            </p>
            <blockquote className="font-[family-name:var(--font-serif)] text-2xl sm:text-3xl leading-snug text-offwhite">
              “Community is embedded in the work itself. The stickers invite participation.
              People add to them, remix them, make them part of their own practice.
              <span className="text-yellow"> You're part of it now.</span>”
            </blockquote>
            <Link
              href="/manifesto"
              className="mt-8 inline-block font-[family-name:var(--font-display)] text-lg tracking-widest text-newsprint border-b-2 border-yellow hover:text-yellow"
            >
              READ THE MANIFESTO
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- SHOP PREVIEW ---------- */}
      <section className="mx-auto max-w-[1440px] px-6 py-20">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-gray">
                03 — The Goods
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-5xl sm:text-6xl text-offwhite">
                Free <span className="text-forest">+</span> paid, <span className="text-red">relentlessly.</span>
              </h2>
            </div>
            <Link
              href="/shop"
              className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-newsprint hover:text-yellow"
            >
              Full shop →
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
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
                <p className="mt-2 flex-1 text-newsprint">{p.blurb}</p>
                <p className="mt-4 font-[family-name:var(--font-spacemono)] text-xs text-gray">
                  {p.count}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- JOIN CTA ---------- */}
      <section className="border-t border-mediumdark bg-gradient-to-b from-ink to-trueblack">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <Reveal>
            <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl text-offwhite">
              IT'S <span className="text-yellow">TERRY TIME</span>
            </h2>
            <p className="mt-4 font-[family-name:var(--font-serif)] text-xl text-newsprint">
              Free sketches, sticker drops, and the #addmore challenge — straight to your inbox.
            </p>
            <Link
              href="/community"
              className="mt-8 inline-block border-2 border-yellow bg-yellow px-10 py-4 font-[family-name:var(--font-display)] text-xl tracking-widest text-ink transition-transform hover:scale-[0.98]"
            >
              JOIN THE COLLECTIVE
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
