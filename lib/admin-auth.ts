import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";

function getAllowedEmails(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAllowedEmails().includes(email.toLowerCase());
}

/**
 * برای استفاده در Route Handlerها: بررسی می‌کند کاربر لاگین‌شده
 * و ایمیلش در لیست ADMIN_ALLOWED_EMAILS باشد.
 * اگر مجاز نبود، null برمی‌گرداند (Route باید 401/403 برگرداند).
 */
export async function getAdminUser() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isEmailAllowed(user.email)) {
    return null;
  }
  return user;
}
