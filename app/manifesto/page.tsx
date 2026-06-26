import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Manifesto",
  description:
    "Why an art collective masquerades as a sticker brand. The free + paid funnel, the four voices, and East Van as native ground.",
};

const sections = [
  {
    kicker: "01 — The Premise",
    title: "We're a collective wearing a sticker brand as a disguise.",
    accent: "#ffe135",
    body: [
      "On the surface: stickers. Underneath: an art practice run by a fractured psyche split into four people who don't fully agree on anything.",
      "The Sketcher can't stop drawing. The Philosopher won't stop questioning. The Documentarian only trusts the moment. The Editor thinks it's all too much. The tension between them is the work.",
    ],
  },
  {
    kicker: "02 — The Method",
    title: "Free and paid, mixed relentlessly.",
    accent: "#2d5f2e",
    body: [
      "Free sticker downloads. Free sketches. Free stories. Then the occasional premium pack. People who love the free stuff naturally find the paid stuff — that's the whole funnel.",
      "The work invites participation by design. The Sketcher releases unfinished lines. The Documentarian provides the blank space. The Philosopher asks the prompt. The Editor curates what comes back.",
    ],
  },
  {
    kicker: "03 — The Ground",
    title: "East Van isn't a backdrop. It's the source.",
    accent: "#cc0000",
    body: [
      "Street art, underground collectives, artist-run spaces — that's currency right now, and we're native to it, not fighting it.",
      "We document the real Vancouver, not the postcard. The angles are severe, the contrast is high, and the moment matters more than the pose.",
    ],
  },
  {
    kicker: "04 — The Invitation",
    title: "You're part of it now.",
    accent: "#808080",
    body: [
      "Add to the work. Remix it. Make it part of your own practice. Tag it with #addmore and #eastvan.",
      "Growth here is organic — people showing their friends because they're already inside. The collective isn't an audience. It's a roster.",
    ],
  },
];

export default function ManifestoPage() {
  return (
    <div>
      <header className="grain relative border-b border-mediumdark bg-ink">
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.4em] text-yellow mb-6">
            The Manifesto
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-6xl sm:text-8xl text-offwhite leading-[0.9]">
            SEE IT <span className="text-yellow">TWICE.</span>
            <br />
            <span className="text-gray">DRAW IT</span> <span className="text-red">AGAIN.</span>
          </h1>
        </div>
        <div className="divider-line" />
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16 space-y-20">
        {sections.map((s) => (
          <Reveal key={s.kicker}>
            <section style={{ borderLeft: `4px solid ${s.accent}` }} className="pl-6">
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-gray">
                {s.kicker}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-offwhite">
                {s.title}
              </h2>
              <div className="mt-5 space-y-4">
                {s.body.map((p, i) => (
                  <p key={i} className="font-[family-name:var(--font-serif)] text-xl leading-relaxed text-newsprint">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          </Reveal>
        ))}

        <Reveal>
          <blockquote className="bg-ink p-8 border-l-8 border-yellow">
            <p className="font-[family-name:var(--font-mono)] text-lg font-bold leading-relaxed text-offwhite">
              “When you look at a corner, you see two things: what it is, and what you imagine it
              should be. Both are real. The artist's job isn't to choose between them. It's to hold
              both at once and let that tension speak.”
            </p>
            <footer className="mt-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-gray">
              — Terry, the Philosopher
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </div>
  );
}
