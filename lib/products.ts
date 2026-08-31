export type Product = {
  id: string;
  name: string;
  voice: string;
  /** Display price, e.g. "$12" or "Free". */
  price: string;
  /** Amount in cents (CAD). 0 for free items. Source of truth for checkout. */
  priceCents: number;
  free: boolean;
  blurb: string;
  count: string;
  accent: string;
  /** For free items: the file served when "Download" is clicked. */
  downloadUrl?: string;
  /** Absolute image URL — overrides the default /img/products/{id}.svg lookup.
   *  Used for real Printful product photography. */
  image?: string;
  /** Printful catalog variant ID this listing fulfils against (Terry Store,
   *  store ID 18616880). */
  printfulVariantId: number;
};

/**
 * Full live catalog from the Terry Store on Printful (store ID 18616880),
 * pulled via the Printful API (PRINTFUL_API_KEY in .env.local). Each
 * Printful variant (size/color) becomes its own checkout line item since
 * checkout is keyed by a single flat product id → priceCents.
 */
export const products: Product[] = [
  {
    id: "terry-sticker-sheet",
    name: "Terry Sticker Sheet",
    voice: "Terry the Sketcher",
    price: "$8",
    priceCents: 800,
    free: false,
    blurb: "Kiss-cut sticker sheet, 5.83\" × 8.27\". Peel, stick, repeat.",
    count: "5.83in × 8.27in sheet",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/files/f0f/f0f50346de18630699bf258b803c698b_preview.png",
    printfulVariantId: 12917,
  },
  {
    id: "terry-holographic-3x3",
    name: "Terry Holographic — 3″×3″",
    voice: "Terry the Sketcher",
    price: "$12",
    priceCents: 1200,
    free: false,
    blurb: "Holographic die-cut sticker, 3\" × 3\".",
    count: "3in × 3in holographic",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/files/9f0/9f050096f9b256ae300239308b32390a_preview.png",
    printfulVariantId: 16705,
  },
  {
    id: "terry-holographic-4x4",
    name: "Terry Holographic — 4″×4″",
    voice: "Terry the Sketcher",
    price: "$13",
    priceCents: 1300,
    free: false,
    blurb: "Holographic die-cut sticker, 4\" × 4\".",
    count: "4in × 4in holographic",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/files/46a/46aa6659ec1680c7b4eb38be0280ade9_preview.png",
    printfulVariantId: 16706,
  },
  {
    id: "terry-holographic-5-5x5-5",
    name: "Terry Holographic — 5.5″×5.5″",
    voice: "Terry the Sketcher",
    price: "$14",
    priceCents: 1400,
    free: false,
    blurb: "Holographic die-cut sticker, 5.5\" × 5.5\".",
    count: "5.5in × 5.5in holographic",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/files/94c/94cce1fcb9979d2a2974e55a91918362_preview.png",
    printfulVariantId: 16707,
  },
  {
    id: "crew-sheet",
    name: "Crew Sheet",
    voice: "Terry the Sketcher",
    price: "$9",
    priceCents: 900,
    free: false,
    blurb: "Kiss-cut sticker sheet.",
    count: "Sticker sheet",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/files/e07/e078b0ba8101e4c6ac33ef4da9910989_preview.png",
    printfulVariantId: 12917,
  },
  {
    id: "unisex-hoodie",
    name: "Unisex Hoodie",
    voice: "Terry the Sketcher",
    price: "$42.58",
    priceCents: 4258,
    free: false,
    blurb: "Heavyweight unisex hoodie.",
    count: "Apparel",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/files/ea9/ea9114472c7e31e9ecb6b7813a3d0177_preview.png",
    printfulVariantId: 5532,
  },
  {
    id: "organic-dad-hat-black",
    name: "Organic Dad Hat — Black",
    voice: "Terry the Sketcher",
    price: "$31.53",
    priceCents: 3153,
    free: false,
    blurb: "Organic cotton dad hat, unstructured.",
    count: "Black",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/products/491/12689_1622214735.jpg",
    printfulVariantId: 12689,
  },
  {
    id: "organic-dad-hat-pacific",
    name: "Organic Dad Hat — Pacific",
    voice: "Terry the Sketcher",
    price: "$31.53",
    priceCents: 3153,
    free: false,
    blurb: "Organic cotton dad hat, unstructured.",
    count: "Pacific",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/products/491/12693_1622214746.jpg",
    printfulVariantId: 12693,
  },
  {
    id: "organic-dad-hat-charcoal",
    name: "Organic Dad Hat — Charcoal",
    voice: "Terry the Sketcher",
    price: "$31.53",
    priceCents: 3153,
    free: false,
    blurb: "Organic cotton dad hat, unstructured.",
    count: "Charcoal",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/products/491/12690_1622214737.jpg",
    printfulVariantId: 12690,
  },
  {
    id: "organic-dad-hat-jungle",
    name: "Organic Dad Hat — Jungle",
    voice: "Terry the Sketcher",
    price: "$31.53",
    priceCents: 3153,
    free: false,
    blurb: "Organic cotton dad hat, unstructured.",
    count: "Jungle",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/products/491/12691_1692702100.jpg",
    printfulVariantId: 12691,
  },
  {
    id: "organic-dad-hat-oyster",
    name: "Organic Dad Hat — Oyster",
    voice: "Terry the Sketcher",
    price: "$31.53",
    priceCents: 3153,
    free: false,
    blurb: "Organic cotton dad hat, unstructured.",
    count: "Oyster",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/products/491/12692_1622214744.jpg",
    printfulVariantId: 12692,
  },
  {
    id: "unisex-pique-polo",
    name: "Unisex Pique Polo Shirt",
    voice: "Terry the Sketcher",
    price: "$32.83",
    priceCents: 3283,
    free: false,
    blurb: "Pique-knit unisex polo.",
    count: "Apparel",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/files/d71/d715a59eb9aa98d59d06830a121390d2_preview.png",
    printfulVariantId: 16754,
  },
  {
    id: "east-van-legend-tote",
    name: "East Van Legend Tote Bag",
    voice: "Larry the Documentarian",
    price: "$33.50",
    priceCents: 3350,
    free: false,
    blurb: "Canvas tote bag.",
    count: "Bag",
    accent: "#1233c7",
    image: "https://files.cdn.printful.com/files/a22/a226c29fb0050d89bb9f713876c52290_preview.png",
    printfulVariantId: 10458,
  },
];

/** Deprecated alias — the whole catalog is Printful-sourced now. */
export const printfulProducts = products;

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
