"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils/format";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrderTable({ orders }: { orders: Order[] }) {
  const router = useRouter();

  async function updateStatus(orderId: string, status: OrderStatus) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-card bg-white shadow-card">
      <table className="w-full min-w-[760px] text-right text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-ink-muted">
            <th className="p-3 font-medium">شماره سفارش</th>
            <th className="p-3 font-medium">مشتری</th>
            <th className="p-3 font-medium">مبلغ</th>
            <th className="p-3 font-medium">تاریخ</th>
            <th className="p-3 font-medium">وضعیت</th>
            <th className="p-3 font-medium">جزئیات</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-ink/5">
              <td dir="ltr" className="p-3 text-ink">{order.order_number}</td>
              <td className="p-3 text-ink-muted">{order.customer?.full_name ?? "—"}</td>
              <td className="p-3 text-ink">{formatPrice(order.total)}</td>
              <td className="p-3 text-ink-muted">{formatDate(order.created_at)}</td>
              <td className="p-3">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                  className="rounded-lg border border-ink/15 bg-ivory-soft px-2 py-1 text-xs"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-xs text-brand hover:underline"
                >
                  مشاهده
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
