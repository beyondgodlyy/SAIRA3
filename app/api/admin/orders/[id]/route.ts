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

  const { data, error } = await supabase
    .from("orders")
    .update({ status: body.status })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ order: data });
}
