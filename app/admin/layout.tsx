"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <div dir="rtl">{children}</div>;
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-ivory">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-6">{children}</main>
    </div>
  );
}
