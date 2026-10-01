import type { Metadata } from "next";
import { InfoPage, Tape, Tbd } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Privacy",
  robots: { index: false },
};

export default function PrivacyB() {
  return (
    <InfoPage
      slug="privacy"
      option="b"
      kicker="Privacy"
      title={<>What we<br />keep.</>}
      lede={<p>The plain-language version. <Tbd>template only: legal review before launch, and keep a full policy (Option A) linked below this</Tbd></p>}
    >
      <Tape
        items={[
          { q: "What do you collect?", a: <p>Your name, email and address when you buy, so we can ship it. Your postal code before checkout, to price shipping. Your email if you join the list.</p> },
          { q: "My card number?", a: <p>Never touches us. Stripe handles payment.</p> },
          { q: "Who sees my info?", a: <p>Stripe (payment), Printful (they make and ship it), our web host, and our email list provider if you sign up. Nobody else, and we don&apos;t sell it.</p> },
          { q: "Cookies?", a: <p>One, to remember which shop design you saw. Plus your shipping location saved in your browser. No ad tracking.</p> },
          { q: "Can I get it deleted?", a: <p>Yes. Email <Tbd>privacy email</Tbd> and we&apos;ll sort it within 30 days.</p> },
          { q: "Emails from you?", a: <p>Only if you ask for them. One click to unsubscribe.</p> },
        ]}
        footnote={<>Last updated <Tbd>date</Tbd>.</>}
      />
    </InfoPage>
  );
}
