import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CanceledBanner } from "@/components/CanceledBanner";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ShopNavigation } from "@/components/ShopNavigation";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Corner Store Receipt",
  description: "Terry Time goods rung up on one long thermal receipt from East Vancouver.",
};

const shelfTotalCents = products.reduce((sum, product) => sum + product.variants[0].priceCents, 0);

// Deterministic barcode: bar widths come from the store code's char codes,
// so the stripe pattern is stable across builds without shipping an image.
const barcodeBars = Array.from("TERRYTIME07CORNERSTORE", (char) => (char.charCodeAt(0) % 4) + 1);

export default function ReceiptShopPage() {
  return (
    <main className="shop-design shop-receipt">
      <ShopNavigation current="receipt" />

      <CanceledBanner />

      <div className="receipt-layout">
        <section className="receipt-intro" aria-labelledby="receipt-title">
          <div>
            <p className="shop-kicker">Store 07 / East Van</p>
            <h1 id="receipt-title">Rung up<br />in East Van.</h1>
            <p className="receipt-intro__lede">
              Thermal paper fades in a week. The list on it stays honest: what you took,
              what it cost, nothing else. So this store is one long receipt. Tear off what you want.
            </p>
            <Link href="#receipt-tape" className="shop-text-link">
              Read the tape <span>↓</span>
            </Link>
          </div>

          <div className="receipt-sign" aria-hidden="true">
            <span className="receipt-sign__light" />
            <strong>Open</strong>
            <span>Printed to order</span>
          </div>
        </section>

        <section className="receipt-counter" aria-labelledby="receipt-store-title">
          <div className="receipt-printer" aria-hidden="true">
            <span>REG 07</span>
            <span className="receipt-printer__slot" />
            <span>80MM</span>
          </div>

          <div className="receipt-tape" id="receipt-tape">
            <header className="receipt-tape__header">
              <h2 id="receipt-store-title">Terry Time<br />Corner Store</h2>
              <p>East Vancouver, BC</p>
              <p>Reg 07 / Cashier: Terry</p>
            </header>

            <ol className="receipt-items">
              {products.map((product, index) => {
                const variant = product.variants[0];
                return (
                  <li className="receipt-item" key={product.id}>
                    <div className="receipt-line">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <h3>{product.name}</h3>
                      <i aria-hidden="true" />
                      <span>{variant.price}</span>
                    </div>
                    <div className="receipt-item__image">
                      <Image
                        src={variant.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 760px) 80vw, 360px"
                        className="object-contain"
                      />
                    </div>
                    <p className="receipt-item__meta">
                      {variant.label} / Design: {product.voice}
                    </p>
                    <p className="receipt-item__blurb">{product.blurb}</p>
                    <ProductPurchase product={product} />
                  </li>
                );
              })}
            </ol>

            <dl className="receipt-totals">
              <div>
                <dt>Items on the shelf</dt>
                <dd>{products.length}</dd>
              </div>
              <div className="receipt-totals__grand">
                <dt>Whole shelf</dt>
                <dd>${(shelfTotalCents / 100).toFixed(2)}</dd>
              </div>
            </dl>
            <p className="receipt-tape__note">Each item checks out on its own. Prices in CAD.</p>

            <div className="receipt-barcode" aria-hidden="true">
              {barcodeBars.map((width, index) => (
                <i key={index} style={{ width: `${width * 2}px` }} />
              ))}
            </div>
            <p className="receipt-tape__thanks">Thank you. Come again.</p>
          </div>
        </section>
      </div>

      <footer className="receipt-footer">
        <p>
          Paper fades.<br />
          The face stays.
        </p>
        <div>
          <span>Terry Terry Larry Berry</span>
          <Link href="/shop">Choose another shop ↗</Link>
        </div>
      </footer>
    </main>
  );
}
