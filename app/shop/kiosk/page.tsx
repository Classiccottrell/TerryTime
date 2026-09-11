import type { Metadata } from "next";
import Image from "next/image";
import { CanceledBanner } from "@/components/CanceledBanner";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ShopNavigation } from "@/components/ShopNavigation";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Newsstand Kiosk",
  description: "Terry Time goods, sold like classifieds in an ink-black paper.",
};

export default function KioskShopPage() {
  return (
    <main className="shop-design shop-kiosk">
      <ShopNavigation current="kiosk" />

      <section className="kiosk-masthead" aria-labelledby="kiosk-title">
        <p className="shop-kicker">Edition No. 06 — East Vancouver</p>
        <h1 id="kiosk-title">The Terry Time Bulletin.</h1>
        <p className="kiosk-masthead__lede">
          Merchandise, listed plainly. No photography treatment, no collage — just the object,
          the price, and the fine print.
        </p>
      </section>

      <CanceledBanner />

      <section className="kiosk-classifieds" aria-label="Catalog">
        {products.map((product, index) => (
          <article className="kiosk-listing" key={product.id}>
            <span className="kiosk-listing__index">{String(index + 1).padStart(2, "0")}</span>
            <div className="kiosk-listing__image">
              <Image
                src={product.variants[0].image}
                alt={product.name}
                fill
                sizes="(max-width: 760px) 100vw, 40vw"
                className="object-contain"
              />
            </div>
            <div className="kiosk-listing__copy">
              <h2>{product.name}</h2>
              <p>{product.blurb}</p>
              <ProductPurchase product={product} />
            </div>
          </article>
        ))}
      </section>

      <footer className="kiosk-footer">
        <span>Terry Terry Larry Berry</span>
        <span>Printed to order / Stripe checkout</span>
      </footer>
    </main>
  );
}
