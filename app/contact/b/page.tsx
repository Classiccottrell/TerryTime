import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";
import { InfoPage, Tbd } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Contact",
  robots: { index: false },
};

export default function ContactB() {
  return (
    <InfoPage
      slug="contact"
      option="b"
      kicker="Contact"
      title={<>Say<br />something.</>}
      lede={<p>Fill this in and it opens your email app with everything ready to send. Or write to <Tbd>hello@terryterrylarryberry.com</Tbd> directly.</p>}
    >
      <div className="tape">
        <ContactForm />
        <p className="tape__foot">We reply within two business days.</p>
      </div>
    </InfoPage>
  );
}
