import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * سیستم نشست (Session) سبک و مستقل برای ورود مشتری با شماره تلفن.
 *
 * این کاملاً از Supabase Auth جدا است (که فقط برای ورود ادمین استفاده
 * می‌شود). اینجا خودمان یک توکن امضاشده با HMAC می‌سازیم و در یک
 * Cookie با httpOnly ذخیره می‌کنیم — نیازی به هیچ سرویس یا وابستگی
 * بیرونی نیست.
 */

const COOKIE_NAME = "saira_customer_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // ۳۰ روز

function getSecret(): string {
  const secret = process.env.CUSTOMER_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "CUSTOMER_SESSION_SECRET در .env.local تنظیم نشده است. یک رشته‌ی تصادفی و طولانی برایش انتخاب کنید."
    );
  }
  return secret;
}

function base64url(input: Buffer): string {
  return input.toString("base64url");
}

function sign(payload: string): string {
  return base64url(createHmac("sha256", getSecret()).update(payload).digest());
}

export function createSessionToken(customerId: string): string {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${customerId}.${expiresAt}`;
  const signature = sign(payload);
  return `${base64url(Buffer.from(payload))}.${signature}`;
}

export function verifySessionToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encodedPayload, signature] = parts;

  const payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
  const expectedSignature = sign(payload);

  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const [customerId, expiresAtStr] = payload.split(".");
  const expiresAt = Number(expiresAtStr);
  if (!customerId || !expiresAt || Date.now() > expiresAt) return null;

  return customerId;
}

export function setCustomerSessionCookie(customerId: string) {
  const token = createSessionToken(customerId);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearCustomerSessionCookie() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

/** شناسه‌ی مشتری لاگین‌شده را از روی Cookie برمی‌گرداند، یا null. */
export function getCurrentCustomerId(): string | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
