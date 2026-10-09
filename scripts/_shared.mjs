/** Shared by scripts/: .env.local loading and the Stripe catalog. Never prints secrets. */
import { readFileSync, existsSync } from "node:fs";

for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}

export async function stripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set.");
  const { default: Stripe } = await import("stripe");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

/** Raw Stripe products + prices and the mapped TerryTime catalog (lib/catalog-core.ts). */
export async function loadCatalog(stripe) {
  const { toCatalog, isOurs } = await import("../lib/catalog-core.ts");
  const [products, prices] = await Promise.all([
    stripe.products.list({ limit: 100 }).autoPagingToArray({ limit: 1000 }),
    stripe.prices.list({ active: true, limit: 100 }).autoPagingToArray({ limit: 1000 }),
  ]);
  const ours = products.filter(isOurs);
  return { ours, prices, catalog: toCatalog(ours, prices) };
}
