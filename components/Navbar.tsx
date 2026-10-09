"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingBag, X, Heart, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Category } from "@/lib/types";
import SearchModal from "./SearchModal";

export default function Navbar({
  categories,
  storeName,
}: {
  categories: Category[];
  storeName: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory-soft/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          {/* موبایل: منو */}
          <button
            className="p-2 lg:hidden"
            aria-label="باز کردن منو"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>

          {/* دسکتاپ: لینک‌های دسته‌بندی */}
          <nav className="hidden items-center gap-6 lg:flex">
            <Link href="/shop" className="text-sm text-ink hover:text-brand">
              فروشگاه
            </Link>
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="text-sm text-ink hover:text-brand"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* لوگو/نام برند */}
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-wide2 text-brand"
          >
            {storeName}
          </Link>

          {/* آیکون‌های سمت چپ (RTL) */}
          <div className="flex items-center gap-1">
            <button
              className="p-2"
              aria-label="جستجو"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={20} />
            </button>
            <Link href="/account" className="hidden p-2 sm:block" aria-label="حساب کاربری">
              <User size={20} />
            </Link>
            <Link href="/wishlist" className="hidden p-2 sm:block" aria-label="علاقه‌مندی‌ها">
              <Heart size={20} />
            </Link>
            <button
              className="relative p-2"
              aria-label="سبد خرید"
              onClick={openDrawer}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* منوی موبایل */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/30"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fade-in w-72 bg-ivory-soft p-5 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg font-bold text-brand">
                {storeName}
              </span>
              <button onClick={() => setMenuOpen(false)} aria-label="بستن منو">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              <Link
                href="/shop"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-ink"
              >
                همه محصولات
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-ink-muted"
                >
                  {cat.name}
                </Link>
              ))}
              <div className="my-2 h-px bg-ink/10" />
              <Link href="/account" onClick={() => setMenuOpen(false)} className="text-sm text-ink-muted">
                حساب کاربری من
              </Link>
              <Link href="/about" onClick={() => setMenuOpen(false)} className="text-sm text-ink-muted">
                درباره ما
              </Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-sm text-ink-muted">
                تماس با ما
              </Link>
              <Link href="/faq" onClick={() => setMenuOpen(false)} className="text-sm text-ink-muted">
                سوالات متداول
              </Link>
            </nav>
          </div>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
