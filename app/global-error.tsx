"use client";

import "./globals.css";
import { ErrorScreen } from "@/components/ErrorScreen";

// Last resort: the root layout itself failed, so this renders its own <html>.
// Plain <a> tags (full reloads) on purpose: client routing may be what broke.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main className="shop-design shop-error">
          <ErrorScreen
            code="500"
            title={<>The whole<br />wall came down.</>}
            message={
              <>
                The site hit an error it couldn&apos;t recover from. Reload, or come back in a minute.
                {error.digest && <span className="error-screen__ref">Ref {error.digest}</span>}
              </>
            }
          >
            <button type="button" className="shop-text-link" onClick={reset}>Try again <span>↻</span></button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="shop-text-link">Reload the shop <span>↗</span></a>
          </ErrorScreen>
        </main>
      </body>
    </html>
  );
}
