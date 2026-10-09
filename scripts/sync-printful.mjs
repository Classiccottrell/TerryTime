#!/usr/bin/env node
/**
 * Links each size of every Printful-fulfilled product in the Stripe catalog to its
 * Printful store sync variant, writing `printful_<size>="<sync>:<catalog>"` into the
 * Stripe product's metadata. Run after adding products or sizes in Stripe/Printful:
 *
 *   npm run sync:printful            # match + write to Stripe
 *   npm run sync:printful -- --dry   # match + report only
 *
 * Matching: a Printful store product matches when every word of the Stripe product
 * name (ignoring "unisex") appears in its name; a sync variant then matches by size
 * ("One size" accepts "OS") and colour (product metadata.color). It also confirms
 * Printful's own blank is offered (and in stock) in each size. Anything ambiguous or
 * unmatched is reported and left unlinked — it stays unsellable rather than guessed.
 */
import { stripeClient, loadCatalog } from "./_shared.mjs";

const dry = process.argv.includes("--dry");
const API = process.env.PRINTFUL_API_BASE ?? "https://api.printful.com";
const STORE_ID = "18616880";
if (!process.env.PRINTFUL_API_KEY) {
  console.error("PRINTFUL_API_KEY is not set.");
  process.exit(1);
}

async function pf(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`, "X-PF-Store-Id": STORE_ID },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${path} → ${res.status} ${body?.error?.message ?? ""}`);
  return body.result;
}

const words = (s) => s.toLowerCase().replace(/unisex/g, "").split(/[^a-z0-9]+/).filter(Boolean);
const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
const sizeMatch = (s) => {
  const n = norm(s);
  return n === "os" || n === "onesize" || n === "onesizefitsall" ? "onesize" : n;
};

const { sizeKey } = await import("../lib/catalog-core.ts");
const stripe = await stripeClient();
const { ours, catalog } = await loadCatalog(stripe);
const storeProducts = await pf("/store/products?limit=100");
const catalogCache = new Map();
let problems = 0;

/** Sizes Printful actually offers for this blank in this colour (catalog, not our store). */
async function catalogSizes(catalogVariantId, color) {
  const variant = await pf(`/products/variant/${catalogVariantId}`);
  const productId = variant.variant.product_id;
  if (!catalogCache.has(productId)) catalogCache.set(productId, await pf(`/products/${productId}`));
  const cat = catalogCache.get(productId);
  return { name: cat.product.title, rows: cat.variants.filter((v) => norm(v.color) === norm(color)) };
}

for (const product of catalog.filter((p) => p.fulfillment === "printful")) {
  const need = words(product.name);
  const candidates = storeProducts.filter((sp) => need.every((w) => new Set(words(sp.name)).has(w)));
  if (candidates.length !== 1) {
    problems++;
    console.error(`✗ ${product.name}: ${candidates.length === 0 ? "no matching Printful store product" : `ambiguous — ${candidates.map((c) => c.name).join(" | ")}`}`);
    continue;
  }
  const detail = await pf(`/store/products/${candidates[0].id}`);
  console.log(`• ${product.name} ⇄ "${candidates[0].name}" (${detail.sync_variants.length} variants)`);
  const metadata = {};
  for (const v of product.variants) {
    const hits = detail.sync_variants.filter((sv) => sizeMatch(sv.size) === sizeMatch(v.size) && norm(sv.color) === norm(v.color));
    if (hits.length !== 1) {
      problems++;
      console.error(`  ✗ ${v.size}: ${hits.length === 0 ? "no sync variant for this size/colour" : "more than one sync variant matches"}`);
      continue;
    }
    const { name, rows } = await catalogSizes(hits[0].variant_id, v.color);
    const row = rows.find((r) => sizeMatch(r.size) === sizeMatch(v.size));
    if (!row) {
      problems++;
      console.error(`  ✗ ${v.size}: Printful's "${name}" in ${v.color} isn't offered in ${v.size}. It offers: ${rows.map((r) => r.size).join(", ") || "(none)"}`);
      continue;
    }
    if (row.in_stock === false) console.warn(`  ! ${v.size}: ${name} is OUT OF STOCK at Printful right now`);
    metadata[`printful_${sizeKey(v.size)}`] = `${hits[0].id}:${hits[0].variant_id}`;
    console.log(`  ✓ ${v.size} → sync ${hits[0].id} / catalog ${hits[0].variant_id}`);
  }
  if (!dry && Object.keys(metadata).length) await stripe.products.update(product.stripeProductId, { metadata });
}

const printful = catalog.filter((p) => p.fulfillment === "printful").length;
console.log(`\n${dry ? "Dry run: nothing written." : "Wrote Printful ids to Stripe product metadata."} ${printful} Printful product(s) of ${ours.length} TerryTime product(s) in Stripe.`);
if (problems) {
  console.error(`${problems} problem(s): those sizes stay unsellable until fixed.`);
  process.exit(1);
}
