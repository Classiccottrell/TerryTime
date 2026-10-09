import Image from "next/image";
import { colorsOf, type Product } from "@/lib/catalog-core";

/**
 * One photo per colour, stacked; only the default colour shows until the buyer picks
 * another in ProductPurchase (which flips `hidden` within the same [data-product] card).
 */
export function ProductImages({ product, sizes, className }: { product: Product; sizes: string; className?: string }) {
  return colorsOf(product).map((color, i) => {
    const variant = product.variants.find((v) => v.color === color)!;
    return (
      <Image
        key={color}
        data-color-img={color}
        hidden={i > 0}
        src={variant.image}
        alt={`${product.name}${color ? `, ${color}` : ""}`}
        fill
        sizes={sizes}
        className={className}
      />
    );
  });
}
