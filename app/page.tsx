import Link from "next/link";
import Image from "next/image";
import { characters } from "@/lib/characters";
import { products } from "@/lib/products";
import { CharacterCard } from "@/components/CharacterCard";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <>
      {/* ---------- HERO (paper / editorial) ---------- */}
      <section className="grain relative border-b border-ink">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="eyebrow text-stone">East Van</span>
            <span className="h-px w-8 bg-ink" />
            <span className="eyebrow text-stone">Underground</span>
            <span className="h-px w-8 bg-ink" />
            <span className="eyebrow text-stone">Est. whenever</span>
          </div>

          <h1 className="font-[family-name:var(--font-display)] tracking-tight leading-[0.82] text-ink text-[19vw] sm:text-[15vw] lg:text-[12.5rem]">
            TERRY TERRY
            <br />
            <span className="text-red">LARRY</span> <span className="text-forest">BERRY</span>
          </h1>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <p className="max-w-2xl font-[family-name:var(--font-serif)] text-xl sm:text-2xl leading-snug text-ink">
              An art collective masquerading as a sticker brand. Four voices, one fractured
              psyche. The Sketcher draws. The Philosopher doubts. The Documentarian shoots.
              The Editor says no.
            </p>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/shop"
                className="bg-ink text-paper px-7 py-3.5 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest hover:bg-red transition-colors"
              >
                Enter the Studio
              </Link>
              <Link
                href="/characters"
                className="border border-ink px-7 py-3.5 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest text-ink hover:bg-yellow transition-colors"
              >
                Meet the Four
              </Link>
            </div>
          </div>
        </div>
        <div className="divider-line" />
      </section>

      {/* ---------- GALLERY BANNER (image-forward, all four voices) ---------- */}
      <section className="border-b border-ink bg-ink">
        <div className="relative w-full aspect-[1600/520]">
          <Image
            src="/img/hero-collective.svg"
            alt="The four voices — the Sketcher, the Philosopher, the Documentarian, and the Editor"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* ---------- THE FOUR (paper / editorial grid) ---------- */}
      <section className="mx-auto max-w-[1600px] px-6 sm:px-8 py-20">
        <Reveal>
          <SectionHead
            number="01"
            kicker="The Collective"
            link={{ href: "/characters", label: "All four" }}
          >
            Four voices that <span className="text-red">blend</span>, never reduce.
          </SectionHead>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {characters.map((c, i) => (
            <Reveal key={c.slug} delay={i * 80}>
              <CharacterCard c={c} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- MANIFESTO (ink block / high contrast) ---------- */}
      <section className="grain grain-ink relative bg-ink text-paper border-y border-ink">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 py-24 text-center">
          <Reveal>
            <p className="eyebrow text-yellow mb-8">02 — The Idea</p>
            <blockquote className="font-[family-name:var(--font-grotesk)] font-medium text-3xl sm:text-5xl leading-[1.05] tracking-tight">
              Community is embedded in the work itself. The stickers invite participation.
              People add to them, remix them, make them their own.
              <span className="text-yellow"> You're part of it now.</span>
            </blockquote>
            <Link
              href="/manifesto"
              className="mt-10 inline-block font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest text-paper border-b-2 border-yellow pb-1 hover:text-yellow transition-colors"
            >
              Read the Manifesto →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- SHOP PREVIEW (paper / editorial) ---------- */}
      <section className="mx-auto max-w-[1600px] px-6 sm:px-8 py-20">
        <Reveal>
          <SectionHead
            number="03"
            kicker="The Goods"
            link={{ href: "/shop", label: "Full shop" }}
          >
            Free <span className="text-forest">+</span> paid, <span className="text-red">relentlessly.</span>
          </SectionHead>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <Link href="/shop" className="ed-card group block h-full">
                <div className="ed-card__media relative h-36">
                  <Image
                    src={`/img/products/${p.id}.svg`}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 left-4 eyebrow text-paper/80">
                    {p.voice}
                  </span>
                </div>
                <div className="p-5">
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
                  <p className="mt-2 font-[family-name:var(--font-serif)] text-ink/80">{p.blurb}</p>
                  <p className="mt-4 font-[family-name:var(--font-spacemono)] text-xs text-stone">
                    {p.count}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- JOIN CTA (electric yellow block) ---------- */}
      <section className="bg-yellow border-t border-ink">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 py-24 text-center">
          <Reveal>
            <h2 className="font-[family-name:var(--font-display)] text-6xl sm:text-8xl tracking-tight text-ink leading-[0.85]">
              IT'S TERRY TIME
            </h2>
            <p className="mt-5 font-[family-name:var(--font-serif)] text-xl text-ink/80">
              Free sketches, sticker drops, and the #addmore challenge — straight to your inbox.
            </p>
            <Link
              href="/community"
              className="mt-9 inline-block bg-ink text-paper px-10 py-4 font-[family-name:var(--font-grotesk)] text-base font-bold uppercase tracking-widest hover:bg-red transition-colors"
            >
              Join the Collective
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function SectionHead({
  number,
  kicker,
  link,
  children,
}: {
  number: string;
  kicker: string;
  link?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="border-t-2 border-ink pt-5">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow text-stone mb-3">
            {number} — {kicker}
          </p>
          <h2 className="font-[family-name:var(--font-grotesk)] font-bold text-4xl sm:text-6xl tracking-tight text-ink max-w-3xl">
            {children}
          </h2>
        </div>
        {link && (
          <Link
            href={link.href}
            className="font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest text-ink border-b-2 border-yellow pb-1 hover:text-red transition-colors whitespace-nowrap"
          >
            {link.label} →
          </Link>
        )}
      </div>
    </div>
  );
}
