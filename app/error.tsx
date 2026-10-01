"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ErrorScreen } from "@/components/ErrorScreen";
import { ShopNavigation } from "@/components/ShopNavigation";

// Runtime errors inside a page (the root layout still renders).
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="shop-design shop-error">
      <ShopNavigation />
      <ErrorScreen
        code="500"
        title={<>The ink<br />ran.</>}
        message={
          <>
            Something broke on our side, not yours. Try again; if it keeps happening, tell us.
            {error.digest && <span className="error-screen__ref">Ref {error.digest}</span>}
          </>
        }
      >
        <button type="button" className="shop-text-link" onClick={reset}>Try again <span>↻</span></button>
        <Link href="/shop" className="shop-text-link">Back to the shop <span>↗</span></Link>
        <Link href="/contact" className="shop-text-link">Contact <span>↗</span></Link>
      </ErrorScreen>
    </main>
  );
}
