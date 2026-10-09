import { NextRequest, NextResponse } from "next/server";
import { normalizePhone, requestOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const phone = normalizePhone(body.phone ?? "");

  if (!phone) {
    return NextResponse.json(
      { error: "شماره تلفن معتبر نیست. مثال: 09121234567" },
      { status: 400 }
    );
  }

  const { error } = await requestOtp(phone);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
