import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CanceledBanner } from "@/components/CanceledBanner";
import { Mascot3D } from "@/components/Mascot3D";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ShopNavigation } from "@/components/ShopNavigation";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Signal Shrine",
  description: "Terry Time objects presented with ceremonial clarity.",
};

export default function ShrineShopPage() {
  return (
    <main className="shop-design shop-shrine">
      <ShopNavigation current="shrine" />

      <section className="shrine-hero" aria-labelledby="shrine-title">
        <p className="shop-kicker">Signal Shrine / East Van / 2026</p>
        <h1 id="shrine-title"><span>The face</span><span>returns.</span></h1>
        <div className="shrine-hero__face"><Mascot3D /></div>
        <p className="shrine-hero__note">An ordinary mark becomes an icon through repetition.</p>
        <Link href="#artifacts" className="shrine-hero__enter">View the artifacts <span>↓</span></Link>
      </section>

      <CanceledBanner />

      <section className="shrine-artifacts" id="artifacts" aria-labelledby="shrine-artifacts-title">
        <header>
          <p className="shop-kicker">Three offerings / No replicas</p>
          <h2 id="shrine-artifacts-title">Daily objects.<br />Permanent signal.</h2>
        </header>
        {products.map((product, index) => (
          <article className="shrine-artifact" key={product.id}>
            <div className="shrine-artifact__halo" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
            <div className="shrine-artifact__image">
              <Image
                src={product.variants[0].image}
                alt={product.name}
                fill
                sizes="(max-width: 700px) 94vw, 55vw"
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="shrine-artifact__copy">
              <p className="shop-kicker">Artifact {String(index + 1).padStart(2, "0")} / {product.variants[0].label}</p>
              <h3>{product.name}</h3>
              <p>{product.blurb}</p>
              <p className="shrine-artifact__price">{product.variants[0].price} <span>CAD</span></p>
              <ProductPurchase product={product} />
            </div>
          </article>
        ))}
      </section>

      <section className="shrine-coda" aria-label="Terry Time statement">
        <div className="shrine-coda__image">
          <Image src="/img/shop/graffiti-face.jpg" alt="Terry face painted on an East Vancouver wall" fill sizes="100vw" className="object-cover" />
        </div>
        <p>The city drew the first one.<br />We keep the signal moving.</p>
      </section>

      <footer className="shrine-footer">
        <span>Terry Terry Larry Berry / East Vancouver</span>
        <Link href="/shop">Leave the shrine ↗</Link>
      </footer>
    </main>
  );
}
