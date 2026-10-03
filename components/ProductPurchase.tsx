"use client";

import { useEffect, useRef, useState } from "react";
import { BuyButton, type ShippingQuote } from "@/components/BuyButton";
import { ShipToField, useDestination } from "@/components/ShipTo";
import { formatPrice, type Product } from "@/lib/products";
import { isStaticExport } from "@/lib/site";

export function ProductPurchase({ product }: { product: Product }) {
  const multiple = product.variants.length > 1;
  // With several sizes nothing is pre-selected: a default size would mean
  // people checking out in the wrong one without noticing.
  const [variantIndex, setVariantIndex] = useState<number | null>(multiple ? null : 0);
  const variant = variantIndex === null ? null : product.variants[variantIndex];

  // Two steps so the buy button stays uncluttered: pick a size, then where it ships.
  const [step, setStep] = useState<"pick" | "ship">("pick");
  const shipRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (step === "ship") shipRef.current?.focus();
  }, [step]);

  const destination = useDestination();
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const variantId = variant?.id;
  const { country, state, postalCode } = destination ?? {};
  useEffect(() => {
    setQuote(null);
    setQuoteError(null);
    if (step !== "ship" || !variantId || !country || isStaticExport) return;
    const controller = new AbortController();
    fetch("/api/shipping-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, destination: { country, state, postalCode } }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Couldn't price shipping.");
        setQuote(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setQuoteError(err.message || "Couldn't price shipping.");
      });
    return () => controller.abort();
  }, [step, variantId, country, state, postalCode]);

  if (step === "ship" && variant) {
    return (
      <div className="shop-purchase" ref={shipRef} tabIndex={-1} aria-label={`Shipping for ${product.name}`}>
        <p className="shop-shipto shop-shipto--set">
          <span>Size {variant.label} · {variant.price}</span>
          <button type="button" onClick={() => setStep("pick")}>Back</button>
        </p>
        <ShipToField destination={destination} />
        {quote && (
          <p className="shop-shipto__quote" aria-live="polite">
            Shipping {formatPrice(quote.amountCents)} · est. {quote.estimate} business days
            <strong>Total {formatPrice(quote.totalCents)} CAD</strong>
          </p>
        )}
        {quoteError && <p className="shop-shipto__error" role="alert">{quoteError}</p>}
        <BuyButton product={product} variant={variant} destination={destination} quote={quote} />
      </div>
    );
  }

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

      {product.free ? (
        <BuyButton product={product} variant={variant} destination={destination} quote={quote} />
      ) : (
        <div>
          <button type="button" onClick={() => setStep("ship")} disabled={!variant}>
            {variant ? `Buy — ${variant.price}` : "Select a size"}
          </button>
        </div>
      )}
    </div>
  );
}
