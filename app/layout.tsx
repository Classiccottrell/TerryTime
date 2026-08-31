import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://terryterrylarryberry.com"),
  title: {
    default: "TerryTime Shop",
    template: "%s · TerryTime",
  },
  description: "TerryTime sticker and merch shop — real Printful stock, Stripe checkout.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
