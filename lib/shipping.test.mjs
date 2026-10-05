import assert from "node:assert/strict";
import test from "node:test";

const { parseDestination } = await import("./regions.ts");
const { quoteShipping, quoteCheckoutShipping, fallbackShippingCents, countryUpchargeCents } = await import("./shipping.ts");

const ca = { country: "CA", state: "BC", postalCode: "V5N 4B6" };
const us = { country: "US", state: "NY", postalCode: "10001" };

test("parseDestination normalises and validates Canada and US addresses", () => {
  assert.deepEqual(parseDestination({ country: "CA", state: "bc", postalCode: " v5n 4b6 " }), { ok: true, destination: ca });
  assert.equal(parseDestination({ country: "US", state: "NY", postalCode: "10001-1234" }).ok, true);
  assert.equal(parseDestination({ country: "CA", state: "BC", postalCode: "10001" }).ok, false);
  assert.equal(parseDestination({ country: "US", state: "BC", postalCode: "10001" }).ok, false);
  assert.equal(parseDestination({ country: "MX", state: "X", postalCode: "1" }).ok, false);
  assert.equal(parseDestination(undefined).ok, false);
});

test("without a Printful key or catalog id the flat fallback is used", async () => {
  delete process.env.PRINTFUL_API_KEY;
  const q = await quoteShipping({ printfulVariantId: 123, quantity: 1, destination: ca });
  assert.equal(q.source, "fallback");
  assert.equal(q.amountCents, fallbackShippingCents("CA") + countryUpchargeCents("CA"));
  assert.ok(fallbackShippingCents("US") > fallbackShippingCents("CA"));
});

test("live quote: prefers STANDARD, adds buffer + country upcharge, builds the buyer estimate", async () => {
  process.env.PRINTFUL_API_KEY = "test";
  process.env.SHIPPING_BUFFER_CENTS = "50";
  const realFetch = globalThis.fetch;
  let sent;
  globalThis.fetch = async (_url, init) => {
    sent = JSON.parse(init.body);
    return new Response(JSON.stringify({ result: [
      { id: "EXPRESS", rate: "30.00", currency: "CAD", minDeliveryDays: 1, maxDeliveryDays: 2 },
      { id: "STANDARD", rate: "8.95", currency: "CAD", minDeliveryDays: 3, maxDeliveryDays: 6 },
    ] }), { status: 200 });
  };
  try {
    const q = await quoteShipping({ printfulVariantId: 5500, quantity: 2, destination: us });
    assert.equal(q.source, "printful");
    assert.equal(q.amountCents, 895 + 50 + countryUpchargeCents("US"));
    assert.equal(q.estimate, "5–13");
    assert.deepEqual(sent.items, [{ variant_id: 5500, quantity: 2 }]);
    assert.equal(sent.recipient.state_code, "NY");
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.SHIPPING_BUFFER_CENTS;
  }
});

test("a Printful failure falls back instead of breaking checkout", async () => {
  process.env.PRINTFUL_API_KEY = "test";
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("{}", { status: 500 });
  const realError = console.error;
  console.error = () => {};
  try {
    const q = await quoteShipping({ printfulVariantId: 9999, quantity: 1, destination: ca });
    assert.equal(q.source, "fallback");
  } finally {
    globalThis.fetch = realFetch;
    console.error = realError;
    delete process.env.PRINTFUL_API_KEY;
  }
});

test("checkout shipping is the highest per-country quote (Stripe's page can't re-price by address)", async () => {
  process.env.PRINTFUL_API_KEY = "test";
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (_url, init) => {
    const country = JSON.parse(init.body).recipient.country_code;
    const rate = country === "CA" ? "11.29" : "13.99";
    return new Response(JSON.stringify({ result: [{ id: "STANDARD", rate, currency: "CAD" }] }), { status: 200 });
  };
  try {
    const q = await quoteCheckoutShipping(7777, 1);
    assert.equal(q.amountCents, 1399 + countryUpchargeCents("US"));
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.PRINTFUL_API_KEY;
  }
});
