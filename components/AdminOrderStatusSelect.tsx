"use client";

import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/types";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();

  async function handleChange(status: OrderStatus) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className="rounded-lg border border-ink/15 bg-ivory-soft px-3 py-2 text-sm"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
