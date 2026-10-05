import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, Tape, Tbd } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Shipping & returns",
  robots: { index: false },
};

export default function ShippingB() {
  return (
    <InfoPage
      slug="shipping"
      option="b"
      kicker="Shipping & returns"
      title={<>How it<br />gets to you.</>}
      lede={<p>Short version: made to order, shipped to Canada and the US, priced for your address before you pay.</p>}
    >
      <Tape
        items={[
          { q: "Where do you ship?", a: <p>Canada and the US.</p> },
          { q: "How much is shipping?", a: <p>What it costs us to get it to you in Canada, plus a little for the US. You&apos;ll see the number at checkout, before you pay. <Tbd>at cost / + buffer / free over $X</Tbd></p> },
          { q: "How long?", a: <p>About a week to make it (it&apos;s embroidered for you), then a few days in the mail. Your estimate shows at checkout.</p> },
          { q: "Will I pay duties?", a: <p><Tbd>answer once duties are confirmed with Printful</Tbd></p> },
          { q: "Can I return it?", a: <p>Not for a change of heart or the wrong size, sorry. It&apos;s made just for you. Check <Link href="/sizing">sizing</Link> first. <Tbd>exchange policy</Tbd></p> },
          { q: "It arrived wrong or damaged.", a: <p>Send a photo within 30 days and we&apos;ll remake it or refund you. <Tbd>confirm 30 days</Tbd></p> },
          { q: "I typed the wrong address.", a: <p>Tell us fast (within 2 hours) and we&apos;ll catch it before it&apos;s made.</p> },
          { q: "Where's my parcel?", a: <p>Use the tracking link in your shipping email. Stuck for 10+ business days? <Link href="/contact">Message us</Link>.</p> },
        ]}
        footnote="Prices in CAD. Made to order by Printful."
      />
    </InfoPage>
  );
}
