import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice, toPersianDigits } from "@/lib/utils/format";
import { Package, ShoppingCart, AlertTriangle, Wallet } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [{ count: productCount }, { count: orderCount }, { data: lowStock }, { data: pendingOrders }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase
        .from("products")
        .select("id, name, stock")
        .lte("stock", 3)
        .eq("is_active", true)
        .order("stock", { ascending: true }),
      supabase
        .from("orders")
        .select("id, order_number, total, status, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const { data: totalRevenue } = await supabase
    .from("orders")
    .select("total")
    .neq("status", "cancelled");

  const revenueSum = (totalRevenue ?? []).reduce((sum, o) => sum + Number(o.total), 0);

  const stats = [
    { label: "تعداد محصولات", value: productCount ?? 0, icon: Package },
    { label: "تعداد سفارش‌ها", value: orderCount ?? 0, icon: ShoppingCart },
    { label: "مجموع فروش", value: null, formatted: formatPrice(revenueSum), icon: Wallet },
    { label: "کم‌موجودی / ناموجود", value: (lowStock ?? []).length, icon: AlertTriangle },
  ];

  return (
    <div>
      <h1 className="section-title mb-6">داشبورد</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-card bg-white p-5 shadow-card">
              <Icon size={20} className="mb-3 text-brand" />
              <p className="text-xs text-ink-muted">{stat.label}</p>
              <p className="mt-1 text-xl font-semibold text-ink">
                {stat.formatted ?? toPersianDigits(stat.value ?? 0)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-card bg-white p-5 shadow-card">
          <h2 className="mb-4 font-display text-lg font-semibold">سفارش‌های در انتظار</h2>
          {(pendingOrders ?? []).length === 0 ? (
            <p className="text-sm text-ink-muted">سفارش در انتظاری وجود ندارد.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {pendingOrders!.map((order) => (
                <li key={order.id} className="flex items-center justify-between text-sm">
                  <span dir="ltr" className="text-ink">{order.order_number}</span>
                  <span className="text-ink-muted">{formatPrice(order.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-card bg-white p-5 shadow-card">
          <h2 className="mb-4 font-display text-lg font-semibold">هشدار موجودی</h2>
          {(lowStock ?? []).length === 0 ? (
            <p className="text-sm text-ink-muted">همه محصولات موجودی کافی دارند.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {lowStock!.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink">{p.name}</span>
                  <span className={p.stock === 0 ? "text-brand" : "text-ink-muted"}>
                    {p.stock === 0 ? "ناموجود" : `${toPersianDigits(p.stock)} عدد باقی مانده`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
