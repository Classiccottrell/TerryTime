import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CanceledBanner } from "@/components/CanceledBanner";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ShopNavigation } from "@/components/ShopNavigation";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Street Evidence Archive",
  description: "A documentary Terry Time catalog from East Vancouver.",
};

const evidence = [
  ["EV-210820-A", "/img/shop/graffiti-face.jpg", "Uncommissioned wall face, East Vancouver"],
  ["EV-210720-B", "/img/shop/hedge-portrait.jpg", "Hedge portrait, subject known locally"],
  ["EV-SKY-003", "/img/shop/skyline-dusk.jpg", "Dusk line, observed from the neighbourhood"],
];

export default function ArchiveShopPage() {
  return (
    <main className="shop-design shop-archive">
      <ShopNavigation current="archive" />

      <header className="archive-masthead">
        <div>
          <p>Municipal file / public circulation</p>
          <p>Department of recurring faces</p>
        </div>
        <h1>Street Evidence<br />Archive</h1>
        <aside>
          <strong>CASE 003</strong>
          <span>STATUS / ACTIVE</span>
          <span>ORIGIN / EAST VAN</span>
        </aside>
      </header>

      <section className="archive-contact" aria-labelledby="archive-contact-title">
        <div className="archive-section-label">
          <h2 id="archive-contact-title">A / Source Material</h2>
          <p>Collected without polish. Filed without permission.</p>
        </div>
        <div className="archive-contact__grid">
          {evidence.map(([id, src, caption], index) => (
            <figure key={id} className={index === 1 ? "archive-contact__tall" : ""}>
              <div className="archive-contact__image">
                <Image src={src} alt={caption} fill sizes="(max-width: 700px) 92vw, 33vw" className="object-cover" />
              </div>
              <figcaption><strong>{id}</strong><span>{caption}</span><span>AUTHENTICITY / UNDISPUTED</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <CanceledBanner />

      <section className="archive-catalog" aria-labelledby="archive-catalog-title">
        <div className="archive-section-label">
          <h2 id="archive-catalog-title">B / Material Exhibits</h2>
          <p>Three approved objects. Local photography retained as evidence.</p>
        </div>
        <div className="archive-dossiers">
          {products.map((product, index) => (
            <article className="archive-dossier" key={product.id}>
              <div className="archive-dossier__number">EXHIBIT<br /><strong>{String(index + 1).padStart(3, "0")}</strong></div>
              <div className="archive-dossier__image">
                <Image
                  src={product.variants[0].image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 700px) 90vw, 38vw"
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="archive-dossier__copy">
                <p className="shop-kicker">Object / {product.id.replaceAll("-", " ")}</p>
                <h3>{product.name}</h3>
                <dl>
                  <div><dt>Condition</dt><dd>Ready for circulation</dd></div>
                  <div><dt>Marking</dt><dd>Embroidered Terry face</dd></div>
                  <div><dt>Finish</dt><dd>{product.variants[0].label}</dd></div>
                  <div><dt>Value</dt><dd>{product.variants[0].price} CAD</dd></div>
                </dl>
                <p>{product.blurb}</p>
                <ProductPurchase product={product} />
              </div>
              <span className="archive-dossier__stamp" aria-hidden="true">CLEARED<br />TO WEAR</span>
            </article>
          ))}
        </div>
      </section>

      <footer className="archive-footer">
        <p>File remains open.<br />Terry keeps appearing.</p>
        <Link href="/shop">Return to storefront index</Link>
      </footer>
    </main>
  );
}
