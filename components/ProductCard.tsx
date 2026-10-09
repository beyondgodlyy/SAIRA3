import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { productImageUrl } from "@/lib/utils/product-image";
import PriceTag from "./PriceTag";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product }: { product: Product }) {
  const image = productImageUrl(product);
  const secondImage = product.product_images?.[1]?.url;
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-card bg-white shadow-card transition-shadow hover:shadow-soft"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {secondImage && (
          <Image
            src={secondImage}
            alt={product.name}
            fill
            className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        <div className="absolute right-2 top-2 flex flex-col gap-1">
          {product.is_new && (
            <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-white">
              جدید
            </span>
          )}
          {product.is_bestseller && (
            <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-medium text-ink">
              پرفروش
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-ink-muted px-2 py-0.5 text-[10px] font-medium text-white">
              ناموجود
            </span>
          )}
        </div>

        <WishlistButton
          productId={product.id}
          className="absolute left-2 top-2"
        />
      </div>

      <div className="p-3">
        <p className="truncate text-sm font-medium text-ink">{product.name}</p>
        <div className="mt-1">
          <PriceTag price={product.price} compareAtPrice={product.compare_at_price} size="sm" />
        </div>
      </div>
    </Link>
  );
}
