import { redirect } from "next/navigation";

// Fallback for hosts without middleware (static export). On a server host
// middleware.ts intercepts "/shop" first and runs the A/B split.
export default function ShopIndex() {
  redirect("/shop/archive");
}
