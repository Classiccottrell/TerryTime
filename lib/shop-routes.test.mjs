import assert from "node:assert/strict";
import test from "node:test";

const { shopRoutes = [] } = await import("./shop-routes.mjs").catch(() => ({}));

test("shop navigation exposes each approved design once", () => {
  assert.deepEqual(
    shopRoutes.map(({ href }) => href),
    ["/shop/city", "/shop/archive", "/shop/shrine", "/shop/grid", "/shop/stencil"],
  );
});
