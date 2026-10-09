import { redirect, notFound } from "next/navigation";
import { getCustomerProfile } from "@/lib/customer-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import { formatDate, formatPrice, toPersianDigits } from "@/lib/utils/format";

export const revalidate = 0;

const STEPS: Array<Order["status"]> = ["pending", "processing", "shipped", "delivered"];

export default async function AccountOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { customerId, profile } = await getCustomerProfile();
  if (!customerId) redirect("/account/login");
  if (!profile) notFound();

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", params.id)
    .eq("customer_id", profile.id)
    .maybeSingle();

  if (!data) notFound();
  const order = data as Order;
  const currentStepIndex = STEPS.indexOf(order.status);

  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="section-title mb-2" dir="ltr">
        {order.order_number}
      </h1>
      <p className="mb-6 text-sm text-ink-muted">
        ثبت‌شده در {formatDate(order.created_at)}
      </p>

      {/* مراحل پیگیری سفارش */}
      {order.status !== "cancelled" ? (
        <div className="mb-8 flex items-center justify-between rounded-card bg-white p-5 shadow-card">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-1 flex-col items-center gap-2 text-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  i <= currentStepIndex
                    ? "bg-brand text-white"
                    : "bg-ink/10 text-ink-muted"
                }`}
              >
                {toPersianDigits(i + 1)}
              </div>
              <span
                className={`text-xs ${
                  i <= currentStepIndex ? "font-medium text-ink" : "text-ink-muted"
                }`}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-8 rounded-card bg-red-50 p-4 text-center text-sm font-medium text-red-600">
          این سفارش لغو شده است.
        </div>
      )}

      <div className="rounded-card bg-white p-5 shadow-card">
        <h2 className="mb-4 font-display text-lg font-semibold">اقلام سفارش</h2>
        <div className="flex flex-col divide-y divide-ink/5">
          {(order.order_items ?? []).map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="text-ink">{item.product_name}</p>
                <p className="text-xs text-ink-muted">
                  {toPersianDigits(item.quantity)} عدد
                </p>
              </div>
              <span className="text-ink">{formatPrice(item.unit_price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-1 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between text-ink-muted">
            <span>جمع سبد خرید</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-muted">
            <span>هزینه ارسال</span>
            <span>{formatPrice(order.shipping_cost)}</span>
          </div>
          <div className="mt-1 flex justify-between font-semibold text-ink">
            <span>مبلغ نهایی</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
