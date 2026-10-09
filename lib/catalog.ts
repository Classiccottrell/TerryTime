import { unstable_cache } from "next/cache";
import { getStripe } from "@/lib/stripe";
import { toCatalog, type Product } from "@/lib/catalog-core";

export * from "@/lib/catalog-core";

/** Seconds a page may show a stale catalog after a change in the Stripe dashboard. */
export const CATALOG_REVALIDATE = 300;

/** The shop catalog, read from Stripe (see lib/catalog-core.ts for the data model). */
export const getCatalog = unstable_cache(
  async (): Promise<Product[]> => {
    const stripe = getStripe();
    if (!stripe) return [];
    const [products, prices] = await Promise.all([
      stripe.products.list({ active: true, limit: 100 }).autoPagingToArray({ limit: 1000 }),
      stripe.prices.list({ active: true, limit: 100 }).autoPagingToArray({ limit: 1000 }),
    ]);
    return toCatalog(products, prices);
  },
  ["stripe-catalog"],
  { revalidate: CATALOG_REVALIDATE, tags: ["catalog"] },
);
