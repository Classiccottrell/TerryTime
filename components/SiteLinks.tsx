import Link from "next/link";
import { infoPages } from "@/lib/info-pages";

export function SiteLinks({ className }: { className?: string }) {
  return (
    <nav className={`site-links${className ? ` ${className}` : ""}`} aria-label="Customer information">
      <ul>
        {infoPages.map((page) => (
          <li key={page.href}>
            <Link href={page.href}>{page.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
