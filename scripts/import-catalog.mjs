#!/usr/bin/env node
/**
 * Seeds the Stripe catalog (lib/catalog-core.ts data model) with the launch products.
 * Idempotent: products are matched by metadata.slug, prices by lookup_key, so it is safe
 * to re-run and to point at a new account (e.g. live mode at launch):
 *
 *   npm run import:catalog          # uses STRIPE_SECRET_KEY from the env / .env.local
 *
 * After this, Stripe is the source of truth: edit names, prices, images there.
 * Printful ids come from `npm run sync:printful` (written to product metadata).
 */
import { stripeClient } from "./_shared.mjs";

const SITE = "https://www.terryterrylarryberry.com";
const APPAREL = ["S", "M", "L", "XL"];
const LAUNCH = [
  { slug: "unisex-pique-polo", order: 1, name: "Unisex Pique Polo Shirt", priceCents: 3783, sizes: APPAREL,
    description: "Pique-knit, black. The face rides quiet until someone gets close enough to read it.", image: "/img/products/polo.png" },
  { slug: "unisex-hoodie", order: 2, name: "Unisex Hoodie", priceCents: 4758, sizes: APPAREL,
    description: "Heavyweight, black. Built for East Van nights, not the studio.", image: "/img/products/hoodie.png" },
  { slug: "organic-dad-hat", order: 3, name: "Organic Dad Hat", priceCents: 3653, sizes: ["One size"],
    description: "Organic cotton, black. Low profile, permanent signal.", image: "/img/products/dad-hat-black.png" },
];

const stripe = await stripeClient();
const existing = await stripe.products.list({ limit: 100 }).autoPagingToArray({ limit: 1000 });

for (const item of LAUNCH) {
  let product = existing.find((p) => p.metadata.shop === "terrytime" && p.metadata.slug === item.slug);
  if (product) {
    console.log(`= ${item.name} (${product.id}) exists`);
  } else {
    product = await stripe.products.create({
      name: item.name,
      description: item.description,
      images: [`${SITE}${item.image}`],
      metadata: { shop: "terrytime", slug: item.slug, order: String(item.order), color: "Black",
        voice: "Terry the Sketcher", accent: "#1233c7", fulfillment: "printful" },
    });
    console.log(`+ ${item.name} (${product.id})`);
  }
  for (const size of item.sizes) {
    const lookup_key = `terrytime_${item.slug}_${size.toLowerCase().replace(/\s+/g, "-")}`;
    const { data } = await stripe.prices.list({ lookup_keys: [lookup_key] });
    if (data.length) { console.log(`  = ${size} ${data[0].id}`); continue; }
    const price = await stripe.prices.create({
      product: product.id, currency: "cad", unit_amount: item.priceCents,
      nickname: size, lookup_key, metadata: { size },
    });
    console.log(`  + ${size} ${price.id} $${(item.priceCents / 100).toFixed(2)}`);
  }
}
