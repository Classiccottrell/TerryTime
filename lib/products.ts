export type Variant = {
  /** Checkout id — what BuyButton/api/checkout key off of. */
  id: string;
  /** Short label, e.g. a size or color: "3″×3″", "Black". */
  label: string;
  price: string;
  priceCents: number;
  image: string;
  printfulVariantId: number;
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
  /** One or more purchasable variants (size/color). Single-variant products
   *  still use this shape with a one-item array, for a uniform Buy flow. */
  variants: Variant[];
};

/**
 * Shop catalog — deliberately trimmed to just the 3 products with approved
 * product photography (local files, not Printful CDN mockups). Sticker,
 * holographic, and tote listings from the wider Printful catalog are held
 * back until their own real photography is chosen.
 */
export const products: Product[] = [
  {
    id: "unisex-pique-polo",
    name: "Unisex Pique Polo Shirt",
    voice: "Terry the Sketcher",
    blurb: "Pique-knit, black. The face rides quiet until someone gets close enough to read it.",
    accent: "#1233c7",
    free: false,
    variants: [
      {
        id: "unisex-pique-polo-black",
        label: "Black",
        price: "$32.83",
        priceCents: 3283,
        image: "/img/products/polo.png",
        printfulVariantId: 16754,
      },
    ],
  },
  {
    id: "unisex-hoodie",
    name: "Unisex Hoodie",
    voice: "Terry the Sketcher",
    blurb: "Heavyweight, black. Built for East Van nights, not the studio.",
    accent: "#1233c7",
    free: false,
    variants: [
      {
        id: "unisex-hoodie-black",
        label: "Black",
        price: "$42.58",
        priceCents: 4258,
        image: "/img/products/hoodie.png",
        printfulVariantId: 5532,
      },
    ],
  },
  {
    id: "organic-dad-hat",
    name: "Organic Dad Hat",
    voice: "Terry the Sketcher",
    blurb: "Organic cotton, black. Low profile, permanent signal.",
    accent: "#1233c7",
    free: false,
    variants: [
      {
        id: "organic-dad-hat-black",
        label: "Black",
        price: "$31.53",
        priceCents: 3153,
        image: "/img/products/dad-hat-black.jpg",
        printfulVariantId: 12689,
      },
    ],
  },
];

/** Flat list of every purchasable variant — what checkout looks products up by. */
export function getVariant(id: string): { product: Product; variant: Variant } | undefined {
  for (const product of products) {
    const variant = product.variants.find((v) => v.id === id);
    if (variant) return { product, variant };
  }
  return undefined;
}
