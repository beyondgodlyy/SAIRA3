"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import clsx from "clsx";

export default function WishlistButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { isWished, toggle } = useWishlist();
  const wished = isWished(productId);

  return (
    <button
      type="button"
      aria-label={wished ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={clsx(
        "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-card transition-transform hover:scale-105",
        className
      )}
    >
      <Heart
        size={16}
        className={wished ? "fill-brand text-brand" : "text-ink-muted"}
      />
    </button>
  );
}
