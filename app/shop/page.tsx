import { redirect } from "next/navigation";

// Fallback if middleware doesn't run. On a server host
// middleware.ts intercepts "/shop" first and runs the A/B split.
export default function ShopIndex() {
  redirect("/shop/archive");
}
