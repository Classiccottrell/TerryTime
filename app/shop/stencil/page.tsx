import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CanceledBanner } from "@/components/CanceledBanner";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ShopNavigation } from "@/components/ShopNavigation";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Wheatpaste Stencil",
  description: "Terry Time goods posted as street flyers from East Vancouver.",
};

const wallNotes = [
  ["WALL / MAIN & 1ST", "Still up after three rains."],
  ["WALL / COMMERCIAL", "Someone added a second face."],
  ["WALL / BROADWAY", "Peeling at the corners. Signal holds."],
];

export default function StencilShopPage() {
  return (
    <main className="shop-design shop-stencil">
      <ShopNavigation current="stencil" />

      <section className="stencil-hero" aria-labelledby="stencil-title">
        <div className="stencil-hero__strip">
          <span>WHEATPASTE</span>
          <span>EAST VAN</span>
          <span>NO PERMIT</span>
          <span>POSTED DAILY</span>
        </div>

        <div className="stencil-hero__poster">
          <p className="shop-kicker">Street poster / Edition 05</p>
          <h1 id="stencil-title">Paste the<br />face.</h1>
          <p className="stencil-hero__lede">
            Three objects printed like flyers. Stack them, peel them, wear the residue.
          </p>
          <Link href="#stencil-walls" className="shop-text-link">
            Read the walls <span>↓</span>
          </Link>
        </div>

        <div className="stencil-hero__stack" aria-hidden="true">
          <div className="stencil-sheet stencil-sheet--back">
            <span>TERRY</span>
          </div>
          <div className="stencil-sheet stencil-sheet--mid">
            <span>TIME</span>
          </div>
          <div className="stencil-sheet stencil-sheet--front">
            <Image
              src="/img/terry-face.svg"
              alt=""
              width={280}
              height={280}
              className="stencil-sheet__face"
              unoptimized
            />
          </div>
        </div>
      </section>

      <section className="stencil-walls" id="stencil-walls" aria-label="Wall reports">
        {wallNotes.map(([loc, note], index) => (
          <figure key={loc} className={`stencil-wall stencil-wall--${index + 1}`}>
            <figcaption>
              <strong>{loc}</strong>
              <span>{note}</span>
            </figcaption>
          </figure>
        ))}
      </section>

      <CanceledBanner />

      <section className="stencil-catalog" aria-labelledby="stencil-catalog-title">
        <header className="stencil-catalog__header">
          <p className="shop-kicker">Three flyers / Approved paste</p>
          <h2 id="stencil-catalog-title">Wear what<br />was posted.</h2>
          <p>
            Black stock. Cobalt ink. The same face that shows up on poles and plywood.
          </p>
        </header>

        <div className="stencil-flyers">
          {products.map((product, index) => (
            <article className="stencil-flyer" key={product.id}>
              <div className="stencil-flyer__tab">
                <span>FLYER</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className="stencil-flyer__image">
                <Image
                  src={product.variants[0].image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 700px) 92vw, 38vw"
                  className="object-contain"
                  unoptimized
                />
              </div>

              <div className="stencil-flyer__copy">
                <p className="shop-kicker">{product.variants[0].label} / EAST VAN</p>
                <h3>{product.name}</h3>
                <p>{product.blurb}</p>
                <p className="stencil-flyer__price">{product.variants[0].price}</p>
                <ProductPurchase product={product} />
              </div>

              <div className="stencil-flyer__edge" aria-hidden="true">
                <span /><span /><span /><span /><span />
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="stencil-footer">
        <p>
          Paste holds.<br />
          Signal moves.
        </p>
        <div>
          <span>Terry Terry Larry Berry</span>
          <Link href="/shop">Choose another shop ↗</Link>
        </div>
      </footer>
    </main>
  );
}
