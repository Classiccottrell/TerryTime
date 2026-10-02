import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage, Ledger, Tbd } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach Terry Time about an order, press, or a collaboration.",
  robots: { index: false },
};

export default function ContactA() {
  return (
    <InfoPage
      slug="contact"
      option="a"
      kicker="File 03 / Contact"
      title={<>Contact.</>}
      lede={<p>A real person reads every message. Usually within two business days.</p>}
    >
      <Ledger
        sections={[
          {
            label: "Orders",
            body: (
              <>
                <p>Email <Tbd>orders@terryterrylarryberry.com</Tbd> with your order number (it&apos;s on your email receipt) and, for anything damaged or misprinted, a photo.</p>
                <p>Shipping and returns questions are probably answered on <Link href="/shipping">shipping &amp; returns</Link>.</p>
              </>
            ),
          },
          { label: "Press & collabs", body: <p><Tbd>hello@terryterrylarryberry.com</Tbd> — shops, zines, walls, collaborations.</p> },
          { label: "Elsewhere", body: <p>Instagram <Tbd>@handle</Tbd>. DMs are read, but email is faster for orders.</p> },
          { label: "Response time", body: <p>Within two business days, Pacific time. <Tbd>confirm</Tbd></p> },
          { label: "Mail", body: <p><Tbd>business mailing address, if you want one listed (not required; can be a PO box)</Tbd></p> },
        ]}
      />
    </InfoPage>
  );
}
