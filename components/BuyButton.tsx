"use client";

import { useState } from "react";
import type { Variant } from "@/lib/catalog-core";

export function BuyButton({
  variant,
}: {
  variant: Variant | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onBuy() {
    if (!variant) {
      setError("Pick a size first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: variant.id }),
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

  return (
    <div className="mt-5">
      <button
        onClick={onBuy}
        disabled={loading || !variant}
        className="w-full border border-ink bg-ink px-6 py-3 font-[family-name:var(--font-grotesk)] text-sm font-bold uppercase tracking-widest text-paper transition-colors hover:bg-red hover:border-red disabled:opacity-60"
      >
        {loading ? "Starting…" : !variant ? "Select a size" : `Buy — ${variant.price}`}
      </button>
      {error && <p className="mt-2 font-[family-name:var(--font-spacemono)] text-xs text-red">{error}</p>}
    </div>
  );
}
