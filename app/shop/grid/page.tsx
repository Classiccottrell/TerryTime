import type { Metadata } from "next";
import Image from "next/image";
import { CanceledBanner } from "@/components/CanceledBanner";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ShopNavigation } from "@/components/ShopNavigation";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Terminal Grid",
  description: "Terry Time goods, browsed dense and edge-to-edge.",
};

export default function GridShopPage() {
  return (
    <main className="shop-design shop-grid">
      <ShopNavigation current="grid" />

      <section className="grid-intro" aria-labelledby="grid-title">
        <h1 id="grid-title">Terminal<br />Grid.</h1>
        <p>No flourish. Image, name, price. Pick a cell.</p>
      </section>

      <CanceledBanner />

      <section className="grid-catalog" aria-label="Catalog">
        {products.map((product) => (
          <article className="grid-item" key={product.id}>
            <div className="grid-item__image">
              <Image
                src={product.variants[0].image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="grid-item__caption">
              <span>{product.name}</span>
              <span>{product.variants[0].price}</span>
            </div>
            <ProductPurchase product={product} />
          </article>
        ))}
      </section>

      <footer className="grid-footer">
        <span>Terry Terry Larry Berry</span>
        <span>Approved local objects / Stripe checkout</span>
      </footer>
    </main>
  );
}
