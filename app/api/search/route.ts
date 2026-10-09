import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, product_images(url, sort_order)")
    .eq("is_active", true)
    .ilike("name", `%${q}%`)
    .limit(8);

  if (error) {
    return NextResponse.json({ results: [], error: error.message }, { status: 500 });
  }

  const results = (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    image:
      (p.product_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)[0]
        ?.url ?? null,
  }));

  return NextResponse.json({ results });
}
