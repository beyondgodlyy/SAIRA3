import { NextRequest, NextResponse } from "next/server";
import { getCustomerProfile } from "@/lib/customer-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { customerId, profile } = await getCustomerProfile();
  if (!customerId || !profile) {
    return NextResponse.json({ error: "ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", params.id)
    .eq("customer_id", profile.id) // فقط سفارش متعلق به همین مشتری
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "سفارش یافت نشد." }, { status: 404 });
  }

  return NextResponse.json({ order: data });
}
