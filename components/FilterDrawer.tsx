"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/lib/types";
import FilterSidebar from "./FilterSidebar";

export default function FilterDrawer({
  categories,
  activeCategory,
  activeSort,
}: {
  categories: Category[];
  activeCategory: string;
  activeSort: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="btn-secondary mb-4 w-full"
      >
        <SlidersHorizontal size={16} />
        فیلتر و مرتب‌سازی
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="flex-1 bg-black/30" onClick={() => setOpen(false)} />
          <div className="fade-in h-full w-72 overflow-y-auto bg-ivory-soft p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg font-semibold">فیلتر</span>
              <button onClick={() => setOpen(false)} aria-label="بستن">
                <X size={20} />
              </button>
            </div>
            <FilterSidebar
              categories={categories}
              activeCategory={activeCategory}
              activeSort={activeSort}
            />
          </div>
        </div>
      )}
    </div>
  );
}
