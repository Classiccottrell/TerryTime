import type { Metadata } from "next";
import Link from "next/link";
import { ErrorScreen } from "@/components/ErrorScreen";
import { ShopNavigation } from "@/components/ShopNavigation";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="shop-design shop-error">
      <ShopNavigation />
      <ErrorScreen
        code="404"
        title={<>Nothing on<br />this wall.</>}
        message="This page got painted over, or it never went up. Terry's still around."
      >
        <Link href="/shop" className="shop-text-link">Back to the shop <span>↗</span></Link>
        <Link href="/lifestyle" className="shop-text-link">After hours <span>↗</span></Link>
      </ErrorScreen>
    </main>
  );
}
