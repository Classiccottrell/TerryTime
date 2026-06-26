import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="divider-line" />
      <div className="mx-auto max-w-[1600px] px-8 py-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl tracking-tight leading-[0.9]">
            TERRY TERRY<br />LARRY BERRY
          </p>
          <p className="mt-4 font-[family-name:var(--font-serif)] text-lg text-smoke max-w-sm">
            An East Van underground art collective masquerading as a sticker brand.
          </p>
        </div>

        <div className="font-[family-name:var(--font-grotesk)] text-sm">
          <p className="eyebrow text-yellow mb-4">Wander</p>
          <ul className="space-y-2.5 text-paper/90">
            <li><Link href="/characters" className="hover:text-yellow transition-colors">The Four Voices</Link></li>
            <li><Link href="/shop" className="hover:text-yellow transition-colors">Sticker Shop</Link></li>
            <li><Link href="/manifesto" className="hover:text-yellow transition-colors">Manifesto</Link></li>
            <li><Link href="/community" className="hover:text-yellow transition-colors">Join the Collective</Link></li>
          </ul>
        </div>

        <div className="font-[family-name:var(--font-grotesk)] text-sm">
          <p className="eyebrow text-red mb-4">Tags</p>
          <p className="text-paper/90 leading-relaxed">#eastvan · #terryterry · #addmore</p>
          <p className="mt-5 text-smoke font-[family-name:var(--font-serif)] text-base">
            Made on stolen time in East Vancouver.
          </p>
        </div>
      </div>
      <div className="border-t border-lineink">
        <p className="mx-auto max-w-[1600px] px-8 py-5 font-[family-name:var(--font-spacemono)] text-xs text-smoke flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} Terry Terry Larry Berry</span>
          <span>One sticker. Infinite hustle.</span>
        </p>
      </div>
    </footer>
  );
}
