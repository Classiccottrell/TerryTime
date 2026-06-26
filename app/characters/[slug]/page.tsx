import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "@/lib/characters";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return characters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCharacter(slug);
  if (!c) return { title: "Not found" };
  return { title: `${c.name} — ${c.role}`, description: c.bio };
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCharacter(slug);
  if (!c) notFound();

  const idx = characters.findIndex((x) => x.slug === c.slug);
  const next = characters[(idx + 1) % characters.length];

  return (
    <article>
      {/* Hero — full colour block in the character's primary */}
      <header
        className="grain grain-ink relative border-b border-ink text-paper"
        style={{ background: c.primary }}
      >
        <div className="relative mx-auto max-w-[1600px] px-6 sm:px-8 py-16 sm:py-20">
          <Link
            href="/characters"
            className="font-[family-name:var(--font-grotesk)] text-xs font-bold uppercase tracking-widest text-paper/80 hover:text-paper"
          >
            ← The Four
          </Link>
          <p className="eyebrow mt-10" style={{ color: c.accent }}>
            {c.role}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-7xl sm:text-[11rem] leading-[0.8] tracking-tight">
            {c.name}
          </h1>
          <p className="mt-5 max-w-xl font-[family-name:var(--font-serif)] text-xl italic text-paper/90">
            “{c.tagline}”
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 sm:px-8 py-16 grid gap-14">
        {/* Bio */}
        <Reveal>
          <section className="border-t-2 border-ink pt-6">
            <p className="eyebrow text-stone mb-4">Who</p>
            <p className="font-[family-name:var(--font-serif)] text-2xl sm:text-3xl leading-snug text-ink">
              {c.bio}
            </p>
          </section>
        </Reveal>

        {/* Voice + Themes */}
        <div className="grid gap-12 sm:grid-cols-2">
          <Reveal>
            <section>
              <p className="eyebrow text-stone mb-4">Voice & Tone</p>
              <ul className="space-y-3">
                {c.voice.map((v) => (
                  <li
                    key={v}
                    className="font-[family-name:var(--font-serif)] text-lg text-ink pl-4"
                    style={{ borderLeft: `3px solid ${c.accent}` }}
                  >
                    {v}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal delay={120}>
            <section>
              <p className="eyebrow text-stone mb-4">Content Themes</p>
              <ul className="flex flex-wrap gap-2">
                {c.themes.map((t) => (
                  <li
                    key={t}
                    className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide px-3 py-1.5 border border-ink text-ink"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </div>

        <div className="rule" />

        {/* Quotes */}
        <Reveal>
          <section>
            <p className="eyebrow text-stone mb-6">In their own words</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {c.quotes.map((q) => (
                <blockquote
                  key={q}
                  className="bg-cloud border border-line p-5 font-[family-name:var(--font-grotesk)] font-medium text-lg leading-snug text-ink"
                  style={{ borderLeft: `6px solid ${c.accent}` }}
                >
                  {q}
                </blockquote>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Palette */}
        <Reveal>
          <section>
            <p className="eyebrow text-stone mb-4">Palette</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Primary", hex: c.primary },
                { label: "Accent", hex: c.accent },
                { label: "Secondary", hex: c.secondary },
              ].map((s) => (
                <div key={s.label} className="border border-line">
                  <div className="h-16 w-28" style={{ background: s.hex }} />
                  <div className="px-3 py-2 font-[family-name:var(--font-spacemono)] text-xs text-ink bg-cloud">
                    <div className="text-stone uppercase">{s.label}</div>
                    {s.hex}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </div>

      {/* Next character */}
      <Link
        href={`/characters/${next.slug}`}
        className="group grain grain-ink relative block border-t border-ink text-paper"
        style={{ background: next.primary }}
      >
        <div className="mx-auto max-w-[1600px] px-6 sm:px-8 py-14 flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow text-paper/70">Next</p>
            <p className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl tracking-tight group-hover:opacity-80 transition-opacity">
              {next.name} — {next.role}
            </p>
          </div>
          <span className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl group-hover:translate-x-2 transition-transform">
            →
          </span>
        </div>
      </Link>
    </article>
  );
}
