import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9آ-ی\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز." }, { status: 401 });
  }

  const body = await req.json();
  const supabase = createAdminClient();

  let slug = body.slug?.trim() || slugify(body.name ?? "");
  if (!slug) slug = `category-${Date.now()}`;

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: body.name,
      slug,
      image_url: body.image_url || null,
      sort_order: body.sort_order ?? 0,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ category: data });
}
