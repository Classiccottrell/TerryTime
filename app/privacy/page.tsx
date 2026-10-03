import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, Ledger, Tbd } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Terry Time collects, why, and who it's shared with.",
  robots: { index: false },
};

export default function PrivacyA() {
  return (
    <InfoPage
      slug="privacy"
      option="a"
      kicker="File 04 / Privacy"
      title={<>Privacy<br />policy.</>}
      lede={
        <>
          <p>We collect what it takes to make and ship your order, and nothing for advertising. Last updated <Tbd>date</Tbd>.</p>
          <p><Tbd>template only, not legal advice: have it reviewed before launch (PIPEDA / BC PIPA, CASL, US state privacy laws)</Tbd></p>
        </>
      }
    >
      <Ledger
        sections={[
          { label: "Who we are", body: <p>Terry Time (&ldquo;Terry Terry Larry Berry&rdquo;), operated by <Tbd>legal name / business</Tbd>, East Vancouver, BC. Privacy contact: <Tbd>privacy email</Tbd>.</p> },
          {
            label: "What we collect",
            body: (
              <ul>
                <li><strong>When you buy:</strong> name, email, shipping address and payment, entered in Stripe&apos;s checkout. We never see or store your card number.</li>
                <li><strong>Before checkout:</strong> the country, province/state and postal code you enter to price shipping.</li>
                <li><strong>If you join the newsletter:</strong> your email address.</li>
                <li><strong>When you write to us:</strong> whatever you include in the message.</li>
                <li><strong>Automatically:</strong> standard server logs (IP address, browser, pages requested) kept by our host. <Tbd>add analytics provider if one is added</Tbd></li>
              </ul>
            ),
          },
          {
            label: "Who it's shared with",
            body: (
              <table>
                <thead><tr><th>Service</th><th>Why</th><th>What they get</th></tr></thead>
                <tbody>
                  <tr><td>Stripe</td><td>Payment</td><td>Checkout details and payment</td></tr>
                  <tr><td>Printful</td><td>Making and shipping your order</td><td>Name, shipping address, email, what you ordered</td></tr>
                  <tr><td>Vercel</td><td>Hosting the site</td><td>Server logs</td></tr>
                  <tr><td><Tbd>Resend / newsletter provider</Tbd></td><td>Newsletter</td><td>Email address</td></tr>
                </tbody>
              </table>
            ),
          },
          {
            label: "Cookies & storage",
            body: (
              <ul>
                <li><code>tt_variant</code> cookie (30 days): remembers which of our two shop designs you were shown, so the site doesn&apos;t switch on you.</li>
                <li>No advertising or cross-site tracking cookies.</li>
              </ul>
            ),
          },
          { label: "Newsletter", body: <p>Only with your consent, and every email has an unsubscribe link. We follow Canada&apos;s anti-spam law (CASL).</p> },
          { label: "How long we keep it", body: <p>Order records as long as tax law requires <Tbd>e.g. 6 years in Canada</Tbd>; newsletter emails until you unsubscribe; messages until resolved plus <Tbd>period</Tbd>.</p> },
          { label: "Where it's stored", body: <p>Our providers may store data in Canada, the United States or elsewhere, under their own safeguards.</p> },
          { label: "Your rights", body: <p>Ask to see, correct or delete your information, or withdraw consent, by emailing <Tbd>privacy email</Tbd>. We&apos;ll answer within 30 days.</p> },
          { label: "Changes", body: <p>If this changes in a way that matters, we&apos;ll update the date above. Questions: <Link href="/contact">contact us</Link>.</p> },
        ]}
      />
    </InfoPage>
  );
}
