import type { Metadata } from "next";
import { characters } from "@/lib/characters";
import { CharacterCard } from "@/components/CharacterCard";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "The Four Voices",
  description:
    "The Sketcher, the Philosopher, the Documentarian, and the Editor — four voices that must blend, never reduce.",
};

export default function CharactersPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 sm:px-8 py-16">
      <header className="border-t-2 border-ink pt-6 max-w-3xl">
        <p className="eyebrow text-stone">The Collective</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-6xl sm:text-8xl tracking-tight leading-[0.85] text-ink">
          A fractured psyche, in four parts.
        </h1>
        <p className="mt-6 font-[family-name:var(--font-serif)] text-xl text-ink/80">
          The brand exists in four distinct voices. They argue. They overrule each other.
          Together they make the work. Never design for one alone.
        </p>
      </header>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {characters.map((c, i) => (
          <Reveal key={c.slug} delay={i * 80}>
            <CharacterCard c={c} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
