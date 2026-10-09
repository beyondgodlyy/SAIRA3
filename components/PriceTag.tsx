import { formatPrice, discountPercent } from "@/lib/utils/format";

export default function PriceTag({
  price,
  compareAtPrice,
  size = "md",
}: {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
}) {
  const percent = discountPercent(price, compareAtPrice ?? null);
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`font-semibold text-ink ${sizes[size]}`}>
        {formatPrice(price)}
      </span>
      {percent && (
        <>
          <span className="text-xs text-ink-muted line-through">
            {formatPrice(compareAtPrice!)}
          </span>
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">
            ٪{percent.toLocaleString("fa-IR")} تخفیف
          </span>
        </>
      )}
    </div>
  );
}
