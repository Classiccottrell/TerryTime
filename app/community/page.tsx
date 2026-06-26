import type { Metadata } from "next";
import { SignupForm } from "@/components/SignupForm";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the collective. Free drops, the #addmore challenge, and a Discord where the four voices argue in public.",
};

const channels = [
  {
    tag: "#addmore",
    title: "The Remix Challenge",
    body: "The Sketcher drops an unfinished line. You finish it. Tag #addmore and the Editor curates the best back onto the feed.",
    accent: "#ffe135",
  },
  {
    tag: "#eastvan",
    title: "Document the Block",
    body: "Larry's domain. Shoot the real Vancouver — severe angles, high contrast, no postcards — and tag it in.",
    accent: "#e0301e",
  },
  {
    tag: "Discord",
    title: "Where the Voices Argue",
    body: "All four characters hang out and bicker in public. Prompts from the Philosopher, cuts from the Editor, schemes from Larry.",
    accent: "#1f6f43",
  },
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 sm:px-8 py-16">
      <header className="border-t-2 border-ink pt-6 max-w-3xl">
        <p className="eyebrow text-stone">The Collective</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-6xl sm:text-8xl tracking-tight leading-[0.85] text-ink">
          You're part of it now.
        </h1>
        <p className="mt-6 font-[family-name:var(--font-serif)] text-xl text-ink/80">
          The work demands engagement. Add to it, remix it, make it part of your own practice.
          Growth here is people showing their friends — because they're already inside.
        </p>
      </header>

      {/* Signup — ink block */}
      <section className="mt-14 bg-ink text-paper">
        <div className="divider-line" />
        <div className="grid gap-10 p-8 sm:p-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl tracking-tight">
              IT'S <span className="text-yellow">TERRY TIME</span>
            </h2>
            <p className="mt-4 font-[family-name:var(--font-serif)] text-lg text-smoke">
              Free sketches, sticker drops before anyone else, and the monthly #addmore zine —
              straight to your inbox. No noise. Berry made sure of it.
            </p>
          </div>
          <SignupForm />
        </div>
      </section>

      {/* Channels */}
      <section className="mt-16">
        <h2 className="font-[family-name:var(--font-grotesk)] font-bold text-4xl tracking-tight text-ink mb-8 border-b border-ink pb-4">
          Ways in
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {channels.map((c, i) => (
            <Reveal key={c.tag} delay={i * 80}>
              <div className="ed-card h-full">
                <div className="ed-card__media h-3" style={{ background: c.accent }} />
                <div className="p-6">
                  <p className="eyebrow" style={{ color: c.accent === "#ffe135" ? "#a98f00" : c.accent }}>
                    {c.tag}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-grotesk)] font-bold text-2xl tracking-tight text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-2 font-[family-name:var(--font-serif)] text-ink/80">{c.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
