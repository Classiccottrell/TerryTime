"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { BuyButton } from "@/components/BuyButton";

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const variant = product.variants[variantIndex];
  const hasVariants = product.variants.length > 1;

  return (
    <article
      className={`brutal-border p-6 flex flex-col gap-4 ${index % 2 === 1 ? "md:mt-16" : ""}`}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold tracking-widest">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-lg font-bold">{variant.price}</span>
      </div>

      <div className="relative w-full aspect-square brutal-border">
        <Image
          src={variant.image}
          alt={`${product.name}${hasVariants ? ` — ${variant.label}` : ""}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4"
          unoptimized
        />
      </div>

      <h3 className="text-2xl font-bold uppercase tracking-tight">{product.name}</h3>
      <p className="text-sm leading-relaxed">{product.blurb}</p>

      {hasVariants && (
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariantIndex(i)}
              aria-pressed={i === variantIndex}
              className="brutal-btn !py-1 !px-2.5 text-xs"
              style={
                i === variantIndex
                  ? { background: "var(--brutal-black)", color: "var(--brutal-white)" }
                  : undefined
              }
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1" />
      <BuyButton product={product} variant={variant} />
    </article>
  );
}
