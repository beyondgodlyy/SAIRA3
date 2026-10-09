"use client";

import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils/format";
import CartItem from "./CartItem";
import EmptyState from "./EmptyState";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, subtotal } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-start" dir="rtl">
      <div className="flex-1 bg-black/30" onClick={closeDrawer} />
      <div className="fade-in flex h-full w-full max-w-sm flex-col bg-ivory-soft shadow-soft">
        <div className="flex items-center justify-between border-b border-ink/10 p-4">
          <h2 className="font-display text-lg font-semibold">سبد خرید</h2>
          <button onClick={closeDrawer} aria-label="بستن سبد خرید">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <EmptyState
              title="سبد خریدت منتظر یک انتخاب زیباست."
              ctaLabel="مشاهده محصولات"
              ctaHref="/shop"
            />
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <CartItem key={item.product_id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/10 p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-ink-muted">جمع سبد خرید</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="btn-secondary w-full"
            >
              مشاهده سبد خرید
            </Link>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="btn-primary mt-2 w-full"
            >
              <ShoppingBag size={16} />
              تکمیل خرید
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
