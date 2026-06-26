"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Studio" },
  { href: "/characters", label: "The Four" },
  { href: "/shop", label: "Shop" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/community", label: "Community" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-ink">
      <nav className="mx-auto max-w-[1600px] px-4 sm:px-8 flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl sm:text-[1.7rem] tracking-tight text-ink hover:text-red transition-colors"
          onClick={() => setOpen(false)}
        >
          TERRY<span className="text-red">·</span>TERRY<span className="text-forest">·</span>LARRY
          <span className="text-ink">·</span>BERRY
        </Link>

        <ul className="hidden md:flex items-center gap-7 font-[family-name:var(--font-grotesk)] text-sm font-medium">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`uppercase tracking-wide pb-1 border-b-2 transition-colors ${
                    active
                      ? "border-ink text-ink"
                      : "border-transparent text-stone hover:text-ink hover:border-yellow"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/shop"
              className="bg-ink text-paper px-4 py-2 uppercase tracking-wide hover:bg-red transition-colors"
            >
              Shop Stickers
            </Link>
          </li>
        </ul>

        <button
          className="md:hidden text-ink font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-wide"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <ul className="md:hidden border-t border-line font-[family-name:var(--font-grotesk)] text-sm font-medium bg-cloud">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href} className="border-b border-line">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block px-6 py-4 uppercase tracking-wide ${
                    active ? "text-ink bg-yellow" : "text-stone"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </header>
  );
}
