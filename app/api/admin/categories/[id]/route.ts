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
  for (const field of ["name", "slug", "image_url", "sort_order", "is_active"]) {
    if (field in body) updatePayload[field] = body[field];
  }

  const { data, error } = await supabase
    .from("categories")
    .update(updatePayload)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ category: data });
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
  const { error } = await supabase.from("categories").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
