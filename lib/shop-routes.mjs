/**
 * The two launch storefronts, run as an A/B test. `variant` is the label used
 * by middleware.ts (cookie + ?v= override) and recorded on every Stripe
 * checkout session so conversion can be compared per store.
 */
export const shopRoutes = [
  {
    variant: "a",
    href: "/shop/archive",
    label: "Street Evidence Archive",
    shortLabel: "Archive",
    description: "Documentary contact sheets and product dossiers.",
  },
  {
    variant: "b",
    href: "/shop/receipt",
    label: "Corner Store Receipt",
    shortLabel: "Receipt",
    description: "One long thermal tape. Every object rung up as a line item.",
  },
];

export const VARIANT_COOKIE = "tt_variant";

/** Map a store variant label ("a" | "b") to its route, or undefined. */
export function routeForVariant(variant) {
  return shopRoutes.find((route) => route.variant === variant);
}

/** Which store a pathname belongs to (e.g. "/shop/receipt" → the Receipt route). */
export function routeForPath(pathname) {
  return shopRoutes.find((route) => pathname === route.href || pathname.startsWith(`${route.href}/`));
}
