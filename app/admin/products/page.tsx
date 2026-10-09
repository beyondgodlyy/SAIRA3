import Link from "next/link";
import { Plus } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminProductTable from "@/components/AdminProductTable";
import type { Product } from "@/lib/types";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*), product_images(*)")
    .order("created_at", { ascending: false });

  const products = (data ?? []) as Product[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="section-title">محصولات</h1>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus size={16} />
          محصول جدید
        </Link>
      </div>
      <AdminProductTable products={products} />
    </div>
  );
}
