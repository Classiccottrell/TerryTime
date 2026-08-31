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
 * Live catalog from the Terry Store on Printful (store ID 18616880), pulled
 * via the Printful API (PRINTFUL_API_KEY in .env.local) — 6 real products,
 * each variant is a real Printful size/color/SKU with a real price/image.
 */
export const products: Product[] = [
  {
    id: "terry-sticker-sheet",
    name: "Terry Sticker Sheet",
    voice: "Terry the Sketcher",
    blurb: "Kiss-cut sticker sheet, 5.83\" × 8.27\". Peel, stick, repeat.",
    accent: "#1233c7",
    free: false,
    variants: [
      {
        id: "terry-sticker-sheet",
        label: "5.83″×8.27″ sheet",
        price: "$8",
        priceCents: 800,
        image: "https://files.cdn.printful.com/files/f0f/f0f50346de18630699bf258b803c698b_preview.png",
        printfulVariantId: 12917,
      },
    ],
  },
  {
    id: "terry-holographic",
    name: "Terry Holographic",
    voice: "Terry the Sketcher",
    blurb: "Holographic die-cut sticker.",
    accent: "#1233c7",
    free: false,
    variants: [
      {
        id: "terry-holographic-3x3",
        label: "3″×3″",
        price: "$12",
        priceCents: 1200,
        image: "https://files.cdn.printful.com/files/9f0/9f050096f9b256ae300239308b32390a_preview.png",
        printfulVariantId: 16705,
      },
      {
        id: "terry-holographic-4x4",
        label: "4″×4″",
        price: "$13",
        priceCents: 1300,
        image: "https://files.cdn.printful.com/files/46a/46aa6659ec1680c7b4eb38be0280ade9_preview.png",
        printfulVariantId: 16706,
      },
      {
        id: "terry-holographic-5-5x5-5",
        label: "5.5″×5.5″",
        price: "$14",
        priceCents: 1400,
        image: "https://files.cdn.printful.com/files/94c/94cce1fcb9979d2a2974e55a91918362_preview.png",
        printfulVariantId: 16707,
      },
    ],
  },
  {
    id: "unisex-hoodie",
    name: "Unisex Hoodie",
    voice: "Terry the Sketcher",
    blurb: "Heavyweight unisex hoodie.",
    accent: "#1233c7",
    free: false,
    variants: [
      {
        id: "unisex-hoodie",
        label: "One size",
        price: "$42.58",
        priceCents: 4258,
        image: "https://files.cdn.printful.com/files/ea9/ea9114472c7e31e9ecb6b7813a3d0177_preview.png",
        printfulVariantId: 5532,
      },
    ],
  },
  {
    id: "organic-dad-hat",
    name: "Organic Dad Hat",
    voice: "Terry the Sketcher",
    blurb: "Organic cotton dad hat, unstructured.",
    accent: "#1233c7",
    free: false,
    variants: [
      {
        id: "organic-dad-hat-black",
        label: "Black",
        price: "$31.53",
        priceCents: 3153,
        image: "https://files.cdn.printful.com/products/491/12689_1622214735.jpg",
        printfulVariantId: 12689,
      },
      {
        id: "organic-dad-hat-pacific",
        label: "Pacific",
        price: "$31.53",
        priceCents: 3153,
        image: "https://files.cdn.printful.com/products/491/12693_1622214746.jpg",
        printfulVariantId: 12693,
      },
      {
        id: "organic-dad-hat-charcoal",
        label: "Charcoal",
        price: "$31.53",
        priceCents: 3153,
        image: "https://files.cdn.printful.com/products/491/12690_1622214737.jpg",
        printfulVariantId: 12690,
      },
      {
        id: "organic-dad-hat-jungle",
        label: "Jungle",
        price: "$31.53",
        priceCents: 3153,
        image: "https://files.cdn.printful.com/products/491/12691_1692702100.jpg",
        printfulVariantId: 12691,
      },
      {
        id: "organic-dad-hat-oyster",
        label: "Oyster",
        price: "$31.53",
        priceCents: 3153,
        image: "https://files.cdn.printful.com/products/491/12692_1622214744.jpg",
        printfulVariantId: 12692,
      },
    ],
  },
  {
    id: "unisex-pique-polo",
    name: "Unisex Pique Polo Shirt",
    voice: "Terry the Sketcher",
    blurb: "Pique-knit unisex polo.",
    accent: "#1233c7",
    free: false,
    variants: [
      {
        id: "unisex-pique-polo",
        label: "One size",
        price: "$32.83",
        priceCents: 3283,
        image: "https://files.cdn.printful.com/files/d71/d715a59eb9aa98d59d06830a121390d2_preview.png",
        printfulVariantId: 16754,
      },
    ],
  },
  {
    id: "east-van-legend-tote",
    name: "East Van Legend Tote Bag",
    voice: "Larry the Documentarian",
    blurb: "Canvas tote bag.",
    accent: "#1233c7",
    free: false,
    variants: [
      {
        id: "east-van-legend-tote",
        label: "One size",
        price: "$33.50",
        priceCents: 3350,
        image: "https://files.cdn.printful.com/files/a22/a226c29fb0050d89bb9f713876c52290_preview.png",
        printfulVariantId: 10458,
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
