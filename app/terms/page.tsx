import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, Ledger, Tbd } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Terms of sale",
  description: "The terms for buying from Terry Time.",
  robots: { index: false },
};

export default function TermsA() {
  return (
    <InfoPage
      slug="terms"
      option="a"
      kicker="File 05 / Terms"
      title={<>Terms of<br />sale.</>}
      lede={
        <>
          <p>By placing an order you agree to these terms. Last updated <Tbd>date</Tbd>.</p>
          <p><Tbd>template only, not legal advice: have it reviewed before launch</Tbd></p>
        </>
      }
    >
      <Ledger
        sections={[
          { label: "About us", body: <p>Terry Time is run by <Tbd>legal name / business</Tbd> in Vancouver, British Columbia, Canada.</p> },
          { label: "Made to order", body: <p>Every item is produced after you order it by our fulfilment partner, Printful. Colours and embroidery can vary slightly from what you see on screen.</p> },
          { label: "Prices & payment", body: <p>Prices are in Canadian dollars. Shipping is calculated for your address and shown before you pay. Taxes <Tbd>added at checkout / included</Tbd>. Payment is processed by Stripe; your order is confirmed once payment succeeds.</p> },
          { label: "Shipping", body: <p>We ship to Canada and the United States. Timing and costs are on <Link href="/shipping">shipping &amp; returns</Link>. Risk passes to you on delivery.</p> },
          { label: "Returns & defects", body: <p>Our returns policy, including what happens with misprinted or damaged items, is on <Link href="/shipping">shipping &amp; returns</Link>. Nothing in these terms limits your rights under consumer protection law.</p> },
          { label: "Cancellations", body: <p>Orders can be cancelled within <Tbd>2 hours</Tbd> of purchase, before production starts.</p> },
          { label: "The artwork", body: <p>The Terry character and all designs are © <Tbd>owner</Tbd>. Buying a piece doesn&apos;t transfer any rights to the artwork; please don&apos;t reproduce it for sale.</p> },
          { label: "Liability", body: <p>To the extent the law allows, our liability for any order is limited to what you paid for it.</p> },
          { label: "Governing law", body: <p>These terms are governed by the laws of British Columbia and the federal laws of Canada that apply there.</p> },
          { label: "Changes & contact", body: <p>We may update these terms; the version in force when you ordered applies to that order. Questions: <Link href="/contact">contact us</Link>.</p> },
        ]}
      />
    </InfoPage>
  );
}
