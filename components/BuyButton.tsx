"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";

export function BuyButton({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onBuy() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
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
        href={product.downloadUrl ?? "#"}
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
        disabled={loading}
        className="w-full border border-ink bg-ink px-6 py-3 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest text-paper transition-colors hover:bg-red hover:border-red disabled:opacity-60"
      >
        {loading ? "Starting…" : `Buy — ${product.price}`}
      </button>
      {error && (
        <p className="mt-2 font-[family-name:var(--font-spacemono)] text-xs text-red">{error}</p>
      )}
    </div>
  );
}
