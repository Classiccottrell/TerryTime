const PRINTFUL_STORE_ID = "18616880";
const PRINTFUL_API = "https://api.printful.com";

export type PrintfulRecipient = {
  name: string;
  email?: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  country_code: string;
  zip: string;
};

/**
 * Creates a real Printful order for one line item. Unconfirmed (draft) unless
 * PRINTFUL_AUTO_CONFIRM=true — a draft shows up in the Printful dashboard for
 * review before it actually ships. Requires PRINTFUL_API_KEY (an all-access/orders-scoped
 * token) in the environment; returns null if it isn't set so the webhook
 * can degrade to logging instead of crashing.
 */
export async function createPrintfulOrder(params: {
  externalId: string;
  /** Printful *store sync* variant id (carries the design files). */
  printfulSyncVariantId?: number;
  /** Catalog variant id: only valid if the caller also supplies print files. */
  printfulVariantId: number;
  quantity: number;
  recipient: PrintfulRecipient;
}) {
  const key = process.env.PRINTFUL_API_KEY;
  if (!key) return null;

  const res = await fetch(`${PRINTFUL_API}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "X-PF-Store-Id": PRINTFUL_STORE_ID,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_id: params.externalId,
      recipient: params.recipient,
      items: [
        {
          ...(params.printfulSyncVariantId
            ? { sync_variant_id: params.printfulSyncVariantId }
            : { variant_id: params.printfulVariantId }),
          quantity: params.quantity,
        },
      ],
      // Draft by default: nothing ships until approved in the Printful dashboard.
      // Set PRINTFUL_AUTO_CONFIRM=true at launch to fulfil (and bill) automatically.
      confirm: process.env.PRINTFUL_AUTO_CONFIRM === "true",
    }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      `Printful order creation failed (${res.status}): ${body?.error?.message ?? "unknown error"}`
    );
  }
  return body?.result ?? null;
}
