import Link from "next/link";
import type { Character } from "@/lib/characters";

export function CharacterCard({ c }: { c: Character }) {
  return (
    <Link href={`/characters/${c.slug}`} className="ed-card group block h-full">
      <div
        className="ed-card__media grain relative h-44 flex items-end p-5"
        style={{ background: c.primary }}
      >
        <span
          className="font-[family-name:var(--font-display)] text-[9rem] leading-none absolute -top-6 right-2 opacity-25"
          style={{ color: c.accent }}
          aria-hidden="true"
        >
          {c.name[0]}
        </span>
        <div className="relative">
          <p className="eyebrow" style={{ color: c.accent }}>
            {c.role}
          </p>
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-paper">
            {c.name}
          </p>
        </div>
      </div>
      <div className="p-5">
        <p className="font-[family-name:var(--font-serif)] text-lg italic text-ink leading-snug">
          “{c.tagline}”
        </p>
        <p className="mt-4 inline-flex items-center gap-2 font-[family-name:var(--font-grotesk)] text-xs font-semibold uppercase tracking-widest text-stone group-hover:text-red transition-colors">
          Meet {c.name}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </p>
      </div>
    </Link>
  );
}
