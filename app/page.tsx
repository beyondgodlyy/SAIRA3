import Link from "next/link";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductGrid from "@/components/ProductGrid";
import {
  getCategories,
  getHomepageContent,
  getProducts,
} from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const [content, categories, newProducts, bestsellers] = await Promise.all([
    getHomepageContent(),
    getCategories(),
    getProducts({ sort: "newest", limit: 4 }),
    getProducts({ sort: "bestseller", limit: 4 }),
  ]);

  return (
    <div>
      <Hero content={content} />

      {/* دسته‌بندی‌ها */}
      <section className="container-page py-14">
        <h2 className="section-title mb-6 text-center">دسته‌بندی‌ها</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* محصولات جدید */}
      {newProducts.length > 0 && (
        <section className="container-page py-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="section-title">محصولات جدید</h2>
            <Link href="/shop" className="text-sm text-brand hover:underline">
              مشاهده همه
            </Link>
          </div>
          <ProductGrid products={newProducts} />
        </section>
      )}

      {/* پرفروش‌ترین‌ها */}
      {bestsellers.length > 0 && (
        <section className="container-page py-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="section-title">پرفروش‌ترین‌ها</h2>
            <Link href="/shop" className="text-sm text-brand hover:underline">
              مشاهده همه
            </Link>
          </div>
          <ProductGrid products={bestsellers} />
        </section>
      )}

      {/* درباره برند */}
      {content.about_text && (
        <section className="bg-brand/5 py-16">
          <div className="container-page max-w-2xl text-center">
            <h2 className="section-title mb-4">درباره SAIRA</h2>
            <p className="leading-8 text-ink-muted">{content.about_text}</p>
          </div>
        </section>
      )}
    </div>
  );
}
