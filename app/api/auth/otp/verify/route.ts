import { NextRequest, NextResponse } from "next/server";
import { normalizePhone, verifyOtp } from "@/lib/otp";
import { setCustomerSessionCookie } from "@/lib/customer-session";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const phone = normalizePhone(body.phone ?? "");
  const code = String(body.code ?? "").trim();

  if (!phone) {
    return NextResponse.json({ error: "شماره تلفن معتبر نیست." }, { status: 400 });
  }
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "کد تایید باید ۶ رقم باشد." }, { status: 400 });
  }

  const { error, customerId } = await verifyOtp(phone, code);
  if (error || !customerId) {
    return NextResponse.json({ error: error ?? "کد تایید صحیح نیست." }, { status: 400 });
  }

  setCustomerSessionCookie(customerId);

  return NextResponse.json({ success: true });
}
