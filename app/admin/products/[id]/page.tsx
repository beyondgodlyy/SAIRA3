import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminProductForm from "@/components/AdminProductForm";
import type { Category, Product } from "@/lib/types";

export const revalidate = 0;

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createAdminClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(*), product_images(*)")
      .eq("id", params.id)
      .maybeSingle(),
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="section-title mb-6">ویرایش محصول</h1>
      <AdminProductForm
        categories={(categories ?? []) as Category[]}
        product={product as Product}
      />
    </div>
  );
}
