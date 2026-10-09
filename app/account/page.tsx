import { redirect } from "next/navigation";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { getCustomerProfile } from "@/lib/customer-auth";
import AccountProfileForm from "@/components/AccountProfileForm";
import AccountLogoutButton from "@/components/AccountLogoutButton";

export const revalidate = 0;

export default async function AccountPage() {
  const { customerId, profile } = await getCustomerProfile();
  if (!customerId) redirect("/account/login");

  return (
    <div className="container-page max-w-2xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">حساب کاربری من</h1>
        <AccountLogoutButton />
      </div>

      <Link
        href="/account/orders"
        className="mb-6 flex items-center justify-between rounded-card bg-white p-5 shadow-card transition-shadow hover:shadow-soft"
      >
        <div className="flex items-center gap-3">
          <ClipboardList size={20} className="text-brand" />
          <span className="font-medium text-ink">پیگیری سفارش‌ها</span>
        </div>
        <span className="text-sm text-ink-muted">مشاهده وضعیت سفارش‌های من ←</span>
      </Link>

      <AccountProfileForm profile={profile} phone={profile?.phone ?? ""} />
    </div>
  );
}
