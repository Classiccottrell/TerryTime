import type Stripe from "stripe";

/**
 * The shop catalog lives in Stripe. Each TerryTime product is a Stripe Product
 * tagged `metadata.shop = "terrytime"`; each size is an active one-time CAD Price
 * whose nickname (or `metadata.size`) is the size label.
 *
 * A price's description (nickname) is "Colour / Size" (e.g. "White / M"), or just the size
 * for the product's default colour (metadata.color).
 *
 * Product metadata (survives price edits in the dashboard, which create new Price objects):
 *   shop=terrytime · slug · order · color (default colour) · voice · accent
 *   fulfillment=printful|manual · shipping_cents (optional flat shipping override)
 *   printful_<colour>_<size>="<sync variant id>:<catalog variant id>"  e.g. printful_white_m
 *     (printful_<size> is still read for the default colour)
 *   image_<colour>=URL  photo for a non-default colour (default colour uses the product image)
 *
 * Self-contained (type-only imports) so node --test and scripts/ can import it.
 */

export const SHOP_TAG = "terrytime";
export const CURRENCY = "cad";

export type Variant = {
  /** The Stripe Price id — what BuyButton sends and checkout looks up. */
  id: string;
  label: string;
  size: string;
  color: string;
  price: string;
  priceCents: number;
  image: string;
  /** Printful catalog variant id (shipping rates, stock). */
  printfulVariantId?: number;
  /** Printful store sync variant id (carries the artwork). Required to sell a printful item. */
  printfulSyncVariantId?: number;
};

export type Product = {
  id: string; // slug
  stripeProductId: string;
  name: string;
  voice: string;
  blurb: string;
  accent: string;
  fulfillment: "printful" | "manual";
  /** Flat shipping override in cents; otherwise shipping is quoted from Printful (or the flat fallback). */
  shippingCents?: number;
  variants: Variant[];
};

const SIZE_ORDER = ["xs", "s", "m", "l", "xl", "2xl", "3xl", "one-size"];

export const sizeKey = (size: string) => size.trim().toLowerCase().replace(/\s+/g, "-");

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Our own product photos are stored in Stripe as absolute URLs; serve them as local paths. */
export function imagePath(url: string | undefined): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    return /(^|\.)terryterrylarryberry\.com$/.test(u.hostname) ? u.pathname : url;
  } catch {
    return url;
  }
}

function isDefaultColor(product: Stripe.Product, color: string) {
  return sizeKey(color) === sizeKey(product.metadata.color ?? "");
}

function printfulIds(product: Stripe.Product, color: string, size: string) {
  const m = product.metadata;
  const raw = m[`printful_${sizeKey(color)}_${sizeKey(size)}`] ?? (isDefaultColor(product, color) ? m[`printful_${sizeKey(size)}`] : undefined);
  const [sync, catalog] = (raw ?? "").split(":").map(Number);
  return { sync: sync || undefined, catalog: catalog || undefined };
}

/** "White / M" → { color: "White", size: "M" }; "M" → the product's default colour. */
function colorAndSize(product: Stripe.Product, price: Stripe.Price) {
  const raw = price.metadata?.size ? `${price.metadata.color ? `${price.metadata.color} / ` : ""}${price.metadata.size}` : price.nickname ?? "";
  const [a, b] = raw.split("/").map((x) => x.trim());
  return b ? { color: a, size: b } : { color: product.metadata.color ?? "", size: a ?? "" };
}

export function isOurs(product: Stripe.Product | string | Stripe.DeletedProduct | null): product is Stripe.Product {
  return typeof product === "object" && product !== null && !("deleted" in product && product.deleted) &&
    (product as Stripe.Product).metadata?.shop === SHOP_TAG;
}

function toVariant(product: Stripe.Product, price: Stripe.Price): Variant | null {
  const { color, size } = colorAndSize(product, price);
  if (!size || price.unit_amount == null) return null;
  const ids = printfulIds(product, color, size);
  const photo = isDefaultColor(product, color) ? undefined : product.metadata[`image_${sizeKey(color)}`];
  return {
    id: price.id,
    label: size,
    size,
    color,
    price: formatPrice(price.unit_amount),
    priceCents: price.unit_amount,
    image: imagePath(photo || product.images[0]),
    printfulVariantId: ids.catalog,
    printfulSyncVariantId: ids.sync,
  };
}

function toProduct(product: Stripe.Product, prices: Stripe.Price[]): Product {
  const variants = prices
    .filter((p) => p.active && p.type === "one_time" && p.currency === CURRENCY &&
      (typeof p.product === "string" ? p.product : p.product.id) === product.id)
    .map((p) => toVariant(product, p))
    .filter((v): v is Variant => v !== null)
    .sort((a, b) =>
      Number(!isDefaultColor(product, a.color)) - Number(!isDefaultColor(product, b.color)) ||
      a.color.localeCompare(b.color) ||
      SIZE_ORDER.indexOf(sizeKey(a.size)) - SIZE_ORDER.indexOf(sizeKey(b.size)) ||
      a.priceCents - b.priceCents);
  const shipping = Number(product.metadata.shipping_cents);
  return {
    id: product.metadata.slug || product.id,
    stripeProductId: product.id,
    name: product.name,
    voice: product.metadata.voice ?? "",
    blurb: product.description ?? "",
    accent: product.metadata.accent || "#1233c7",
    fulfillment: product.metadata.fulfillment === "manual" ? "manual" : "printful",
    shippingCents: Number.isInteger(shipping) && shipping >= 0 && product.metadata.shipping_cents !== "" ? shipping : undefined,
    variants,
  };
}

/** Stripe products + prices → the shop catalog (ours, active, with at least one sellable size), in `order`. */
export function toCatalog(products: Stripe.Product[], prices: Stripe.Price[]): Product[] {
  return products
    .filter((p) => p.active && isOurs(p))
    .sort((a, b) => Number(a.metadata.order ?? 999) - Number(b.metadata.order ?? 999))
    .map((p) => toProduct(p, prices))
    .filter((p) => p.variants.length > 0);
}

/** A printful item needs its sync variant (artwork) to be fulfilled; manual items always can. */
export function isFulfillable(product: Product, variant: Variant): boolean {
  return product.fulfillment === "manual" || Boolean(variant.printfulSyncVariantId);
}

/** Colours a product comes in, default first. */
export function colorsOf(product: Product): string[] {
  return [...new Set(product.variants.map((v) => v.color))];
}

/** Sizes a product comes in (any colour), in size order. */
export function sizesOf(product: Product): string[] {
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  return sizes.sort((a, b) => SIZE_ORDER.indexOf(sizeKey(a)) - SIZE_ORDER.indexOf(sizeKey(b)));
}

export function startingPriceCents(product: Product): number {
  return Math.min(...product.variants.map((v) => v.priceCents));
}

/** Product + size for a Stripe Price (expanded product), active or not — e.g. a paid order's archived price. */
export function describePrice(price: Stripe.Price): { product: Product; variant: Variant } | null {
  if (!isOurs(price.product as Stripe.Product)) return null;
  if (price.type !== "one_time" || price.currency !== CURRENCY || !price.unit_amount || price.unit_amount <= 0) return null;
  const product = toProduct(price.product as Stripe.Product, [{ ...price, active: true }]);
  return product.variants[0] ? { product, variant: product.variants[0] } : null;
}

/**
 * Checkout's trust boundary: the client sends only a price id. Accept it only if it's an
 * active one-time CAD price on an active TerryTime product. Price comes from Stripe, never the client.
 */
export function checkPrice(price: Stripe.Price):
  | { ok: true; product: Product; variant: Variant }
  | { ok: false; status: number; error: string } {
  const found = describePrice(price);
  if (!found) return { ok: false, status: 404, error: "Unknown product." };
  if (!price.active || !(price.product as Stripe.Product).active) {
    return { ok: false, status: 409, error: "Prices changed since this page loaded. Refresh and try again." };
  }
  return { ok: true, ...found };
}
