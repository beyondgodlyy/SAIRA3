import { createBrowserClient } from "@supabase/ssr";

// این کلاینت فقط از anon key استفاده می‌کند و برای اجرا در Browser امن است.
// به لطف Row Level Security، فقط داده‌های عمومی (فعال) قابل خواندن است.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
