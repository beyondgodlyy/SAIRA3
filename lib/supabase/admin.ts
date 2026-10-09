import "server-only";
import { createClient } from "@supabase/supabase-js";

// ⚠️ بسیار مهم: این فایل فقط باید در کد Server (Route Handlers،
// Server Actions) import شود. هرگز آن را در یک Client Component
// import نکنید — SUPABASE_SERVICE_ROLE_KEY نباید به Browser برسد.
//
// پکیج "server-only" با خطای build جلوی import اشتباه در کد
// کلاینت را می‌گیرد.

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY یا NEXT_PUBLIC_SUPABASE_URL تنظیم نشده است."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
