import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, Ledger, Tbd } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: "Where Terry Time ships, what it costs, how long it takes, and what happens if something's wrong.",
  robots: { index: false }, // draft: index once an option is chosen
};

export default function ShippingA() {
  return (
    <InfoPage
      slug="shipping"
      option="a"
      kicker="File 01 / Shipping & returns"
      title={<>Shipping &amp;<br />returns.</>}
      lede={<p>Everything is printed and embroidered to order by our fulfilment partner, Printful, then shipped straight to you. Here&apos;s what that means for cost, timing and returns.</p>}
    >
      <Ledger
        sections={[
          {
            label: "Where we ship",
            body: <p>Canada and the United States. Pick your country, province or state, and postal code on any product before checkout; checkout then only accepts addresses in that country.</p>,
          },
          {
            label: "Cost",
            body: (
              <>
                <p>Shipping is priced live for your address, at Printful&apos;s rate for that exact order, and shown before you pay. We don&apos;t pad it. <Tbd>confirm: at cost, at cost + buffer, or free over a threshold</Tbd></p>
                <p>Prices are in Canadian dollars.</p>
              </>
            ),
          },
          {
            label: "Timing",
            body: (
              <table>
                <thead><tr><th>Stage</th><th>Typical</th></tr></thead>
                <tbody>
                  <tr><td>Made to order (embroidery)</td><td>2–7 business days</td></tr>
                  <tr><td>In transit</td><td>Shown at checkout for your address</td></tr>
                  <tr><td>Total estimate</td><td>Shown on the product before you buy</td></tr>
                </tbody>
              </table>
            ),
          },
          {
            label: "Duties & taxes",
            body: <p><Tbd>how duties and sales tax are handled for Canada → US and US → Canada orders (Printful fulfils from facilities in both countries)</Tbd></p>,
          },
          {
            label: "Tracking",
            body: <p>You get a receipt by email when you pay, and a tracking link when it ships. <Tbd>confirm Printful shipment emails are on and branded</Tbd></p>,
          },
          {
            label: "Wrong or damaged",
            body: <p>If something arrives misprinted, damaged or wrong, email us a photo within 30 days of delivery and we&apos;ll reprint it or refund you, your choice. <Tbd>confirm the 30-day window against Printful&apos;s claims policy</Tbd></p>,
          },
          {
            label: "Returns & exchanges",
            body: (
              <>
                <p>Because each piece is made for you, we can&apos;t take returns for a change of mind or the wrong size. Check the <Link href="/sizing">sizing guide</Link> before you order.</p>
                <p><Tbd>decide: no size exchanges, or one free exchange (you cover return postage)</Tbd></p>
              </>
            ),
          },
          {
            label: "Wrong address",
            body: <p>Email us within 2 hours of ordering and we&apos;ll fix it before it&apos;s made. After that, a parcel returned for a bad address can be reshipped at your cost.</p>,
          },
          {
            label: "Lost parcels",
            body: <p>If tracking stalls for more than 10 business days, tell us. We&apos;ll chase it and reship if it&apos;s lost. <Tbd>confirm timeframe with Printful</Tbd></p>,
          },
          {
            label: "Questions",
            body: <p><Link href="/contact">Contact us</Link> with your order number (it&apos;s on your email receipt).</p>,
          },
        ]}
      />
    </InfoPage>
  );
}
