import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, Tape, Tbd } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Terms of sale",
  robots: { index: false },
};

export default function TermsB() {
  return (
    <InfoPage
      slug="terms"
      option="b"
      kicker="Terms"
      title={<>The deal.</>}
      lede={<p>What you&apos;re agreeing to when you buy, in plain words. <Tbd>template only: legal review before launch; keep the full terms (Option A) linked below</Tbd></p>}
    >
      <Tape
        items={[
          { q: "Who am I buying from?", a: <p><Tbd>legal name / business</Tbd>, East Vancouver, BC.</p> },
          { q: "When is it made?", a: <p>After you order. Printful embroiders it just for you.</p> },
          { q: "What do I pay?", a: <p>The price in CAD, plus shipping for your address (shown before you pay), plus <Tbd>tax handling</Tbd>.</p> },
          { q: "Can I cancel?", a: <p>Within <Tbd>2 hours</Tbd>, before it&apos;s made.</p> },
          { q: "What if it's wrong?", a: <p>We fix it. Details on <Link href="/shipping">shipping &amp; returns</Link>.</p> },
          { q: "Can I reprint the art?", a: <p>Please don&apos;t sell copies. Terry belongs to <Tbd>owner</Tbd>.</p> },
          { q: "Which law applies?", a: <p>British Columbia, Canada.</p> },
        ]}
        footnote={<>Last updated <Tbd>date</Tbd>.</>}
      />
    </InfoPage>
  );
}
