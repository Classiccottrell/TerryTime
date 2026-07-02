/*
  Design-system data — the single source that powers /design-system.
  Mirrors the @theme tokens in app/globals.css. Keep the two in sync.
*/

export type Swatch = {
  name: string;
  token: string; // Tailwind color token (e.g. "paper" → bg-paper / text-paper)
  hex: string;
  usage: string;
  /** true when the swatch is dark enough to need light text on top. */
  dark?: boolean;
};

export type SwatchGroup = {
  title: string;
  blurb: string;
  swatches: Swatch[];
};

export const palette: SwatchGroup[] = [
  {
    title: "Surfaces",
    blurb: "The site breathes between warm bone and deep teal-black. Two grounds, endless contrast.",
    swatches: [
      { name: "Bone", token: "paper", hex: "#EAE3D2", usage: "Default canvas — sketch-paper warmth" },
      { name: "Cloud", token: "cloud", hex: "#F3EDDF", usage: "Lifted bone — cards on light" },
      { name: "Ink", token: "ink", hex: "#122E36", usage: "Deep teal-black — text + every dark block", dark: true },
      { name: "Soot", token: "soot", hex: "#1B3A44", usage: "Lifted teal — cards on dark", dark: true },
      { name: "Teal", token: "teal", hex: "#1E4E5F", usage: "Feature surface — the painting's ground", dark: true },
    ],
  },
  {
    title: "Accents",
    blurb: "The electric yellow stays the signature pop; an earthy cast from the source works surrounds it.",
    swatches: [
      { name: "Yellow", token: "yellow", hex: "#FFE135", usage: "The signature pop" },
      { name: "Ochre", token: "ochre", hex: "#C6A02C", usage: "Earthy companion — mustard marker" },
      { name: "Vermilion", token: "red", hex: "#E23B2E", usage: "The painting's red halo", dark: true },
      { name: "Terracotta", token: "terracotta", hex: "#B25A2B", usage: "The painted figure", dark: true },
      { name: "Magenta", token: "magenta", hex: "#E84C92", usage: "Hot-pink jolt", dark: true },
      { name: "Indigo", token: "indigo", hex: "#2B2E77", usage: "Ballpoint ink", dark: true },
      { name: "Coral", token: "coral", hex: "#E39B82", usage: "Soft peach support" },
      { name: "Forest", token: "forest", hex: "#1F6F43", usage: "Reserved — 'free'", dark: true },
    ],
  },
  {
    title: "Muted & lines",
    blurb: "Quiet tones for secondary text and hairline rules, tuned per ground.",
    swatches: [
      { name: "Stone", token: "stone", hex: "#6E6656", usage: "Muted text on bone" },
      { name: "Smoke", token: "smoke", hex: "#8FA0A0", usage: "Muted text on teal-ink", dark: true },
      { name: "Line", token: "line", hex: "#D3C9B3", usage: "Hairline rule on bone" },
      { name: "Line ink", token: "lineink", hex: "#2E4C52", usage: "Hairline rule on teal-ink", dark: true },
    ],
  },
];

export type TypeRole = {
  name: string;
  cssVar: string; // font-family var name
  role: string;
  sample: string;
  className: string; // tailwind font-family utility
};

export const typeRoles: TypeRole[] = [
  {
    name: "Bebas Neue",
    cssVar: "--font-display",
    role: "Display — huge brand statements, character names, ticker",
    sample: "IT'S TERRY TIME",
    className: "font-[family-name:var(--font-display)]",
  },
  {
    name: "Space Grotesk",
    cssVar: "--font-grotesk",
    role: "Editorial headlines & UI — nav, buttons, section heads",
    sample: "Four voices that blend, never reduce.",
    className: "font-[family-name:var(--font-grotesk)]",
  },
  {
    name: "Crimson Text",
    cssVar: "--font-serif",
    role: "Long-form body — bios, essays, blurbs",
    sample: "You look at the void and you see the light.",
    className: "font-[family-name:var(--font-serif)]",
  },
  {
    name: "IBM Plex Mono",
    cssVar: "--font-mono",
    role: "Category eyebrows & meta labels",
    sample: "01 — THE COLLECTIVE",
    className: "font-[family-name:var(--font-mono)]",
  },
  {
    name: "Space Mono",
    cssVar: "--font-spacemono",
    role: "Ticker fine print & technical detail",
    sample: "ONE STICKER. INFINITE HUSTLE.",
    className: "font-[family-name:var(--font-spacemono)]",
  },
];

/** 8px base spacing scale. */
export const spacing = [
  { step: "1", px: 8 },
  { step: "2", px: 16 },
  { step: "3", px: 24 },
  { step: "4", px: 32 },
  { step: "6", px: 48 },
  { step: "8", px: 64 },
];
