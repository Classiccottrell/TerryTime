import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { palette, typeRoles, spacing } from "@/lib/design-tokens";
import { characters } from "@/lib/characters";
import { Icon, icons, type IconName } from "@/components/icons";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "The living library for Terry Terry Larry Berry — palette, type, voices, iconography, components, spacing, and motion in one place.",
};

const moodboard = [
  {
    img: "/img/characters/terry-the-philosopher.jpg",
    voice: "Philosopher",
    took: "Deep teal ground, terracotta figure, the red halo — and the star · eye · key talismans.",
  },
  {
    img: "/img/characters/larry-the-documentarian.jpg",
    voice: "Larry",
    took: "High-contrast documentary monochrome. The real East Van, not the postcard.",
  },
  {
    img: "/img/characters/terry-the-sketcher.jpg",
    voice: "Sketcher",
    took: "Indigo ballpoint over peach + mustard washes, on bone paper. Unfinished on purpose.",
  },
];

export default function DesignSystemPage() {
  return (
    <div className="bg-teal text-paper">
      {/* Hero */}
      <header className="grain grain-ink relative border-b border-lineink">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-8 py-20">
          <p className="eyebrow text-yellow">The Library</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-7xl sm:text-9xl tracking-tight leading-[0.82]">
            DESIGN SYSTEM
          </h1>
          <p className="mt-6 max-w-2xl font-[family-name:var(--font-serif)] text-xl text-paper/85">
            One place to see the whole language — palette, type, the four voices, iconography,
            components, spacing, and motion. Pulled from three source works: a teal outsider
            painting, a B&W East-Van street photo, and a raw ballpoint sketch.
          </p>
        </div>
        <div className="divider-line" />
      </header>

      <div className="mx-auto max-w-[1600px] px-6 sm:px-8 py-16 space-y-24">
        {/* MOODBOARD */}
        <Section n="01" title="Moodboard" note="The source works">
          <div className="grid gap-6 md:grid-cols-3">
            {moodboard.map((m, i) => (
              <Reveal key={m.img} delay={i * 80}>
                <figure className="border border-lineink bg-soot">
                  <div className="relative h-72 overflow-hidden">
                    <Image src={m.img} alt={`${m.voice} source work`} fill sizes="33vw" className="object-cover" />
                  </div>
                  <figcaption className="p-5">
                    <p className="eyebrow text-yellow">{m.voice}</p>
                    <p className="mt-2 font-[family-name:var(--font-serif)] text-paper/85">{m.took}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* COLOR */}
        <Section n="02" title="Colour" note="Tokens mirror @theme in globals.css">
          <div className="space-y-12">
            {palette.map((group) => (
              <div key={group.title}>
                <h3 className="font-[family-name:var(--font-grotesk)] font-bold text-2xl tracking-tight">
                  {group.title}
                </h3>
                <p className="mt-1 mb-5 font-[family-name:var(--font-serif)] text-paper/70 max-w-2xl">
                  {group.blurb}
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {group.swatches.map((s) => (
                    <div key={s.token} className="border border-lineink bg-soot">
                      <div
                        className="h-24 flex items-end justify-between p-3"
                        style={{ background: s.hex, color: s.dark ? "#EAE3D2" : "#122E36" }}
                      >
                        <span className="font-[family-name:var(--font-display)] text-2xl leading-none">Aa</span>
                        <span className="font-[family-name:var(--font-spacemono)] text-xs">{s.hex}</span>
                      </div>
                      <div className="p-3">
                        <div className="flex items-baseline justify-between">
                          <span className="font-[family-name:var(--font-grotesk)] font-semibold">{s.name}</span>
                          <code className="font-[family-name:var(--font-spacemono)] text-xs text-smoke">{s.token}</code>
                        </div>
                        <p className="mt-1 font-[family-name:var(--font-serif)] text-sm text-paper/70">{s.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* FOUR VOICES */}
        <Section n="03" title="The Four Voices" note="Each voice, one palette">
          <div className="grid gap-4">
            {characters.map((c) => (
              <Link
                key={c.slug}
                href={`/characters/${c.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border border-lineink bg-soot p-4 hover:border-yellow transition-colors"
              >
                <div className="relative h-16 w-16 overflow-hidden border border-lineink">
                  <Image src={c.image} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div>
                  <p className="eyebrow text-smoke">{c.role}</p>
                  <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight leading-none group-hover:text-yellow transition-colors">
                    {c.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  {[c.primary, c.accent, c.secondary].map((hex, i) => (
                    <div key={i} className="text-center">
                      <div className="h-10 w-14 border border-lineink" style={{ background: hex }} />
                      <code className="mt-1 block font-[family-name:var(--font-spacemono)] text-[10px] text-smoke">
                        {hex}
                      </code>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* TYPOGRAPHY */}
        <Section n="04" title="Typography" note="Five roles, one system">
          <div className="divide-y divide-lineink border-y border-lineink">
            {typeRoles.map((t) => (
              <div key={t.name} className="grid gap-3 py-7 md:grid-cols-[220px_1fr] md:gap-8">
                <div>
                  <p className="font-[family-name:var(--font-grotesk)] font-bold text-lg">{t.name}</p>
                  <p className="mt-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-smoke">
                    {t.role}
                  </p>
                </div>
                <p className={`${t.className} text-3xl sm:text-4xl leading-tight`}>{t.sample}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ICONOGRAPHY */}
        <Section n="05" title="Iconography" note="Talismans off the painting">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {(Object.keys(icons) as IconName[]).map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-3 border border-lineink bg-soot p-5 text-yellow"
              >
                <Icon name={name} size={44} />
                <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-smoke text-center">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* COMPONENTS (shown on bone, as they live on the site) */}
        <Section n="06" title="Components" note="Rendered on bone, as they appear in the wild">
          <div className="bg-paper text-ink border border-line p-6 sm:p-10 space-y-10">
            {/* Buttons */}
            <Demo label="Buttons">
              <div className="flex flex-wrap items-center gap-3">
                <button className="bg-ink text-paper px-7 py-3 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest hover:bg-red transition-colors">
                  Primary
                </button>
                <button className="border border-ink px-7 py-3 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest text-ink hover:bg-yellow transition-colors">
                  Outline
                </button>
                <button className="bg-yellow text-ink px-7 py-3 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors">
                  Accent
                </button>
                <button
                  disabled
                  className="bg-ink text-paper px-7 py-3 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest opacity-50"
                >
                  Disabled
                </button>
              </div>
            </Demo>

            {/* Eyebrow + tags */}
            <Demo label="Eyebrow & tags">
              <p className="eyebrow text-stone">01 — The Collective</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Process", "Duality", "East Van", "Restraint"].map((t) => (
                  <span
                    key={t}
                    className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide px-3 py-1.5 border border-ink text-ink"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Demo>

            {/* Card */}
            <Demo label="Card (.ed-card)">
              <div className="ed-card max-w-sm">
                <div className="ed-card__media relative h-32">
                  <Image src="/img/products/two-states.svg" alt="" fill sizes="384px" className="object-cover" />
                  <span className="absolute bottom-3 left-4 eyebrow text-paper/80">Philosopher</span>
                </div>
                <div className="p-5">
                  <h4 className="font-[family-name:var(--font-grotesk)] font-bold text-2xl tracking-tight">
                    Two States
                  </h4>
                  <p className="mt-2 font-[family-name:var(--font-serif)] text-ink/80">
                    Every sticker is two stickers. Hover me — image zoom + hard-shadow lift.
                  </p>
                </div>
              </div>
            </Demo>

            {/* Quote + input */}
            <div className="grid gap-6 md:grid-cols-2">
              <Demo label="Quote block">
                <blockquote className="bg-ink text-paper p-5 border-l-8 border-yellow font-[family-name:var(--font-grotesk)] font-medium text-lg leading-snug">
                  See it twice. The way it is, and the way you imagined it.
                </blockquote>
              </Demo>
              <Demo label="Input">
                <input
                  readOnly
                  placeholder="you@eastvan.ca"
                  className="w-full border border-ink bg-cloud px-4 py-3 font-[family-name:var(--font-mono)] text-ink placeholder:text-stone focus:bg-paper focus:border-red outline-none"
                />
              </Demo>
            </div>

            {/* Rules + divider */}
            <Demo label="Rules & divider">
              <div className="space-y-4">
                <div className="rule" />
                <div className="divider-line" />
              </div>
            </Demo>
          </div>

          {/* Ticker (dark) */}
          <div className="mt-6">
            <Demo label="Ticker" dark>
              <div className="bg-ink text-yellow overflow-hidden border border-lineink font-[family-name:var(--font-spacemono)] text-xs font-bold tracking-[0.2em] py-2 px-4 whitespace-nowrap">
                IT'S TERRY TIME — ONE STICKER. INFINITE HUSTLE. — #EASTVAN —
              </div>
            </Demo>
          </div>
        </Section>

        {/* SPACING */}
        <Section n="07" title="Spacing & radius" note="8px base grid · 0px radius">
          <div className="space-y-3">
            {spacing.map((s) => (
              <div key={s.step} className="flex items-center gap-4">
                <code className="w-16 font-[family-name:var(--font-spacemono)] text-sm text-smoke">
                  {s.px}px
                </code>
                <div className="h-6 bg-yellow" style={{ width: s.px * 3 }} />
                <span className="font-[family-name:var(--font-serif)] text-paper/70 text-sm">
                  space-{s.step}
                </span>
              </div>
            ))}
            <p className="pt-4 font-[family-name:var(--font-serif)] text-paper/70 max-w-2xl">
              Corners are always sharp (radius 0) — raw, underground, no softness. Cards lift on
              hover with a hard offset shadow rather than a blur.
            </p>
          </div>
        </Section>

        {/* MOTION */}
        <Section n="08" title="Motion" note="Restrained, meaningful">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { t: "Scroll reveal", d: "Sections fade + rise 24px once, on enter. 0.6s, ease-out-cubic. Honoured only when motion is allowed." },
              { t: "Hover lift", d: "Cards translate up 4px and drop a hard ink shadow; media images scale to 1.05. 0.25s." },
              { t: "Ticker", d: "The underground signature — a seamless 32s marquee. Pauses for prefers-reduced-motion." },
            ].map((m) => (
              <div key={m.t} className="border border-lineink bg-soot p-6">
                <p className="font-[family-name:var(--font-grotesk)] font-bold text-xl tracking-tight text-yellow">
                  {m.t}
                </p>
                <p className="mt-2 font-[family-name:var(--font-serif)] text-paper/80">{m.d}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  n,
  title,
  note,
  children,
}: {
  n: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="border-t-2 border-lineink pt-5 mb-8">
        <p className="eyebrow text-smoke">
          {n} — {note}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-grotesk)] font-bold text-4xl sm:text-5xl tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Demo({
  label,
  dark,
  children,
}: {
  label: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        className={`font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest mb-3 ${
          dark ? "text-smoke" : "text-stone"
        }`}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
