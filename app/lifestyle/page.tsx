import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductPurchase } from "@/components/ProductPurchase";
import { ShopNavigation } from "@/components/ShopNavigation";
import { products, type Product } from "@/lib/products";

export const metadata: Metadata = {
  title: "Lifestyle",
  description: "After hours in East Vancouver: three hours from the camera roll, and what to wear for each.",
};

// The timeline runs 18:00 to 23:00. `minutes` places each chapter on it.
// 18:51 and 21:55 are the photos' own camera timestamps; the skyline shot has
// no timestamp, so "Dusk" sits between them in the order it happened.
const TIMELINE_START_HOUR = 18;
const TIMELINE_MINUTES = 5 * 60;

const chapters = [
  {
    id: "t-1851",
    time: "18:51",
    minutes: 51,
    title: "Clock out.",
    body:
      "Golden hour on the east side. The hedges are taller than you and still holding the day's heat. Nobody is watching, which is the point. Wear something that doesn't need to explain itself.",
    photo: "/img/shop/hedge-portrait.jpg",
    alt: "A person in a black shirt standing in a gap between tall hedges, East Vancouver",
    caption: ["Hedge line / East Van", "07.20.21"],
    productId: "unisex-pique-polo",
  },
  {
    id: "t-dusk",
    time: "Dusk",
    minutes: 150,
    title: "Last light.",
    body:
      "The towers switch on one floor at a time and the clouds do most of the work. The temperature drops fast. A shirt stops being enough, so you reach for the heavy layer.",
    photo: "/img/shop/skyline-dusk.jpg",
    alt: "City skyline under heavy clouds at dusk, seen from East Vancouver",
    caption: ["Skyline / East Van", "49.2819° N"],
    productId: "unisex-hoodie",
  },
  {
    id: "t-2155",
    time: "21:55",
    minutes: 235,
    title: "Walls.",
    body:
      "Street lights on. Someone drew a face on the utility box at the corner, somebody else tagged over it, and the hedge grew into both. Nobody planned the layers. Add a hat and keep walking.",
    photo: "/img/shop/graffiti-face.jpg",
    alt: "A drawn face covered in tags on a utility box at night, half hidden by a hedge",
    caption: ["Utility box / East Van", "08.20.21"],
    productId: "organic-dad-hat",
  },
];

const hourTicks = Array.from({ length: 6 }, (_, i) => TIMELINE_START_HOUR + i);

function timelinePosition(minutes: number): CSSProperties {
  return { "--at": `${(minutes / TIMELINE_MINUTES) * 100}%` } as CSSProperties;
}

function getProduct(id: string): Product {
  const product = products.find((p) => p.id === id);
  // Fail the build rather than ship a chapter with a missing product.
  if (!product) throw new Error(`Lifestyle chapter references unknown product "${id}"`);
  return product;
}

export default function LifestylePage() {
  return (
    <main className="shop-design shop-lifestyle">
      <ShopNavigation current="lifestyle" />

      <section className="life-hero" aria-labelledby="life-title">
        <p className="shop-kicker">Lifestyle / After hours</p>
        <h1 id="life-title">After<br />hours.</h1>
        <p className="life-hero__lede">
          The shift ends. The phone goes in the pocket. East Van gets quieter and the walls get
          louder. Terry Time is the hours after the day job, when the making happens. Here are three
          of those hours, pulled from the camera roll, and what to wear for each.
        </p>

        <nav className="life-timeline" aria-label="Evening timeline">
          <div className="life-timeline__axis" aria-hidden="true">
            {hourTicks.map((hour) => (
              <span key={hour} style={timelinePosition((hour - TIMELINE_START_HOUR) * 60)}>
                {hour}:00
              </span>
            ))}
          </div>
          <ol>
            {chapters.map((chapter) => (
              <li key={chapter.id} style={timelinePosition(chapter.minutes)}>
                <a href={`#${chapter.id}`}>
                  <i aria-hidden="true" />
                  <strong>{chapter.time}</strong>
                  <span>{chapter.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      {chapters.map((chapter, index) => {
        const product = getProduct(chapter.productId);
        const variant = product.variants[0];
        return (
          <article
            className={`life-chapter${index % 2 === 1 ? " life-chapter--flip" : ""}`}
            id={chapter.id}
            key={chapter.id}
            aria-labelledby={`${chapter.id}-title`}
          >
            <header className="life-chapter__time">
              <span>Hour {String(index + 1).padStart(2, "0")}</span>
              <p>{chapter.time}</p>
            </header>

            <figure className="life-chapter__photo">
              <div className="life-chapter__frame">
                <Image
                  src={chapter.photo}
                  alt={chapter.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
              <figcaption>
                <span>{chapter.caption[0]}</span>
                <span>{chapter.caption[1]}</span>
              </figcaption>
            </figure>

            <div className="life-chapter__copy">
              <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
              <p>{chapter.body}</p>

              <aside className="life-kit" aria-label={`Kit for ${chapter.time}`}>
                <p className="shop-kicker">Kit for {chapter.time.toLowerCase()}</p>
                <div className="life-kit__row">
                  <div className="life-kit__image">
                    <Image
                      src={variant.image}
                      alt={product.name}
                      fill
                      sizes="120px"
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.blurb}</p>
                  </div>
                </div>
                <ProductPurchase product={product} />
              </aside>
            </div>
          </article>
        );
      })}

      <section className="life-coda" aria-labelledby="life-coda-title">
        <h2 id="life-coda-title">Clock out.<br />Make something.</h2>
        <Link href="/shop" className="shop-text-link">
          Back to the shop <span>↗</span>
        </Link>
      </section>

      <footer className="life-footer">
        <span>Terry Terry Larry Berry</span>
        <span>Photographed in East Vancouver</span>
      </footer>
    </main>
  );
}
