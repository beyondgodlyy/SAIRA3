import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="محصولی یافت نشد"
        description="فیلترها را تغییر دهید یا بعداً دوباره سر بزنید."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
