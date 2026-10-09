import { getCategories, getProducts } from "@/lib/data";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import FilterDrawer from "@/components/FilterDrawer";
import { toPersianDigits } from "@/lib/utils/format";

export const revalidate = 0;

type SortValue = "newest" | "bestseller" | "price_asc" | "price_desc";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const category = searchParams.category ?? "all";
  const sort = (searchParams.sort as SortValue) ?? "newest";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: category, sort }),
  ]);

  const activeCategoryName =
    category === "all"
      ? "همه محصولات"
      : categories.find((c) => c.slug === category)?.name ?? "همه محصولات";

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <h1 className="section-title">{activeCategoryName}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {toPersianDigits(products.length)} محصول
        </p>
      </div>

      <FilterDrawer categories={categories} activeCategory={category} activeSort={sort} />

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <FilterSidebar categories={categories} activeCategory={category} activeSort={sort} />
        </aside>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
