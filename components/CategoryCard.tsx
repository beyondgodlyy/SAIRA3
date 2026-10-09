import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/shop?category=${category.slug}`}
      className="group relative block overflow-hidden rounded-card bg-ivory"
    >
      <div className="relative aspect-square">
        <Image
          src={category.image_url ?? `/placeholders/${category.slug}.svg`}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 33vw, 200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <span className="absolute bottom-3 right-0 w-full text-center text-sm font-medium text-white">
        {category.name}
      </span>
    </Link>
  );
}
