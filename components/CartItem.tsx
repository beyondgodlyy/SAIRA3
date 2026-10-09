"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, toPersianDigits } from "@/lib/utils/format";
import type { CartLine } from "@/lib/types";

export default function CartItem({ item }: { item: CartLine }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3">
      <Link
        href={`/product/${item.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-ivory"
      >
        <Image
          src={item.image ?? "/placeholders/generic.svg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${item.slug}`} className="text-sm font-medium text-ink">
            {item.name}
          </Link>
          <button
            onClick={() => removeItem(item.product_id)}
            aria-label="حذف از سبد خرید"
            className="text-ink-muted hover:text-brand"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">
            {formatPrice(item.price * item.quantity)}
          </span>
          <div className="flex items-center gap-2 rounded-full border border-ink/15 px-2 py-1">
            <button
              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
              aria-label="کاهش تعداد"
            >
              <Minus size={14} />
            </button>
            <span className="w-4 text-center text-xs">
              {toPersianDigits(item.quantity)}
            </span>
            <button
              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
              aria-label="افزایش تعداد"
              disabled={item.quantity >= item.stock}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
