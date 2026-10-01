"use client";

import { useState } from "react";
import { formatPrice, type Product, type Variant } from "@/lib/products";
import type { Destination } from "@/lib/regions";
import { asset, isStaticExport } from "@/lib/site";

export type ShippingQuote = { amountCents: number; estimate: string; totalCents: number };

export function BuyButton({
  product,
  variant,
  destination,
  quote,
}: {
  product: Product;
  variant: Variant | null;
  destination: Destination | null;
  quote: ShippingQuote | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onBuy() {
    if (!variant) {
      setError("Pick a size first.");
      return;
    }
    if (!destination) {
      setError("Tell us where it's shipping first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: variant.id, destination }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Couldn't start checkout.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  }

  if (product.free) {
    return (
      <a
        href={product.downloadUrl ? asset(product.downloadUrl) : "#"}
        download
        className="mt-5 inline-block w-full border border-ink bg-paper px-6 py-3 text-center font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest text-ink transition-colors hover:bg-forest hover:border-forest hover:text-paper"
      >
        Download — Free
      </a>
    );
  }

  return (
    <div className="mt-5">
      <button
        onClick={onBuy}
        disabled={loading || isStaticExport || !variant || !destination || !quote}
        title={isStaticExport ? "Checkout runs on the live site" : undefined}
        className="w-full border border-ink bg-ink px-6 py-3 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest text-paper transition-colors hover:bg-red hover:border-red disabled:opacity-60"
      >
        {loading ? "Starting…" : !variant ? "Select a size" : !destination ? "Add shipping location" : !quote ? "Pricing shipping…" : `Buy — ${formatPrice(quote.totalCents)}`}
      </button>
      {isStaticExport ? (
        <p className="mt-2 font-[family-name:var(--font-spacemono)] text-xs text-stone">
          Checkout runs on the live site.
        </p>
      ) : (
        error && (
          <p className="mt-2 font-[family-name:var(--font-spacemono)] text-xs text-red">{error}</p>
        )
      )}
    </div>
  );
}
