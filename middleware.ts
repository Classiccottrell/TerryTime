import { NextResponse, type NextRequest } from "next/server";
import { VARIANT_COOKIE, routeForVariant } from "@/lib/shop-routes.mjs";

/**
 * A/B split between the two launch storefronts. `/` and `/shop` send each
 * visitor to Archive (a) or Receipt (b), 50/50, and pin them with a cookie so
 * they keep seeing the same store. `?v=a|b` forces a variant (for previews and
 * paid-social links that must land on a specific store).
 *
 * `/` + `/shop` pages are only a fallback redirect to Archive if middleware doesn't run.
 */
export function middleware(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const forced = routeForVariant(searchParams.get("v") ?? "");
  const stored = routeForVariant(req.cookies.get(VARIANT_COOKIE)?.value ?? "");
  const route = forced ?? stored ?? routeForVariant(Math.random() < 0.5 ? "a" : "b")!;

  const url = req.nextUrl.clone();
  url.pathname = route.href;
  url.searchParams.delete("v");

  const res = NextResponse.redirect(url, 307);
  if (route.variant !== stored?.variant) {
    res.cookies.set(VARIANT_COOKIE, route.variant, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }
  return res;
}

export const config = { matcher: ["/", "/shop"] };
