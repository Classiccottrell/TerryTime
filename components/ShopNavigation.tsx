import Link from "next/link";
import { shopRoutes } from "@/lib/shop-routes.mjs";

export function ShopNavigation({ current }: { current?: string }) {
  return (
    <header className="shop-nav-shell">
      <nav className="shop-nav" aria-label="Shop design previews">
        <Link href="/shop" className="shop-nav__home">
          Terry Time <span>/ {shopRoutes.length} Shops</span>
        </Link>
        <ol>
          {shopRoutes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                aria-current={route.shortLabel.toLowerCase() === current ? "page" : undefined}
              >
                <span>{route.number}</span> {route.shortLabel}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}
