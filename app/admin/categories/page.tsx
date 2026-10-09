import { createAdminClient } from "@/lib/supabase/admin";
import AdminCategoryManager from "@/components/AdminCategoryManager";
import type { Category } from "@/lib/types";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="section-title mb-6">دسته‌بندی‌ها</h1>
      <AdminCategoryManager categories={(data ?? []) as Category[]} />
    </div>
  );
}
