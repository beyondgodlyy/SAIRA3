"use client";

import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { Category } from "@/lib/types";

const SORT_OPTIONS = [
  { value: "newest", label: "جدیدترین" },
  { value: "bestseller", label: "پرفروش‌ترین" },
  { value: "price_asc", label: "ارزان‌ترین" },
  { value: "price_desc", label: "گران‌ترین" },
];

export default function FilterSidebar({
  categories,
  activeCategory,
  activeSort,
}: {
  categories: Category[];
  activeCategory: string;
  activeSort: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "newest") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">دسته‌بندی</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => updateParam("category", "all")}
            className={clsx(
              "text-right text-sm",
              activeCategory === "all" ? "font-semibold text-brand" : "text-ink-muted"
            )}
          >
            همه محصولات
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam("category", cat.slug)}
              className={clsx(
                "text-right text-sm",
                activeCategory === cat.slug ? "font-semibold text-brand" : "text-ink-muted"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">مرتب‌سازی</h3>
        <div className="flex flex-col gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("sort", opt.value)}
              className={clsx(
                "text-right text-sm",
                activeSort === opt.value ? "font-semibold text-brand" : "text-ink-muted"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
