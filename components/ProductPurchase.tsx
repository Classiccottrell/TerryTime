"use client";

import { useState } from "react";
import { BuyButton } from "@/components/BuyButton";
import type { Product } from "@/lib/catalog-core";

export function ProductPurchase({ product }: { product: Product }) {
  const multiple = product.variants.length > 1;
  // With several sizes nothing is pre-selected: a default size would mean
  // people checking out in the wrong one without noticing.
  const [variantIndex, setVariantIndex] = useState<number | null>(multiple ? null : 0);
  const variant = variantIndex === null ? null : product.variants[variantIndex];

  return (
    <div className="shop-purchase">
      {multiple && (
        <fieldset className="shop-sizes">
          <legend>Size</legend>
          <div className="shop-variants">
            {product.variants.map((option, index) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setVariantIndex(index)}
                aria-pressed={variantIndex === index}
                aria-label={`${product.name}, size ${option.label}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <BuyButton variant={variant} />
    </div>
  );
}
