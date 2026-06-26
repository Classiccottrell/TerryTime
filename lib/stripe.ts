import Stripe from "stripe";

/**
 * Lazily-instantiated Stripe client. Returns null when STRIPE_SECRET_KEY isn't
 * configured so the app builds and runs without secrets — checkout routes then
 * respond with a clear "not configured" error instead of crashing.
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) {
    cached = new Stripe(key, {
      appInfo: { name: "Terry Terry Larry Berry", version: "2.0.0" },
    });
  }
  return cached;
}

export const CURRENCY = "cad";
