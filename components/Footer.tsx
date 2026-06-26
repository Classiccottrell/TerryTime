import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-mediumdark bg-ink">
      <div className="divider-line" />
      <div className="mx-auto max-w-[1440px] px-6 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-wider text-offwhite">
            TERRY TERRY LARRY BERRY
          </p>
          <p className="mt-3 text-gray max-w-xs">
            An East Van underground art collective masquerading as a sticker brand.
          </p>
        </div>

        <div className="font-[family-name:var(--font-mono)] text-sm">
          <p className="text-yellow uppercase tracking-widest mb-3">Wander</p>
          <ul className="space-y-2 text-newsprint">
            <li><Link href="/characters" className="hover:text-yellow">The Four Voices</Link></li>
            <li><Link href="/shop" className="hover:text-yellow">Sticker Shop</Link></li>
            <li><Link href="/manifesto" className="hover:text-yellow">Manifesto</Link></li>
            <li><Link href="/community" className="hover:text-yellow">Join the Collective</Link></li>
          </ul>
        </div>

        <div className="font-[family-name:var(--font-mono)] text-sm">
          <p className="text-red uppercase tracking-widest mb-3">Tags</p>
          <p className="text-newsprint leading-relaxed">
            #eastvan · #terryterry · #addmore
          </p>
          <p className="mt-4 text-gray">
            Made on stolen time in East Vancouver.
          </p>
        </div>
      </div>
      <div className="border-t border-mediumdark">
        <p className="mx-auto max-w-[1440px] px-6 py-4 font-[family-name:var(--font-spacemono)] text-xs text-gray flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} Terry Terry Larry Berry</span>
          <span>One sticker. Infinite hustle.</span>
        </p>
      </div>
    </footer>
  );
}
