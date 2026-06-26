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
    accent: "#cc0000",
  },
  {
    tag: "Discord",
    title: "Where the Voices Argue",
    body: "All four characters hang out and bicker in public. Prompts from the Philosopher, cuts from the Editor, schemes from Larry.",
    accent: "#2d5f2e",
  },
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-16">
      <header className="max-w-2xl">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-yellow">
          The Collective
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-6xl sm:text-7xl text-offwhite">
          You're part of it now.
        </h1>
        <p className="mt-5 font-[family-name:var(--font-serif)] text-xl text-newsprint">
          The work demands engagement. Add to it, remix it, make it part of your own practice.
          Growth here is people showing their friends — because they're already inside.
        </p>
      </header>

      {/* Signup */}
      <section className="mt-14 border border-mediumdark bg-ink">
        <div className="divider-line" />
        <div className="grid gap-10 p-8 sm:p-12 md:grid-cols-2 items-center">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-5xl text-offwhite">
              IT'S <span className="text-yellow">TERRY TIME</span>
            </h2>
            <p className="mt-4 font-[family-name:var(--font-serif)] text-lg text-newsprint">
              Free sketches, sticker drops before anyone else, and the monthly #addmore zine —
              straight to your inbox. No noise. Berry made sure of it.
            </p>
          </div>
          <SignupForm />
        </div>
      </section>

      {/* Channels */}
      <section className="mt-16">
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-offwhite mb-8">
          Ways in
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {channels.map((c, i) => (
            <Reveal key={c.tag} delay={i * 80}>
              <div
                className="h-full border border-mediumdark bg-ink p-6"
                style={{ borderTop: `4px solid ${c.accent}` }}
              >
                <p
                  className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest"
                  style={{ color: c.accent }}
                >
                  {c.tag}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-offwhite">
                  {c.title}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-serif)] text-newsprint">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
