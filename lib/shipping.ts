import type { Destination } from "./regions";

/**
 * Shipping quotes. The buyer gives us where it's going (country, province/state,
 * postal code) *before* checkout; we ask Printful what fulfilling that exact
 * order costs to that address and charge that, so shipping neither loses money
 * nor overcharges. If Printful can't be reached (or the variant isn't linked),
 * we fall back to a per-country flat rate so checkout never breaks.
 *
 * Self-contained on purpose (no local imports) so scripts/verify-live.mjs can
 * import it directly.
 */

const PRINTFUL_API = process.env.PRINTFUL_API_BASE ?? "https://api.printful.com";
const STORE_ID = "18616880";

export type ShippingQuote = {
  amountCents: number;
  /** Where the number came from: Printful's live rate, or the flat fallback. */
  source: "printful" | "fallback";
  /** Business days in transit, if known. */
  minDays?: number;
  maxDays?: number;
  /** Buyer-facing estimate (production + transit), e.g. "5–12". */
  estimate: string;
};

/** Printful's typical embroidery production time, added to transit for the buyer estimate. */
const PRODUCTION_DAYS = { min: 2, max: 7 };

function estimateFor(minDays?: number, maxDays?: number): string {
  if (!minDays || !maxDays) return "7–15";
  return `${minDays + PRODUCTION_DAYS.min}–${maxDays + PRODUCTION_DAYS.max}`;
}

function envCents(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isInteger(n) && n >= 0 ? n : fallback;
}

/** Flat rates (cents, CAD) used only when Printful rates are unavailable. Placeholders until reviewed. */
export function fallbackShippingCents(country: Destination["country"]): number {
  return country === "CA" ? envCents("SHIPPING_FALLBACK_CA_CENTS", 1195) : envCents("SHIPPING_FALLBACK_US_CENTS", 1595);
}

/**
 * Per-country upcharge (cents, CAD) folded into the shipping line. Covers the sales tax
 * Printful bills us (15% HST in NL, US state tax) so the thinnest destinations stay positive.
 * Sized from npm run verify:live margins, Oct 2026.
 */
export function countryUpchargeCents(country: Destination["country"]): number {
  return country === "CA" ? envCents("SHIPPING_UPCHARGE_CA_CENTS", 500) : envCents("SHIPPING_UPCHARGE_US_CENTS", 200);
}

const cache = new Map<string, { at: number; quote: ShippingQuote }>();
const CACHE_MS = 10 * 60 * 1000;

export async function quoteShipping(params: {
  /** Printful catalog variant id (from lib/printful-map). Without it we can only use the fallback. */
  printfulVariantId?: number;
  quantity: number;
  destination: Destination;
}): Promise<ShippingQuote> {
  const { printfulVariantId, quantity, destination } = params;
  const buffer = envCents("SHIPPING_BUFFER_CENTS", 0) + countryUpchargeCents(destination.country);
  const fallback: ShippingQuote = {
    amountCents: fallbackShippingCents(destination.country) + buffer,
    source: "fallback",
    estimate: estimateFor(),
  };

  const key = process.env.PRINTFUL_API_KEY;
  if (!key || !printfulVariantId) return fallback;

  const cacheKey = `${printfulVariantId}|${quantity}|${destination.country}|${destination.state}|${destination.postalCode}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.quote;

  try {
    const res = await fetch(`${PRINTFUL_API}/shipping/rates`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "X-PF-Store-Id": STORE_ID, "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: {
          address1: "1 Main St",
          city: "-",
          country_code: destination.country,
          state_code: destination.state,
          zip: destination.postalCode,
        },
        items: [{ variant_id: printfulVariantId, quantity }],
        currency: "CAD",
      }),
      signal: AbortSignal.timeout(6000),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok || !Array.isArray(body?.result)) {
      throw new Error(`Printful shipping rates ${res.status}: ${body?.error?.message ?? "unexpected response"}`);
    }
    const rates = (body.result as { id: string; rate: string; currency: string; minDeliveryDays?: number; maxDeliveryDays?: number }[])
      .filter((r) => r.currency === "CAD" && Number.isFinite(Number(r.rate)));
    if (!rates.length) throw new Error("Printful returned no CAD shipping rates");
    // Standard shipping if offered, else the cheapest option.
    const pick = rates.find((r) => r.id === "STANDARD") ?? rates.sort((a, b) => Number(a.rate) - Number(b.rate))[0];
    const quote: ShippingQuote = {
      amountCents: Math.round(Number(pick.rate) * 100) + buffer,
      source: "printful",
      minDays: pick.minDeliveryDays,
      maxDays: pick.maxDeliveryDays,
      estimate: estimateFor(pick.minDeliveryDays, pick.maxDeliveryDays),
    };
    cache.set(cacheKey, { at: Date.now(), quote });
    return quote;
  } catch (err) {
    console.error("[shipping] Falling back to flat rate:", err);
    return fallback;
  }
}
