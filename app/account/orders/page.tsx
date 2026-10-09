import { redirect } from "next/navigation";
import Link from "next/link";
import { getCustomerProfile } from "@/lib/customer-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils/format";
import EmptyState from "@/components/EmptyState";

export const revalidate = 0;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-ink/10 text-ink-muted",
  processing: "bg-gold/20 text-ink",
  shipped: "bg-brand/10 text-brand",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

export default async function AccountOrdersPage() {
  const { customerId, profile } = await getCustomerProfile();
  if (!customerId) redirect("/account/login");

  let orders: Order[] = [];
  if (profile) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("customer_id", profile.id)
      .order("created_at", { ascending: false });
    orders = (data as Order[]) ?? [];
  }

  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="section-title mb-6">سفارش‌های من</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="هنوز سفارشی ثبت نکرده‌اید."
          ctaLabel="مشاهده محصولات"
          ctaHref="/shop"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="rounded-card bg-white p-5 shadow-card transition-shadow hover:shadow-soft"
            >
              <div className="mb-2 flex items-center justify-between">
                <span dir="ltr" className="font-medium text-ink">
                  {order.order_number}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status]}`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-ink-muted">
                <span>{formatDate(order.created_at)}</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <p className="mt-2 text-xs text-ink-muted">
                {(order.order_items ?? []).length.toLocaleString("fa-IR")} قلم کالا
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
