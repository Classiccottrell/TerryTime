import assert from "node:assert/strict";
import test from "node:test";

import { routeForPath, routeForVariant, shopRoutes } from "./shop-routes.mjs";

test("exactly two launch storefronts, Archive (A) and Receipt (B)", () => {
  assert.deepEqual(
    shopRoutes.map(({ variant, href }) => [variant, href]),
    [["a", "/shop/archive"], ["b", "/shop/receipt"]],
  );
});

test("variant and path lookups agree", () => {
  assert.equal(routeForVariant("b")?.href, "/shop/receipt");
  assert.equal(routeForVariant("z"), undefined);
  assert.equal(routeForPath("/shop/archive")?.variant, "a");
  assert.equal(routeForPath("/shop/receipt/")?.variant, "b");
  assert.equal(routeForPath("/lifestyle"), undefined);
  assert.equal(routeForPath("/shop/archivist"), undefined);
});
