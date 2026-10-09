"use client";

import { useState } from "react";
import { Minus, Plus, ShieldCheck, Truck, PackageSearch } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import PriceTag from "./PriceTag";
import WishlistButton from "./WishlistButton";
import { toPersianDigits } from "@/lib/utils/format";
import { productImageUrl } from "@/lib/utils/product-image";

export default function ProductInfo({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem(
      {
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: productImageUrl(product),
        stock: product.stock,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div>
      {product.category && (
        <p className="text-xs text-ink-muted">{product.category.name}</p>
      )}
      <h1 className="font-display mt-1 text-2xl font-bold text-ink">{product.name}</h1>

      <div className="mt-3">
        <PriceTag price={product.price} compareAtPrice={product.compare_at_price} size="lg" />
      </div>

      {product.description && (
        <p className="mt-4 text-sm leading-7 text-ink-muted">{product.description}</p>
      )}

      {product.color && (
        <p className="mt-3 text-sm text-ink">
          <span className="text-ink-muted">رنگ: </span>
          {product.color}
        </p>
      )}

      <p className="mt-2 text-sm">
        {outOfStock ? (
          <span className="font-medium text-brand">ناموجود</span>
        ) : product.stock <= 3 ? (
          <span className="text-brand">{`فقط ${toPersianDigits(product.stock)} عدد باقی مانده`}</span>
        ) : (
          <span className="text-ink-muted">موجود در انبار</span>
        )}
      </p>

      {!outOfStock && (
        <div className="mt-5 flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-full border border-ink/15 px-3 py-2">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="کاهش تعداد">
              <Minus size={16} />
            </button>
            <span className="w-5 text-center text-sm">{toPersianDigits(quantity)}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              aria-label="افزایش تعداد"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="btn-primary flex-1"
        >
          {outOfStock ? "ناموجود" : justAdded ? "به سبد اضافه شد ✓" : "افزودن به سبد خرید"}
        </button>
        <WishlistButton productId={product.id} className="static h-11 w-11 shrink-0" />
      </div>

      <div className="mt-8 grid gap-3 border-t border-ink/10 pt-6 text-sm text-ink-muted">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-brand" />
          پرداخت امن
        </div>
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-brand" />
          ارسال سفارش به سراسر کشور
        </div>
        <div className="flex items-center gap-2">
          <PackageSearch size={16} className="text-brand" />
          امکان پیگیری سفارش
        </div>
      </div>
    </div>
  );
}
