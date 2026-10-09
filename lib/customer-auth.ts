import "server-only";
import { getCurrentCustomerId } from "@/lib/customer-session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Customer } from "@/lib/types";

/**
 * پروفایل مشتری لاگین‌شده (بر اساس Cookie نشست تلفن، نه Supabase Auth)
 * را برمی‌گرداند. اگر لاگین نباشد، customerId و profile هر دو null
 * خواهند بود.
 */
export async function getCustomerProfile(): Promise<{
  customerId: string | null;
  profile: Customer | null;
}> {
  const customerId = getCurrentCustomerId();
  if (!customerId) return { customerId: null, profile: null };

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .maybeSingle();

  return { customerId, profile: (data as Customer) ?? null };
}
