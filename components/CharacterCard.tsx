import Link from "next/link";
import Image from "next/image";
import type { Character } from "@/lib/characters";

export function CharacterCard({ c }: { c: Character }) {
  return (
    <Link href={`/characters/${c.slug}`} className="ed-card group block h-full">
      <div className="ed-card__media relative h-44">
        <Image
          src={c.image}
          alt={`${c.name} — ${c.role}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,19,18,0.92) 0%, rgba(20,19,18,0.25) 55%, rgba(20,19,18,0) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 p-5">
          <p className="eyebrow" style={{ color: c.accent }}>
            {c.role}
          </p>
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-paper leading-none">
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
