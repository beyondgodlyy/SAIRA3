"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, toPersianDigits } from "@/lib/utils/format";
import { productImageUrl } from "@/lib/utils/product-image";

export default function AdminProductTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) router.refresh();
    else alert("مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
  }

  async function toggleActive(product: Product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !product.is_active }),
    });
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-card bg-white shadow-card">
      <table className="w-full min-w-[720px] text-right text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-ink-muted">
            <th className="p-3 font-medium">محصول</th>
            <th className="p-3 font-medium">دسته‌بندی</th>
            <th className="p-3 font-medium">قیمت</th>
            <th className="p-3 font-medium">موجودی</th>
            <th className="p-3 font-medium">وضعیت</th>
            <th className="p-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-ink/5">
              <td className="flex items-center gap-3 p-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-md bg-ivory">
                  <Image
                    src={productImageUrl(product)}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-ink">{product.name}</span>
              </td>
              <td className="p-3 text-ink-muted">{product.category?.name ?? "—"}</td>
              <td className="p-3 text-ink">{formatPrice(product.price)}</td>
              <td className="p-3 text-ink">{toPersianDigits(product.stock)}</td>
              <td className="p-3">
                <button
                  onClick={() => toggleActive(product)}
                  className={
                    product.is_active
                      ? "rounded-full bg-brand/10 px-2 py-1 text-xs text-brand"
                      : "rounded-full bg-ink/10 px-2 py-1 text-xs text-ink-muted"
                  }
                >
                  {product.is_active ? "فعال" : "غیرفعال"}
                </button>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <Link href={`/admin/products/${product.id}`} aria-label="ویرایش">
                    <Pencil size={16} className="text-ink-muted hover:text-brand" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    aria-label="حذف"
                  >
                    <Trash2 size={16} className="text-ink-muted hover:text-brand" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
