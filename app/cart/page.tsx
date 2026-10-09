"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import CartItem from "@/components/CartItem";
import EmptyState from "@/components/EmptyState";
import { formatPrice } from "@/lib/utils/format";

export default function CartPage() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="سبد خریدت منتظر یک انتخاب زیباست."
          ctaLabel="مشاهده محصولات"
          ctaHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="section-title mb-8">سبد خرید</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6 rounded-card bg-white p-5 shadow-card">
          {items.map((item) => (
            <CartItem key={item.product_id} item={item} />
          ))}
        </div>

        <div className="h-fit rounded-card bg-white p-5 shadow-card">
          <h2 className="mb-4 font-display text-lg font-semibold">خلاصه سفارش</h2>
          <div className="flex items-center justify-between text-sm text-ink-muted">
            <span>جمع سبد خرید</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            هزینه ارسال در مرحله تکمیل خرید محاسبه می‌شود.
          </p>
          <div className="my-4 h-px bg-ink/10" />
          <Link href="/checkout" className="btn-primary w-full">
            تکمیل خرید
          </Link>
          <Link href="/shop" className="btn-secondary mt-2 w-full">
            ادامه خرید
          </Link>
        </div>
      </div>
    </div>
  );
}
