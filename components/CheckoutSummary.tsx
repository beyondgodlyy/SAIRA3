"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice, toPersianDigits } from "@/lib/utils/format";

export default function CheckoutSummary({
  shippingCost,
  freeShippingThreshold,
}: {
  shippingCost: number;
  freeShippingThreshold: number | null;
}) {
  const { items, subtotal } = useCart();
  const freeShipping =
    freeShippingThreshold != null && subtotal >= freeShippingThreshold;
  const finalShipping = freeShipping ? 0 : shippingCost;

  return (
    <div className="h-fit rounded-card bg-white p-5 shadow-card">
      <h2 className="mb-4 font-display text-lg font-semibold">سبد خرید</h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.product_id} className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-ivory">
              <Image
                src={item.image ?? "/placeholders/generic.svg"}
                alt={item.name}
                fill
                className="object-cover"
              />
              <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-white">
                {toPersianDigits(item.quantity)}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-ink">{item.name}</p>
              <p className="text-xs text-ink-muted">{formatPrice(item.price)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="my-4 h-px bg-ink/10" />

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between text-ink-muted">
          <span>جمع سبد خرید</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-ink-muted">
          <span>هزینه ارسال</span>
          <span>{finalShipping === 0 ? "رایگان" : formatPrice(finalShipping)}</span>
        </div>
        <div className="my-1 h-px bg-ink/10" />
        <div className="flex items-center justify-between text-base font-semibold text-ink">
          <span>مبلغ نهایی</span>
          <span>{formatPrice(subtotal + finalShipping)}</span>
        </div>
      </div>
    </div>
  );
}
