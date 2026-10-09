import "server-only";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOtpSms } from "@/lib/sms";

const OTP_EXPIRY_MINUTES = 2;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_VERIFY_ATTEMPTS = 5;

/** شماره را به فرمت یکسان +98... تبدیل می‌کند (ورودی می‌تواند 09xxxxxxxxx باشد) */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 11 && digits.startsWith("09")) {
    return `+98${digits.slice(1)}`;
  }
  if (digits.length === 10 && digits.startsWith("9")) {
    return `+98${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("989")) {
    return `+${digits}`;
  }
  return null;
}

function hashCode(code: string, phone: string): string {
  return createHash("sha256").update(`${phone}:${code}`).digest("hex");
}

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function requestOtp(phone: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();

  // جلوگیری از ارسال درخواست‌های پشت‌سرهم
  const { data: recent } = await supabase
    .from("otp_codes")
    .select("created_at")
    .eq("phone", phone)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recent) {
    const secondsSince = (Date.now() - new Date(recent.created_at).getTime()) / 1000;
    if (secondsSince < RESEND_COOLDOWN_SECONDS) {
      return {
        error: `لطفاً ${Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSince)} ثانیه دیگر دوباره تلاش کنید.`,
      };
    }
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

  const { error: insertError } = await supabase.from("otp_codes").insert({
    phone,
    code_hash: hashCode(code, phone),
    expires_at: expiresAt,
  });

  if (insertError) {
    return { error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید." };
  }

  try {
    await sendOtpSms(phone, code);
  } catch {
    return { error: "ارسال پیامک ناموفق بود. لطفاً دوباره تلاش کنید." };
  }

  return {};
}

export async function verifyOtp(
  phone: string,
  code: string
): Promise<{ error?: string; customerId?: string }> {
  const supabase = createAdminClient();

  const { data: otpRow } = await supabase
    .from("otp_codes")
    .select("*")
    .eq("phone", phone)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!otpRow) {
    return { error: "کدی برای این شماره یافت نشد. دوباره درخواست کد کنید." };
  }
  if (new Date(otpRow.expires_at).getTime() < Date.now()) {
    return { error: "کد تایید منقضی شده است. دوباره درخواست کد کنید." };
  }
  if (otpRow.attempts >= MAX_VERIFY_ATTEMPTS) {
    return { error: "تعداد تلاش‌های مجاز تمام شده. دوباره درخواست کد کنید." };
  }
  if (otpRow.code_hash !== hashCode(code, phone)) {
    await supabase
      .from("otp_codes")
      .update({ attempts: otpRow.attempts + 1 })
      .eq("id", otpRow.id);
    return { error: "کد وارد شده صحیح نیست." };
  }

  await supabase
    .from("otp_codes")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", otpRow.id);

  // پیدا کردن یا ساختن مشتری بر اساس شماره تلفن
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("phone", phone)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingCustomer) {
    return { customerId: existingCustomer.id };
  }

  const { data: newCustomer, error: createError } = await supabase
    .from("customers")
    .insert({ phone, full_name: null })
    .select("id")
    .single();

  if (createError || !newCustomer) {
    return { error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید." };
  }

  return { customerId: newCustomer.id };
}
