"use client";

import { useEffect, useState } from "react";

/**
 * Shows a "checkout canceled" notice when Stripe redirects back with
 * ?canceled. Read on the client so the shop page stays statically
 * prerenderable (static export has no request-time searchParams).
 */
export function CanceledBanner() {
  const [canceled, setCanceled] = useState(false);

  useEffect(() => {
    setCanceled(new URLSearchParams(window.location.search).has("canceled"));
  }, []);

  if (!canceled) return null;

  return (
    <div className="shop-canceled-banner">
      <span>Checkout canceled.</span> No charge — take your time.
    </div>
  );
}
