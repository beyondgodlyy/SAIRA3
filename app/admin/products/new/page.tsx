import { createAdminClient } from "@/lib/supabase/admin";
import AdminProductForm from "@/components/AdminProductForm";
import type { Category } from "@/lib/types";

export const revalidate = 0;

export default async function NewProductPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="section-title mb-6">محصول جدید</h1>
      <AdminProductForm categories={(data ?? []) as Category[]} />
    </div>
  );
}
