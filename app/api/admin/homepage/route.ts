import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "دسترسی غیرمجاز." }, { status: 401 });
  }

  const body = await req.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("homepage_content")
    .update({
      hero_title: body.hero_title,
      hero_subtitle: body.hero_subtitle,
      hero_image_url: body.hero_image_url || null,
      hero_cta_label: body.hero_cta_label,
      hero_cta_url: body.hero_cta_url,
      about_text: body.about_text,
      promo_text: body.promo_text,
    })
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ content: data });
}
