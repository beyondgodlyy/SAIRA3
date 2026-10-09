"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Home,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: FolderTree },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart },
  { href: "/admin/homepage", label: "صفحه اصلی", icon: Home },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-l border-ink/10 bg-ivory-soft p-4">
      <div className="mb-8 px-2">
        <span className="font-display text-xl font-bold text-brand">SAIRA</span>
        <p className="text-xs text-ink-muted">پنل مدیریت</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-brand text-white" : "text-ink hover:bg-ink/5"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-ink/5"
      >
        <LogOut size={18} />
        خروج از حساب
      </button>
    </aside>
  );
}
