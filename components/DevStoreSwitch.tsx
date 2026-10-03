"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { shopRoutes } from "@/lib/shop-routes.mjs";

/**
 * Dev/preview-only jump between the A/B stores (and Lifestyle). Never rendered
 * in production, where nav deliberately doesn't cross-link the stores.
 */
const show = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
const links = [...shopRoutes.map((r) => ({ href: r.href, label: `${r.variant.toUpperCase()} · ${r.shortLabel}` })), { href: "/lifestyle", label: "Lifestyle" }];

export function DevStoreSwitch() {
  const pathname = usePathname();
  if (!show) return null;
  return (
    <nav className="dev-store-switch" aria-label="Switch store (dev only)">
      {links.map((l) => (
        <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
