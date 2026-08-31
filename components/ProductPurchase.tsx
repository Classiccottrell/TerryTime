"use client";

import { useState } from "react";
import { BuyButton } from "@/components/BuyButton";
import type { Product } from "@/lib/products";

export function ProductPurchase({ product }: { product: Product }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const variant = product.variants[variantIndex];

  return (
    <div className="shop-purchase">
      {product.variants.length > 1 && (
        <div className="shop-variants" aria-label={`${product.name} options`}>
          {product.variants.map((option, index) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setVariantIndex(index)}
              aria-pressed={variantIndex === index}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      <BuyButton product={product} variant={variant} />
    </div>
  );
}
