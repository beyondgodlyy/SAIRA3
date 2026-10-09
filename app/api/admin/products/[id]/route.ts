import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز." }, { status: 401 });
  }

  const body = await req.json();
  const supabase = createAdminClient();

  const updatePayload: Record<string, unknown> = {};
  const fields = [
    "name",
    "slug",
    "description",
    "price",
    "compare_at_price",
    "category_id",
    "color",
    "stock",
    "is_new",
    "is_bestseller",
    "is_active",
  ];
  for (const field of fields) {
    if (field in body) updatePayload[field] = body[field];
  }

  const { data, error } = await supabase
    .from("products")
    .update(updatePayload)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // اگر لیست تصاویر ارسال شده بود، کل تصاویر قبلی را با لیست جدید جایگزین کن
  if (Array.isArray(body.images)) {
    const images: string[] = body.images.filter((u: string) => u && u.trim());
    await supabase.from("product_images").delete().eq("product_id", params.id);
    if (images.length > 0) {
      await supabase.from("product_images").insert(
        images.map((url, i) => ({
          product_id: params.id,
          url,
          alt: data.name,
          sort_order: i,
        }))
      );
    }
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
