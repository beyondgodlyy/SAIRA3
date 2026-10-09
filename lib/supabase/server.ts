import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// این کلاینت در Server Components / Route Handlers استفاده می‌شود.
// همچنان از anon key استفاده می‌کند (نه service role)، اما session
// کاربر لاگین‌شده (ادمین) را از روی Cookie می‌خواند تا RLS بتواند
// در آینده بر اساس auth.uid() قوانین دقیق‌تری اعمال کند.
export function createServerSupabase() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // در Server Component خواندنی، set ممکن است نادیده گرفته شود
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // نادیده گرفته می‌شود
          }
        },
      },
    }
  );
}
