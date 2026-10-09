"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/lib/wishlist-context";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";
import EmptyState from "@/components/EmptyState";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("*, category:categories(*), product_images(*)")
        .in("id", ids)
        .eq("is_active", true);
      setProducts((data as Product[]) ?? []);
      setLoading(false);
    }
    load();
  }, [ids]);

  return (
    <div className="container-page py-10">
      <h1 className="section-title mb-8">علاقه‌مندی‌ها</h1>
      {loading ? (
        <p className="text-sm text-ink-muted">در حال بارگذاری...</p>
      ) : products.length === 0 ? (
        <EmptyState
          title="محصولات موردعلاقه‌ات را اینجا ذخیره کن."
          ctaLabel="مشاهده محصولات"
          ctaHref="/shop"
        />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
