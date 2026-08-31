import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CanceledBanner } from "@/components/CanceledBanner";
import { Mascot3D } from "@/components/Mascot3D";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ShopNavigation } from "@/components/ShopNavigation";
import { TronGrid } from "@/components/TronGrid";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Cobalt Relay City",
  description: "Terry Time goods transmitted from East Vancouver.",
};

const cityPhotos = [
  ["/img/shop/graffiti-face.jpg", "Graffiti face found in East Vancouver", "FIELD / 08.20.21"],
  ["/img/shop/hedge-portrait.jpg", "Portrait beside an East Vancouver hedge", "SUBJECT / 07.20.21"],
  ["/img/shop/skyline-dusk.jpg", "East Vancouver skyline at dusk", "HORIZON / 49.2819° N"],
];

export default function CityShopPage() {
  return (
    <main className="shop-design shop-city">
      <TronGrid />
      <ShopNavigation current="city" />

      <section className="city-hero" aria-labelledby="city-title">
        <div className="city-hero__signal" aria-hidden="true">
          <span>49.2819° N</span>
          <i />
          <span>123.1080° W</span>
        </div>
        <div className="city-hero__copy">
          <p className="shop-kicker">Cobalt Relay City / Transmission 001</p>
          <h1 id="city-title">East Van<br />made us.</h1>
          <p className="city-hero__lede">We printed the evidence. Three daily objects carrying one unmistakable face.</p>
          <Link href="#city-catalog" className="shop-text-link">Enter the signal <span>↓</span></Link>
        </div>
        <div className="city-hero__face">
          <Mascot3D />
          <p>Signal strength / 100%</p>
        </div>
        <div className="city-hero__route" aria-hidden="true">
          <span>Commercial</span><i /><span>Broadway</span><i /><span>Main</span>
        </div>
      </section>

      <section className="city-field" aria-label="East Vancouver field photographs">
        {cityPhotos.map(([src, alt, label], index) => (
          <figure key={src} className={`city-photo city-photo--${index + 1}`}>
            <Image src={src} alt={alt} fill sizes="(max-width: 700px) 88vw, 34vw" className="object-cover" />
            <figcaption><span>0{index + 1}</span>{label}</figcaption>
          </figure>
        ))}
        <p className="city-field__note">Three coordinates.<br />One recurring witness.</p>
      </section>

      <CanceledBanner />

      <section className="city-catalog" id="city-catalog" aria-labelledby="city-catalog-title">
        <header className="city-catalog__header">
          <p className="shop-kicker">Approved transmissions / 03</p>
          <h2 id="city-catalog-title">Wear the<br />frequency.</h2>
          <p>Black garments. Cobalt signal. Terry face embroidered where the city can see it.</p>
        </header>
        <div className="city-products">
          {products.map((product, index) => (
            <article className="city-product" key={product.id}>
              <div className="city-product__meta"><span>TX–0{index + 1}</span><span>{product.variants[0].price}</span></div>
              <div className="city-product__image">
                <Image
                  src={product.variants[0].image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 700px) 90vw, 42vw"
                  className="object-contain"
                  unoptimized
                />
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{product.name}</h3>
              <p>{product.blurb}</p>
              <ProductPurchase product={product} />
            </article>
          ))}
        </div>
      </section>

      <footer className="city-footer">
        <span>Terry Terry Larry Berry</span>
        <span>Transmission ends / goods remain</span>
        <Link href="/shop">Choose another shop ↗</Link>
      </footer>
    </main>
  );
}
