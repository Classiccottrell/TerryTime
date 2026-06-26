import Link from "next/link";
import type { Character } from "@/lib/characters";

export function CharacterCard({ c }: { c: Character }) {
  return (
    <Link
      href={`/characters/${c.slug}`}
      className="group relative block overflow-hidden border border-mediumdark bg-ink transition-transform duration-200 hover:-translate-y-1"
      style={{ borderLeft: `4px solid ${c.accent}` }}
    >
      <div
        className="grain relative h-40 flex items-end p-5"
        style={{ background: `linear-gradient(135deg, ${c.primary} 0%, #0f0f0f 100%)` }}
      >
        <span
          className="font-[family-name:var(--font-display)] text-7xl leading-none opacity-20 absolute top-2 right-4"
          style={{ color: c.accent }}
          aria-hidden="true"
        >
          {c.name[0]}
        </span>
        <div className="relative">
          <p className="font-[family-name:var(--font-display)] text-4xl tracking-wider text-offwhite">
            {c.name}
          </p>
          <p
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest"
            style={{ color: c.accent }}
          >
            {c.role}
          </p>
        </div>
      </div>
      <div className="p-5">
        <p className="font-[family-name:var(--font-mono)] text-sm italic text-newsprint">
          “{c.tagline}”
        </p>
        <p className="mt-4 inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-gray group-hover:text-yellow transition-colors">
          Meet {c.name} →
        </p>
      </div>
    </Link>
  );
}
