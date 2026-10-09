"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AccountLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className="btn-secondary">
      <LogOut size={16} />
      خروج از حساب
    </button>
  );
}
