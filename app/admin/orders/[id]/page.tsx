import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import { formatDate, formatPrice, toPersianDigits } from "@/lib/utils/format";
import AdminOrderStatusSelect from "@/components/AdminOrderStatusSelect";

export const revalidate = 0;

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*, customer:customers(*), order_items(*)")
    .eq("id", params.id)
    .maybeSingle();

  if (!data) notFound();
  const order = data as Order;

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title" dir="ltr">
          {order.order_number}
        </h1>
        <AdminOrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-card bg-white p-5 shadow-card">
          <h2 className="mb-3 font-display text-lg font-semibold">اطلاعات مشتری</h2>
          <div className="flex flex-col gap-1 text-sm text-ink-muted">
            <p>
              <span className="text-ink">نام: </span>
              {order.customer?.full_name}
            </p>
            <p dir="ltr" className="text-right">
              <span className="text-ink">تماس: </span>
              {order.customer?.phone}
            </p>
            {order.customer?.email && (
              <p dir="ltr" className="text-right">
                <span className="text-ink">ایمیل: </span>
                {order.customer.email}
              </p>
            )}
            <p>
              <span className="text-ink">آدرس: </span>
              {order.customer?.address}
              {order.customer?.city ? `، ${order.customer.city}` : ""}
            </p>
            {order.customer?.postal_code && (
              <p dir="ltr" className="text-right">
                <span className="text-ink">کد پستی: </span>
                {order.customer.postal_code}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-card bg-white p-5 shadow-card">
          <h2 className="mb-3 font-display text-lg font-semibold">خلاصه سفارش</h2>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between text-ink-muted">
              <span>تاریخ ثبت</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>جمع سبد خرید</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>هزینه ارسال</span>
              <span>{formatPrice(order.shipping_cost)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-ink/10 pt-2 font-semibold text-ink">
              <span>مبلغ نهایی</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            {order.payment_note ?? "پرداخت آنلاین واقعی در این نسخه فعال نیست."}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-card bg-white p-5 shadow-card">
        <h2 className="mb-4 font-display text-lg font-semibold">اقلام سفارش</h2>
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink-muted">
              <th className="p-2 font-medium">محصول</th>
              <th className="p-2 font-medium">تعداد</th>
              <th className="p-2 font-medium">قیمت واحد</th>
              <th className="p-2 font-medium">جمع</th>
            </tr>
          </thead>
          <tbody>
            {(order.order_items ?? []).map((item) => (
              <tr key={item.id} className="border-b border-ink/5">
                <td className="p-2 text-ink">{item.product_name}</td>
                <td className="p-2 text-ink-muted">{toPersianDigits(item.quantity)}</td>
                <td className="p-2 text-ink-muted">{formatPrice(item.unit_price)}</td>
                <td className="p-2 text-ink">{formatPrice(item.unit_price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
