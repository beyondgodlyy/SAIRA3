import type { Product } from "@/lib/types";

/**
 * این تابع فقط منطق خالص (Pure) دارد و هیچ وابستگی سروری ندارد،
 * بنابراین می‌تواند هم در Server Component و هم در Client Component
 * استفاده شود. عمداً از lib/data.ts جدا نگه داشته شده چون آن فایل
 * از next/headers استفاده می‌کند و نباید در باندل کلاینت قرار بگیرد.
 */
export function productImageUrl(product: Product): string {
  return product.product_images?.[0]?.url ?? "/placeholders/generic.svg";
}
