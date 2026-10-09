"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// توجه: علاقه‌مندی‌ها فقط به صورت Local در همین مرورگر ذخیره می‌شود.
// این یک سیستم Customer Account/Wishlist ابری نیست — چون در این
// نسخه ورود مشتری (Login) پیاده‌سازی نشده است. معماری طوری است که
// بعداً می‌توان آن را به یک جدول wishlist در Supabase متصل کرد.

type WishlistContextValue = {
  ids: string[];
  toggle: (productId: string) => void;
  isWished: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "saira_wishlist_v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, hydrated]);

  function toggle(productId: string) {
    setIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }

  return (
    <WishlistContext.Provider
      value={{ ids, toggle, isWished: (id) => ids.includes(id) }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist باید داخل WishlistProvider استفاده شود.");
  return ctx;
}
