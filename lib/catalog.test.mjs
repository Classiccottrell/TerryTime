import assert from "node:assert/strict";
import test from "node:test";

const { toCatalog, checkPrice } = await import("./catalog-core.ts");

const product = (over = {}) => ({
  id: "prod_1", object: "product", active: true, name: "Unisex Hoodie", description: "Heavyweight.",
  images: ["https://www.terryterrylarryberry.com/img/products/hoodie.png"],
  metadata: { shop: "terrytime", slug: "unisex-hoodie", order: "2", color: "Black", fulfillment: "printful", printful_m: "555:5531" },
  ...over,
});
const price = (over = {}) => ({
  id: "price_m", object: "price", active: true, type: "one_time", currency: "cad", unit_amount: 4758,
  nickname: "M", metadata: {}, product: "prod_1", ...over,
});

test("toCatalog maps tagged Stripe products and size-ordered prices, Printful ids from product metadata", () => {
  const [p] = toCatalog(
    [product(), product({ id: "prod_x", metadata: {} })],
    [price({ id: "price_xl", nickname: "XL" }), price(), price({ id: "price_usd", currency: "usd" })],
  );
  assert.equal(p.id, "unisex-hoodie");
  assert.deepEqual(p.variants.map((v) => v.label), ["M", "XL"]);
  assert.equal(p.variants[0].image, "/img/products/hoodie.png");
  assert.equal(p.variants[0].printfulSyncVariantId, 555);
  assert.equal(p.variants[0].printfulVariantId, 5531);
  assert.equal(p.variants[1].printfulSyncVariantId, undefined); // XL not linked → unsellable
});

test("checkPrice: the client's price id is only accepted for an active one-time CAD price on our product", () => {
  assert.equal(checkPrice(price({ product: product() })).ok, true);
  assert.equal(checkPrice(price({ product: product({ metadata: {} }) })).ok, false); // another shop's product
  assert.equal(checkPrice(price({ product: product(), active: false })).ok, false);
  assert.equal(checkPrice(price({ product: product(), currency: "usd" })).ok, false);
  assert.equal(checkPrice(price({ product: product(), type: "recurring" })).ok, false);
  assert.equal(checkPrice(price({ product: product(), unit_amount: 0 })).ok, false);
  assert.equal(checkPrice(price({ product: product({ active: false }) })).ok, false);
});

test("colours: 'White / M' prices get the white photo and printful_white_m; legacy printful_m is default-colour only", async () => {
  const { colorsOf } = await import("./catalog-core.ts");
  const [p] = toCatalog(
    [product({ metadata: { ...product().metadata, printful_white_m: "777:9531", image_white: "https://files.cdn.printful.com/w.png" } })],
    [price({ id: "price_wm", nickname: "White / M" }), price(), price({ id: "price_wl", nickname: "White / L" })],
  );
  assert.deepEqual(colorsOf(p), ["Black", "White"]);
  const [bm, wm, wl] = p.variants;
  assert.equal(bm.color, "Black");
  assert.equal(bm.printfulSyncVariantId, 555);
  assert.equal(wm.color, "White");
  assert.equal(wm.size, "M");
  assert.equal(wm.image, "https://files.cdn.printful.com/w.png");
  assert.equal(wm.printfulSyncVariantId, 777);
  assert.equal(wl.printfulSyncVariantId, undefined); // not linked; the black printful_l must not leak into white
});
