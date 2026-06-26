"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";

export function BuyButton({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accent = product.accent;

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
        className="mt-5 inline-block border-2 px-6 py-2.5 text-center font-[family-name:var(--font-display)] text-base tracking-widest transition-colors hover:bg-[color:var(--btn)] hover:text-ink"
        style={{ borderColor: accent, color: accent, ["--btn" as string]: accent }}
      >
        DOWNLOAD
      </a>
    );
  }

  return (
    <div className="mt-5">
      <button
        onClick={onBuy}
        disabled={loading}
        className="w-full border-2 px-6 py-2.5 font-[family-name:var(--font-display)] text-base tracking-widest transition-colors hover:bg-[color:var(--btn)] hover:text-ink disabled:opacity-60"
        style={{ borderColor: accent, color: accent, ["--btn" as string]: accent }}
      >
        {loading ? "STARTING…" : `BUY — ${product.price}`}
      </button>
      {error && (
        <p className="mt-2 font-[family-name:var(--font-spacemono)] text-xs text-red">
          {error}
        </p>
      )}
    </div>
  );
}
