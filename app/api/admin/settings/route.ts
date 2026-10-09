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
    .from("site_settings")
    .update({
      store_name: body.store_name,
      phone: body.phone || null,
      instagram: body.instagram || null,
      address: body.address || null,
      shipping_cost: body.shipping_cost ?? 0,
      free_shipping_threshold: body.free_shipping_threshold || null,
      return_policy: body.return_policy || null,
      shipping_policy: body.shipping_policy || null,
      footer_text: body.footer_text || null,
    })
    .eq("id", 1)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ settings: data });
}
