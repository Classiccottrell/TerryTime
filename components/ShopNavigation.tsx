import Link from "next/link";
import { routeForVariant } from "@/lib/shop-routes.mjs";

/**
 * Deliberately has no store switcher: the two storefronts run as an A/B test,
 * so a visitor only ever sees the one they were assigned.
 */
export function ShopNavigation({ current }: { current?: "archive" | "receipt" | "lifestyle" }) {
  const store = current === "lifestyle" ? undefined : [routeForVariant("a"), routeForVariant("b")].find(
    (route) => route?.shortLabel.toLowerCase() === current,
  );
  return (
    <header className="shop-nav-shell">
      <nav className="shop-nav" aria-label="Terry Time">
        <Link href="/shop" className="shop-nav__home">
          Terry Time {store && <span>/ {store.shortLabel}</span>}
        </Link>
        <div className="shop-nav__links">
          <Link
            href="/shop"
            className="shop-nav__lifestyle"
            aria-current={current === "archive" || current === "receipt" ? "page" : undefined}
          >
            Shop
          </Link>
          <Link
            href="/lifestyle"
            className="shop-nav__lifestyle"
            aria-current={current === "lifestyle" ? "page" : undefined}
          >
            Lifestyle
          </Link>
        </div>
      </nav>
    </header>
  );
}
