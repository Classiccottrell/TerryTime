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
    <header className="sticky top-0 z-50 bg-trueblack/90 backdrop-blur border-b border-mediumdark">
      <nav className="mx-auto max-w-[1440px] px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl tracking-wider text-offwhite hover:text-yellow transition-colors"
          onClick={() => setOpen(false)}
        >
          TERRY<span className="text-yellow">·</span>TERRY<span className="text-red">·</span>LARRY
          <span className="text-forest">·</span>BERRY
        </Link>

        <ul className="hidden md:flex items-center gap-8 font-[family-name:var(--font-mono)] text-sm">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`uppercase tracking-wide transition-colors ${
                    active ? "text-yellow" : "text-newsprint hover:text-yellow"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          className="md:hidden text-offwhite font-[family-name:var(--font-mono)] text-sm uppercase tracking-wide"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <ul className="md:hidden border-t border-mediumdark font-[family-name:var(--font-mono)] text-sm">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href} className="border-b border-mediumdark/50">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block px-6 py-4 uppercase tracking-wide ${
                    active ? "text-yellow" : "text-newsprint"
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
