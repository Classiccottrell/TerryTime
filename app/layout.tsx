import type { Metadata } from "next";
import {
  Bebas_Neue,
  Crimson_Text,
  IBM_Plex_Mono,
  Space_Mono,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Ticker } from "@/components/Ticker";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const crimson = Crimson_Text({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-grotesk-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://terryterrylarryberry.com"),
  title: {
    default: "Terry Terry Larry Berry — It's Terry Time",
    template: "%s · Terry Terry Larry Berry",
  },
  description:
    "An East Van underground art collective masquerading as a sticker brand. Four voices — the Sketcher, the Philosopher, the Documentarian, and the Editor.",
  keywords: ["East Van", "stickers", "art collective", "Vancouver", "street art", "Terry Time"],
  openGraph: {
    title: "Terry Terry Larry Berry — It's Terry Time",
    description:
      "An East Van underground art collective masquerading as a sticker brand. One sticker. Infinite hustle.",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terry Terry Larry Berry",
    description: "An East Van underground art collective masquerading as a sticker brand.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${crimson.variable} ${plexMono.variable} ${spaceMono.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {/* No-JS fallback: reveal-animated content must never stay hidden */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen flex flex-col">
        <Ticker />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
