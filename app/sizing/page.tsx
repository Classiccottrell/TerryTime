import type { Metadata } from "next";
import { InfoPage, Ledger, Tbd } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Sizing",
  description: "Garment measurements for the Terry Time polo and hoodie, sizes S to XL.",
  robots: { index: false },
};

const SIZES = ["S", "M", "L", "XL"];

// Measurements come from Printful's size guide for the exact blanks in the
// store; they are deliberately left as TBD rather than guessed.
function MeasureTable({ product }: { product: string }) {
  return (
    <table>
      <caption className="sr-only">{product} measurements</caption>
      <thead>
        <tr><th>Size</th><th>Chest width (cm / in)</th><th>Body length (cm / in)</th><th>Sleeve (cm / in)</th></tr>
      </thead>
      <tbody>
        {SIZES.map((size) => (
          <tr key={size}><td>{size}</td><td><Tbd>—</Tbd></td><td><Tbd>—</Tbd></td><td><Tbd>—</Tbd></td></tr>
        ))}
      </tbody>
    </table>
  );
}

export default function SizingA() {
  return (
    <InfoPage
      slug="sizing"
      option="a"
      kicker="File 02 / Sizing"
      title={<>Sizing.</>}
      lede={<p>Measurements are of the garment laid flat, not of a body. Compare against a shirt or hoodie you already own and like the fit of.</p>}
    >
      <Ledger
        sections={[
          {
            label: "How to measure",
            body: (
              <ul>
                <li><strong>Chest width:</strong> armpit to armpit, straight across.</li>
                <li><strong>Body length:</strong> highest point of the shoulder to the bottom hem.</li>
                <li><strong>Sleeve:</strong> shoulder seam to cuff.</li>
              </ul>
            ),
          },
          {
            label: "Unisex pique polo",
            body: <><p>Regular fit. <Tbd>fit note from Printful product page</Tbd></p><MeasureTable product="Polo" /></>,
          },
          {
            label: "Unisex hoodie",
            body: <><p>Relaxed, heavyweight. <Tbd>fit note; does it run large?</Tbd></p><MeasureTable product="Hoodie" /></>,
          },
          {
            label: "Organic dad hat",
            body: <p>One size, adjustable strap at the back. <Tbd>circumference range from Printful</Tbd></p>,
          },
          {
            label: "Between sizes",
            body: <p>Size up for the hoodie if you want it to layer; size to fit for the polo. Because everything is made to order, we can&apos;t exchange for size, so measure first.</p>,
          },
        ]}
      />
    </InfoPage>
  );
}
