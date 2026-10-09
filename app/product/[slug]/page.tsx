import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/data";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductGrid from "@/components/ProductGrid";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "محصول یافت نشد | SAIRA" };
  return {
    title: `${product.name} | SAIRA`,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = product.category_id
    ? (await getProducts({ categorySlug: product.category?.slug, limit: 5 })).filter(
        (p) => p.id !== product.id
      )
    : [];

  return (
    <div className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.product_images ?? []} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title mb-6">محصولات مرتبط</h2>
          <ProductGrid products={related.slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
