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
  return {
    title: `${c.name} — ${c.role}`,
    description: c.bio,
  };
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
      {/* Hero band tinted to the character */}
      <header
        className="grain relative border-b border-mediumdark"
        style={{ background: `linear-gradient(135deg, ${c.primary} 0%, #0f0f0f 100%)` }}
      >
        <div className="relative mx-auto max-w-[1440px] px-6 py-20">
          <Link
            href="/characters"
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-newsprint hover:text-yellow"
          >
            ← The Four
          </Link>
          <p
            className="mt-8 font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.3em]"
            style={{ color: c.accent }}
          >
            {c.role}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-7xl sm:text-9xl text-offwhite leading-none">
            {c.name}
          </h1>
          <p className="mt-4 max-w-xl font-[family-name:var(--font-mono)] text-lg italic text-newsprint">
            “{c.tagline}”
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-16 grid gap-14">
        {/* Bio */}
        <Reveal>
          <section>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-gray mb-4">
              Who
            </p>
            <p className="font-[family-name:var(--font-serif)] text-2xl leading-relaxed text-offwhite">
              {c.bio}
            </p>
          </section>
        </Reveal>

        <div className="divider-line" />

        {/* Voice + Themes */}
        <div className="grid gap-12 sm:grid-cols-2">
          <Reveal>
            <section>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-gray mb-4">
                Voice & Tone
              </p>
              <ul className="space-y-3">
                {c.voice.map((v) => (
                  <li
                    key={v}
                    className="font-[family-name:var(--font-serif)] text-lg text-newsprint pl-4"
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
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-gray mb-4">
                Content Themes
              </p>
              <ul className="flex flex-wrap gap-2">
                {c.themes.map((t) => (
                  <li
                    key={t}
                    className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide px-3 py-1.5 border"
                    style={{ borderColor: c.accent, color: c.accent }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </div>

        <div className="divider-line" />

        {/* Quotes */}
        <Reveal>
          <section>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-gray mb-6">
              In their own words
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {c.quotes.map((q) => (
                <blockquote
                  key={q}
                  className="bg-ink p-5 font-[family-name:var(--font-mono)] text-sm font-bold leading-relaxed text-offwhite"
                  style={{ borderLeft: `8px solid ${c.accent}` }}
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
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-gray mb-4">
              Palette
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Primary", hex: c.primary },
                { label: "Accent", hex: c.accent },
                { label: "Secondary", hex: c.secondary },
              ].map((s) => (
                <div key={s.label} className="border border-mediumdark">
                  <div className="h-16 w-28" style={{ background: s.hex }} />
                  <div className="px-3 py-2 font-[family-name:var(--font-spacemono)] text-xs text-newsprint">
                    <div className="text-gray uppercase">{s.label}</div>
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
        className="group block border-t border-mediumdark"
        style={{ background: `linear-gradient(135deg, #0f0f0f 0%, ${next.primary} 100%)` }}
      >
        <div className="mx-auto max-w-[1440px] px-6 py-12 flex items-center justify-between">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-gray">
              Next
            </p>
            <p className="font-[family-name:var(--font-display)] text-5xl text-offwhite group-hover:text-yellow transition-colors">
              {next.name} — {next.role}
            </p>
          </div>
          <span className="font-[family-name:var(--font-display)] text-5xl text-newsprint group-hover:translate-x-2 transition-transform">
            →
          </span>
        </div>
      </Link>
    </article>
  );
}
