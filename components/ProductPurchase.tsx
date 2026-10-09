"use client";

import { useRef, useState } from "react";
import { BuyButton } from "@/components/BuyButton";
import { colorsOf, type Product } from "@/lib/catalog-core";

export function ProductPurchase({ product }: { product: Product }) {
  const colors = colorsOf(product);
  const [color, setColor] = useState(colors[0]);
  const sizes = product.variants.filter((v) => v.color === color);
  // With several sizes nothing is pre-selected: a default size would mean
  // people checking out in the wrong one without noticing.
  const [variantId, setVariantId] = useState<string | null>(sizes.length === 1 ? sizes[0].id : null);
  const variant = sizes.find((v) => v.id === variantId) ?? null;
  const root = useRef<HTMLDivElement>(null);

  function pickColor(next: string) {
    setColor(next);
    const nextSizes = product.variants.filter((v) => v.color === next);
    // Keep the chosen size if it exists in the new colour.
    const same = nextSizes.find((v) => v.size === variant?.size);
    setVariantId(same?.id ?? (nextSizes.length === 1 ? nextSizes[0].id : null));
    // Swap the card's photo (components/ProductImages.tsx).
    root.current?.closest("[data-product]")?.querySelectorAll<HTMLElement>("[data-color-img]")
      .forEach((img) => { img.hidden = img.dataset.colorImg !== next; });
  }

  return (
    <div className="shop-purchase" ref={root}>
      {colors.length > 1 && (
        <fieldset className="shop-sizes">
          <legend>Colour</legend>
          <div className="shop-variants">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => pickColor(c)}
                aria-pressed={color === c}
                aria-label={`${product.name}, ${c}`}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {sizes.length > 1 && (
        <fieldset className="shop-sizes">
          <legend>Size</legend>
          <div className="shop-variants">
            {sizes.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setVariantId(option.id)}
                aria-pressed={variantId === option.id}
                aria-label={`${product.name}, ${color}, size ${option.label}`}
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
