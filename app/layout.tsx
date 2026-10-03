import type { Metadata } from "next";
import "./globals.css";
import { DevStoreSwitch } from "@/components/DevStoreSwitch";

export const metadata: Metadata = {
  metadataBase: new URL("https://terryterrylarryberry.com"),
  title: {
    default: "TerryTime Shop",
    template: "%s · TerryTime",
  },
  description: "Embroidered East Van apparel from Terry Time. Polo, hoodie and dad hat, printed to order.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <DevStoreSwitch />
      </body>
    </html>
  );
}
