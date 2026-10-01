import type { Metadata } from "next";
import { InfoPage, Tape, Tbd } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Sizing",
  robots: { index: false },
};

export default function SizingB() {
  return (
    <InfoPage
      slug="sizing"
      option="b"
      kicker="Sizing"
      title={<>Find your<br />size.</>}
      lede={<p>Grab a shirt you like the fit of, lay it flat, and match it to the numbers below.</p>}
    >
      <Tape
        items={[
          {
            q: "Quick guide",
            a: (
              <table>
                <thead><tr><th>You usually wear</th><th>Polo</th><th>Hoodie</th></tr></thead>
                <tbody>
                  <tr><td>S</td><td>S</td><td>S <Tbd>or XS? check fit</Tbd></td></tr>
                  <tr><td>M</td><td>M</td><td>M</td></tr>
                  <tr><td>L</td><td>L</td><td>L</td></tr>
                  <tr><td>XL</td><td>XL</td><td>XL</td></tr>
                </tbody>
              </table>
            ),
          },
          { q: "Polo, flat (chest / length)", a: <p>S <Tbd>— / —</Tbd> · M <Tbd>— / —</Tbd> · L <Tbd>— / —</Tbd> · XL <Tbd>— / —</Tbd></p> },
          { q: "Hoodie, flat (chest / length)", a: <p>S <Tbd>— / —</Tbd> · M <Tbd>— / —</Tbd> · L <Tbd>— / —</Tbd> · XL <Tbd>— / —</Tbd></p> },
          { q: "The hat?", a: <p>One size. Adjustable strap at the back.</p> },
          { q: "In between?", a: <p>Size up on the hoodie, true to size on the polo. Everything&apos;s made for you, so we can&apos;t swap sizes after.</p> },
        ]}
        footnote="Measurements in cm, garment laid flat."
      />
    </InfoPage>
  );
}
