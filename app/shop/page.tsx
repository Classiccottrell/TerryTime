import type { Metadata } from "next";
import Link from "next/link";
import { shopRoutes } from "@/lib/shop-routes.mjs";

export const metadata: Metadata = {
  title: "Choose a Shop",
  description: "Five distinct Terry Time storefront directions.",
};

export default function ShopChooserPage() {
  return (
    <main className="shop-design shop-chooser">
      <header className="shop-chooser__header">
        <p>Terry Terry Larry Berry / Design Pass 001</p>
        <p>East Vancouver / {new Date().getFullYear()}</p>
      </header>

      <section className="shop-chooser__intro" aria-labelledby="chooser-title">
        <p className="shop-kicker">Five stores. Same evidence.</p>
        <h1 id="chooser-title">Choose your<br />Terry Time.</h1>
        <p>
          One catalog, five different signals. Walk through each before picking a wall.
        </p>
      </section>

      <ol className="shop-chooser__list">
        {shopRoutes.map((route, index) => (
          <li key={route.href}>
            <Link href={route.href} className={`shop-choice shop-choice--${index + 1}`}>
              <span className="shop-choice__number">{route.number}</span>
              <span className="shop-choice__art" aria-hidden="true">
                <i /><i /><i />
              </span>
              <span className="shop-choice__copy">
                <strong>{route.label}</strong>
                <small>{route.description}</small>
              </span>
              <span className="shop-choice__arrow" aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ol>

      <footer className="shop-chooser__footer">
        <span>Approved local objects / Stripe checkout</span>
        <span>01—05</span>
      </footer>
    </main>
  );
}
