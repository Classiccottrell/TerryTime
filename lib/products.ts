export type Product = {
  id: string;
  name: string;
  voice: string;
  price: string;
  free: boolean;
  blurb: string;
  count: string;
  accent: string;
};

export const products: Product[] = [
  {
    id: "unfinished-lines",
    name: "Unfinished Lines",
    voice: "Terry the Sketcher",
    price: "Free",
    free: true,
    blurb: "Download the SVG. The line stops where Terry stopped. You finish it.",
    count: "6 vector sketches",
    accent: "#ffe135",
  },
  {
    id: "two-states",
    name: "Two States",
    voice: "Terry the Philosopher",
    price: "$12",
    free: false,
    blurb: "Every sticker is two stickers. What it is, and what you imagined. Holographic.",
    count: "8 die-cut stickers",
    accent: "#808080",
  },
  {
    id: "east-van-frames",
    name: "East Van Frames",
    voice: "Larry the Documentarian",
    price: "$16",
    free: false,
    blurb: "High-contrast street shots, printed on weatherproof vinyl. The real Vancouver.",
    count: "10 photo stickers",
    accent: "#cc0000",
  },
  {
    id: "the-cut",
    name: "The Cut",
    voice: "Berry the Editor",
    price: "$10",
    free: false,
    blurb: "Berry chose four. Only four. The ones that earned the space.",
    count: "4 essential stickers",
    accent: "#2d5f2e",
  },
  {
    id: "the-full-psyche",
    name: "The Full Psyche",
    voice: "All four voices",
    price: "$32",
    free: false,
    blurb: "The complete collective in one pack. Sketch, doubt, document, and edit — together.",
    count: "28 stickers + zine",
    accent: "#ffe135",
  },
  {
    id: "add-more-zine",
    name: "#ADDMORE Zine",
    voice: "Community curated",
    price: "Free",
    free: true,
    blurb: "Remixes from the community. Tag your work with #addmore and you might end up inside.",
    count: "Digital zine, monthly",
    accent: "#2d5f2e",
  },
];
