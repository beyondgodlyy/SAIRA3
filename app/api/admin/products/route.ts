import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9آ-ی\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز." }, { status: 401 });
  }

  const body = await req.json();
  const supabase = createAdminClient();

  let slug = body.slug?.trim() || slugify(body.name ?? "");
  if (!slug) slug = `product-${Date.now()}`;

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: body.name,
      slug,
      description: body.description ?? null,
      price: body.price,
      compare_at_price: body.compare_at_price || null,
      category_id: body.category_id || null,
      color: body.color || null,
      stock: body.stock ?? 0,
      is_new: !!body.is_new,
      is_bestseller: !!body.is_bestseller,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // ثبت تصاویر محصول (چند تصویر، به ترتیب وارد شده)
  const images: string[] = Array.isArray(body.images)
    ? body.images.filter((u: string) => u && u.trim())
    : [];

  if (images.length > 0) {
    await supabase.from("product_images").insert(
      images.map((url, i) => ({
        product_id: data.id,
        url,
        alt: body.name,
        sort_order: i,
      }))
    );
  }

  return NextResponse.json({ product: data });
}
