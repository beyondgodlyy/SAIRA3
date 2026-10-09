import { NextRequest, NextResponse } from "next/server";
import { getCustomerProfile } from "@/lib/customer-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { customerId, profile } = await getCustomerProfile();
  if (!customerId) {
    return NextResponse.json({ error: "ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
  }

  return NextResponse.json({ profile: profile ?? null, phone: profile?.phone ?? null });
}

// ویرایش پروفایل مشتری (مثلاً از صفحه «حساب من» یا موقع تکمیل خرید)
export async function PATCH(req: NextRequest) {
  const { customerId } = await getCustomerProfile();
  if (!customerId) {
    return NextResponse.json({ error: "ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
  }

  const body = await req.json();
  const supabase = createAdminClient();

  const updatePayload: Record<string, unknown> = {};
  for (const field of ["full_name", "address", "city", "postal_code", "email"]) {
    if (field in body) updatePayload[field] = body[field];
  }

  const { data, error } = await supabase
    .from("customers")
    .update(updatePayload)
    .eq("id", customerId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
