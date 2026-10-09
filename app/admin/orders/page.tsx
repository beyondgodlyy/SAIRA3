import { createAdminClient } from "@/lib/supabase/admin";
import AdminOrderTable from "@/components/AdminOrderTable";
import type { Order } from "@/lib/types";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*, customer:customers(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="section-title mb-6">سفارش‌ها</h1>
      <AdminOrderTable orders={(data ?? []) as Order[]} />
    </div>
  );
}
