import Link from "next/link";
import type { ReactNode } from "react";
import { ShopNavigation } from "@/components/ShopNavigation";
import { SiteLinks } from "@/components/SiteLinks";

/**
 * Shell for the customer-information pages. While both drafts exist, a review
 * bar links Option A (/page) and Option B (/page/b); delete the loser and the
 * `draft` prop once one is chosen.
 */
export function InfoPage({
  slug,
  option,
  kicker,
  title,
  lede,
  children,
}: {
  slug: string;
  option: "a" | "b";
  kicker: string;
  title: ReactNode;
  lede: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className={`shop-design info-page info-page--${option}`}>
      <ShopNavigation />
      <div className="info-draftbar" role="note">
        <span>Draft for review</span>
        <Link href={`/${slug}`} aria-current={option === "a" ? "page" : undefined}>Option A · Ledger</Link>
        <Link href={`/${slug}/b`} aria-current={option === "b" ? "page" : undefined}>Option B · Plain talk</Link>
      </div>
      <header className="info-head">
        <p className="shop-kicker">{kicker}</p>
        <h1>{title}</h1>
        <div className="info-head__lede">{lede}</div>
      </header>
      {children}
      <footer className="info-footer">
        <span>Terry Terry Larry Berry · East Vancouver</span>
        <SiteLinks />
      </footer>
    </main>
  );
}

/** Option A: numbered clauses with a label column, like a case file. */
export function Ledger({ sections }: { sections: { label: string; body: ReactNode }[] }) {
  return (
    <ol className="ledger">
      {sections.map((section, i) => (
        <li key={section.label}>
          <h2><span>{String(i + 1).padStart(2, "0")}</span>{section.label}</h2>
          <div className="ledger__body">{section.body}</div>
        </li>
      ))}
    </ol>
  );
}

/** Option B: one narrow tape of short questions and answers. */
export function Tape({ items, footnote }: { items: { q: string; a: ReactNode }[]; footnote?: ReactNode }) {
  return (
    <div className="tape">
      <dl>
        {items.map((item) => (
          <div key={item.q}>
            <dt>{item.q}</dt>
            <dd>{item.a}</dd>
          </div>
        ))}
      </dl>
      {footnote && <p className="tape__foot">{footnote}</p>}
    </div>
  );
}

/** A fact still to be confirmed; highlighted so it can't ship by accident unnoticed. */
export function Tbd({ children }: { children: ReactNode }) {
  return <mark className="tbd">TBD: {children}</mark>;
}
