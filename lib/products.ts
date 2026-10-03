import { printfulMap } from "./printful-map.mjs";

export type Variant = {
  /** Checkout id — what BuyButton/api/checkout key off of, e.g. "unisex-hoodie-black-m". */
  id: string;
  /** Short label shown on the size picker: "M", "One size". */
  label: string;
  size: string;
  color: string;
  price: string;
  priceCents: number;
  image: string;
  /** Printful catalog variant id (price/stock lookups). From printful-map. */
  printfulVariantId?: number;
  /**
   * Printful store *sync* variant id. Orders for a design-bearing product must
   * reference this (it carries the artwork files). From printful-map, which
   * `npm run sync:printful` generates. Without it the variant can't be sold.
   */
  printfulSyncVariantId?: number;
};

export type Product = {
  id: string;
  name: string;
  voice: string;
  blurb: string;
  accent: string;
  free: boolean;
  /** For free items: the file served when "Download" is clicked. */
  downloadUrl?: string;
  /** Size/colour options. Single-option products (the hat) use a one-item array. */
  variants: Variant[];
};

const SIZES_APPAREL = ["S", "M", "L", "XL"];
const ONE_SIZE = ["One size"];

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** One variant per size for a single colour, wired to Printful ids from the generated map. */
function sizedVariants(
  productId: string,
  color: string,
  sizes: string[],
  priceCents: number,
  image: string,
): Variant[] {
  return sizes.map((size) => {
    const id = `${productId}-${color.toLowerCase()}-${size.toLowerCase().replace(/\s+/g, "-")}`;
    const ids = (printfulMap as Record<string, { sync?: number; catalog?: number }>)[id];
    return {
      id,
      label: size,
      size,
      color,
      price: formatPrice(priceCents),
      priceCents,
      image,
      printfulVariantId: ids?.catalog,
      printfulSyncVariantId: ids?.sync,
    };
  });
}

/**
 * Shop catalog — deliberately trimmed to the 3 products with approved product
 * photography (local files, not Printful CDN mockups).
 */
export const products: Product[] = [
  {
    id: "unisex-pique-polo",
    name: "Unisex Pique Polo Shirt",
    voice: "Terry the Sketcher",
    blurb: "Pique-knit, black. The face rides quiet until someone gets close enough to read it.",
    accent: "#1233c7",
    free: false,
    variants: sizedVariants("unisex-pique-polo", "Black", SIZES_APPAREL, 3783, "/img/products/polo.png"),
  },
  {
    id: "unisex-hoodie",
    name: "Unisex Hoodie",
    voice: "Terry the Sketcher",
    blurb: "Heavyweight, black. Built for East Van nights, not the studio.",
    accent: "#1233c7",
    free: false,
    variants: sizedVariants("unisex-hoodie", "Black", SIZES_APPAREL, 4758, "/img/products/hoodie.png"),
  },
  {
    id: "organic-dad-hat",
    name: "Organic Dad Hat",
    voice: "Terry the Sketcher",
    blurb: "Organic cotton, black. Low profile, permanent signal.",
    accent: "#1233c7",
    free: false,
    variants: sizedVariants("organic-dad-hat", "Black", ONE_SIZE, 3653, "/img/products/dad-hat-black.png"),
  },
];

/** Whether a variant is linked to Printful and can be fulfilled. */
export function isFulfillable(variant: Variant): boolean {
  return Boolean(variant.printfulSyncVariantId);
}

/** Lowest price across a product's sizes, in cents (for "from" displays and totals). */
export function startingPriceCents(product: Product): number {
  return Math.min(...product.variants.map((v) => v.priceCents));
}

/** Flat list of every purchasable variant — what checkout looks products up by. */
export function getVariant(id: string): { product: Product; variant: Variant } | undefined {
  for (const product of products) {
    const variant = product.variants.find((v) => v.id === id);
    if (variant) return { product, variant };
  }
  return undefined;
}
