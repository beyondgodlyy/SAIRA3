import { createServerSupabase } from "@/lib/supabase/server";
import type {
  Category,
  Product,
  HomepageContent,
  SiteSettings,
} from "@/lib/types";

/**
 * توابع این فایل داده‌های عمومی (Storefront) را از Supabase می‌خوانند.
 * چون این جداول Row Level Security با Policy خواندن عمومی دارند،
 * از کلاینت anon (نه service role) استفاده می‌شود.
 */

export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("خطا در خواندن دسته‌بندی‌ها:", error.message);
    return [];
  }
  return data ?? [];
}

type GetProductsOptions = {
  categorySlug?: string;
  sort?: "newest" | "bestseller" | "price_asc" | "price_desc";
  search?: string;
  limit?: number;
};

export async function getProducts(
  options: GetProductsOptions = {}
): Promise<Product[]> {
  const supabase = createServerSupabase();
  let query = supabase
    .from("products")
    .select("*, category:categories(*), product_images(*)")
    .eq("is_active", true);

  if (options.categorySlug && options.categorySlug !== "all") {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .maybeSingle();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (options.search) {
    query = query.ilike("name", `%${options.search}%`);
  }

  switch (options.sort) {
    case "bestseller":
      query = query.order("is_bestseller", { ascending: false });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) {
    console.error("خطا در خواندن محصولات:", error.message);
    return [];
  }

  return (data ?? []).map(sortImages);
}

export async function getProductBySlug(rawSlug: string): Promise<Product | null> {
  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    // اگر دیکد ممکن نبود، همان مقدار اصلی استفاده می‌شود
  }
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), product_images(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("خطا در خواندن محصول:", error.message);
    return null;
  }
  return data ? sortImages(data) : null;
}

function sortImages(product: Product): Product {
  return {
    ...product,
    product_images: (product.product_images ?? []).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  };
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("homepage_content")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return (
    data ?? {
      id: 1,
      hero_title: "جزئیات کوچک، تفاوت‌های بزرگ",
      hero_subtitle: "اکسسوری‌هایی برای کامل کردن استایل تو.",
      hero_image_url: null,
      hero_cta_label: "مشاهده محصولات",
      hero_cta_url: "/shop",
      about_text: null,
      promo_text: null,
    }
  );
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return (
    data ?? {
      id: 1,
      store_name: "SAIRA",
      phone: null,
      instagram: null,
      address: null,
      shipping_cost: 0,
      free_shipping_threshold: null,
      return_policy: null,
      shipping_policy: null,
      footer_text: "«جزئیات کوچک، تفاوت‌های بزرگ.»",
    }
  );
}

export { productImageUrl } from "@/lib/utils/product-image";
