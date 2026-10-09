import { NextResponse } from "next/server";
import { getCustomerProfile } from "@/lib/customer-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { customerId, profile } = await getCustomerProfile();
  if (!customerId) {
    return NextResponse.json({ error: "ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
  }
  if (!profile) {
    return NextResponse.json({ orders: [] });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}
