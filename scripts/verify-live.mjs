#!/usr/bin/env node
/**
 * Go-live smoke test for the Printful and Stripe integrations.
 *
 *   npm run verify:live                 # read-only checks + a test Checkout Session (expired immediately)
 *   npm run verify:live -- --discover   # also list Printful store products and their sync variants (see also: npm run sync:printful)
 *   npm run verify:live -- --draft-order  # also create (then delete) a draft Printful order end to end
 *   npm run verify:live -- --site https://terryterrylarryberry.com   # also hit the deployed site
 *
 * Reads PRINTFUL_API_KEY / STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET from the
 * environment or .env.local. Never prints secrets. Exits non-zero on any FAIL.
 */
import { readFileSync, existsSync } from "node:fs";

for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const siteArg = args.includes("--site") ? args[args.indexOf("--site") + 1] : null;

const STORE_ID = "18616880";
const PF = "https://api.printful.com";
const results = [];
const record = (status, name, detail = "") => {
  results.push({ status, name, detail });
  console.log(`${status.padEnd(5)} ${name}${detail ? ` — ${detail}` : ""}`);
};

const { products } = await import("../lib/products.ts");
const money = (n) => `$${Number(n).toFixed(2)}`;

async function pf(path, init = {}) {
  const res = await fetch(`${PF}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
      "X-PF-Store-Id": STORE_ID,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const body = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, body };
}

// ---------------------------------------------------------------- Printful
async function printful() {
  console.log("\n== Printful ==");
  if (!process.env.PRINTFUL_API_KEY) return record("FAIL", "PRINTFUL_API_KEY set", "missing");
  record("PASS", "PRINTFUL_API_KEY set");

  const store = await pf(`/store`);
  if (!store.ok) return record("FAIL", "Printful auth + store access", `${store.status} ${store.body?.error?.message ?? ""}`);
  record("PASS", "Printful auth + store access", `${store.body.result?.name} (id ${store.body.result?.id})`);

  const recipient = {
    name: "Terry Test", address1: "2300 Commercial Dr", city: "Vancouver",
    state_code: "BC", country_code: "CA", zip: "V5N 4B6",
  };

  const sync = await pf(`/store/products?limit=100`);
  const syncProducts = sync.ok ? sync.body.result : [];
  const syncVariants = [];
  for (const sp of syncProducts) {
    const detail = await pf(`/store/products/${sp.id}`);
    for (const sv of detail.body?.result?.sync_variants ?? []) {
      syncVariants.push({ product: sp.name, ...sv });
    }
  }
  if (flag("--discover")) {
    console.log("\nStore sync variants (copy `printfulSyncVariantId` into lib/products.ts):");
    for (const sv of syncVariants) {
      console.log(`  sync_variant_id=${sv.id}  catalog_variant_id=${sv.variant_id}  ${sv.name}  retail=${sv.retail_price}`);
    }
    console.log("");
  }

  for (const product of products) {
    for (const v of product.variants) {
      const label = `${product.name} / ${v.color} / ${v.label}`;
      if (!v.printfulSyncVariantId) {
        record("FAIL", `${label}: linked to Printful`, "no sync variant in lib/printful-map.mjs — run npm run sync:printful");
        continue;
      }
      const sv = syncVariants.find((s) => s.id === v.printfulSyncVariantId);
      if (!sv) { record("FAIL", `${label}: sync variant ${v.printfulSyncVariantId} exists in the store`, "not found"); continue; }
      const cat = await pf(`/products/variant/${sv.variant_id}`);
      if (cat.ok) {
        const cv = cat.body.result.variant;
        record(cv.in_stock === false ? "WARN" : "PASS", `${label}: stock`, cv.in_stock === false ? "OUT OF STOCK" : cv.name);
      }

      const est = await pf(`/orders/estimate-costs`, {
        method: "POST",
        body: JSON.stringify({ recipient, items: [{ sync_variant_id: sv.id, quantity: 1 }] }),
      });
      if (!est.ok) { record("FAIL", `${label}: cost estimate`, `${est.status} ${est.body?.error?.message ?? ""}`); continue; }
      const c = est.body.result.costs;
      const retail = v.priceCents / 100;
      const flatShip = (Number(process.env.SHIPPING_FLAT_CENTS) || 1295) / 100;
      const fees = (retail + flatShip) * 0.029 + 0.3;
      const margin = retail + flatShip - Number(c.total) - fees;
      record(margin > 0 ? "PASS" : "FAIL", `${label}: margin (CA, after ~Stripe fees)`,
        `retail ${money(retail)} + ship ${money(flatShip)} - Printful ${money(c.total)} - fees ${money(fees)} = ${money(margin)}`);
    }
  }

  if (flag("--draft-order")) {
    const v = products.flatMap((p) => p.variants).find((x) => x.printfulSyncVariantId);
    const sv = v && syncVariants.find((s) => s.id === v.printfulSyncVariantId);
    if (!sv) return record("FAIL", "draft order round-trip", "no sync variant to order");
    const created = await pf(`/orders`, {
      method: "POST",
      body: JSON.stringify({
        external_id: `verify-${Date.now()}`,
        recipient,
        items: [{ sync_variant_id: sv.id, quantity: 1 }],
        confirm: false,
      }),
    });
    if (!created.ok) return record("FAIL", "draft order create", `${created.status} ${created.body?.error?.message ?? ""}`);
    record("PASS", "draft order create", `#${created.body.result.id} status=${created.body.result.status}`);
    const del = await pf(`/orders/${created.body.result.id}`, { method: "DELETE" });
    record(del.ok ? "PASS" : "WARN", "draft order delete (cleanup)", del.ok ? "" : `delete it manually in the dashboard: ${del.status}`);
  } else {
    record("INFO", "draft order round-trip skipped", "pass --draft-order to create+delete a real draft");
  }
}

// ------------------------------------------------------------------ Stripe
async function stripeChecks() {
  console.log("\n== Stripe ==");
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return record("FAIL", "STRIPE_SECRET_KEY set", "missing");
  const mode = key.startsWith("sk_live") ? "LIVE" : key.startsWith("sk_test") ? "TEST" : key.startsWith("rk_") ? "RESTRICTED" : "UNKNOWN";
  record("PASS", "STRIPE_SECRET_KEY set", `mode: ${mode}`);
  if (mode === "TEST") record("WARN", "Stripe is in TEST mode", "swap in the sk_live key before launch");

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(key);
  try {
    const acct = await stripe.accounts.retrieve();
    record("PASS", "Stripe auth", `${acct.settings?.dashboard?.display_name ?? acct.id}, country ${acct.country}, default currency ${acct.default_currency}`);
    record(acct.charges_enabled ? "PASS" : "FAIL", "charges_enabled", String(acct.charges_enabled));
  } catch (e) {
    record("FAIL", "Stripe auth", e.message); return;
  }

  try {
    const v = products[0].variants[0];
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ quantity: 1, price_data: { currency: "cad", unit_amount: v.priceCents, product_data: { name: `VERIFY ${products[0].name}` } } }],
      shipping_address_collection: { allowed_countries: ["CA", "US"] },
      metadata: { verify: "true" },
      success_url: "https://example.com/ok",
      cancel_url: "https://example.com/cancel",
    });
    record(session.url ? "PASS" : "FAIL", "create Checkout Session", session.id);
    await stripe.checkout.sessions.expire(session.id);
    record("PASS", "expire test session (no charge)");
  } catch (e) {
    record("FAIL", "create Checkout Session", e.message);
  }

  if (process.env.STRIPE_WEBHOOK_SECRET) record("PASS", "STRIPE_WEBHOOK_SECRET set");
  else record("FAIL", "STRIPE_WEBHOOK_SECRET set", "missing — the webhook can't verify or fulfil orders");
  try {
    const hooks = await stripe.webhookEndpoints.list({ limit: 20 });
    const hook = hooks.data.find((h) => h.url.endsWith("/api/webhook"));
    if (!hook) record("FAIL", "webhook endpoint registered", "no endpoint ending /api/webhook in this Stripe mode");
    else {
      const ok = hook.enabled_events.includes("checkout.session.completed") || hook.enabled_events.includes("*");
      record(ok && hook.status === "enabled" ? "PASS" : "FAIL", "webhook endpoint registered", `${hook.url} [${hook.status}] events: ${hook.enabled_events.join(",")}`);
    }
  } catch (e) {
    record("WARN", "webhook endpoint lookup", `key can't list endpoints: ${e.message}`);
  }
}

// -------------------------------------------------------------- Deployed site
async function site(base) {
  console.log(`\n== Deployed site (${base}) ==`);
  const root = base.replace(/\/$/, "");
  for (const path of ["/shop/archive", "/shop/receipt", "/lifestyle"]) {
    const res = await fetch(root + path).catch((e) => ({ ok: false, status: e.message }));
    record(res.ok ? "PASS" : "FAIL", `GET ${path}`, String(res.status));
  }
  const ab = await fetch(root + "/shop", { redirect: "manual" }).catch(() => null);
  const loc = ab?.headers.get("location") ?? "";
  record(/\/shop\/(archive|receipt)/.test(loc) && ab.headers.get("set-cookie")?.includes("tt_variant") ? "PASS" : "FAIL",
    "A/B split on /shop", `→ ${loc || ab?.status}`);
  const co = await fetch(root + "/api/checkout", {
    method: "POST", headers: { "Content-Type": "application/json", Referer: `${root}/shop/receipt` },
    body: JSON.stringify({ productId: products.flatMap((p) => p.variants).find((x) => x.printfulSyncVariantId)?.id ?? products[0].variants[0].id }),
  }).catch(() => null);
  const data = await co?.json().catch(() => null);
  record(co?.ok && data?.url?.startsWith("https://checkout.stripe.com") ? "PASS" : "FAIL", "POST /api/checkout returns a Stripe URL", String(co?.status));
}

await printful();
await stripeChecks();
if (siteArg) await site(siteArg);

const fails = results.filter((r) => r.status === "FAIL").length;
const warns = results.filter((r) => r.status === "WARN").length;
console.log(`\n${results.filter((r) => r.status === "PASS").length} passed, ${warns} warnings, ${fails} failed`);
process.exit(fails ? 1 : 0);
