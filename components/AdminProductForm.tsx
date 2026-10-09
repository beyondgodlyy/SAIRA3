"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { Category, Product } from "@/lib/types";

export default function AdminProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialImages =
    product?.product_images && product.product_images.length > 0
      ? [...product.product_images]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => img.url)
      : [""];
  const [images, setImages] = useState<string[]>(initialImages);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    compare_at_price: product?.compare_at_price ?? 0,
    category_id: product?.category_id ?? categories[0]?.id ?? "",
    color: product?.color ?? "",
    stock: product?.stock ?? 0,
    is_new: product?.is_new ?? false,
    is_bestseller: product?.is_bestseller ?? false,
    is_active: product?.is_active ?? true,
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateImage(index: number, value: string) {
    setImages((imgs) => imgs.map((img, i) => (i === index ? value : img)));
  }

  function addImage() {
    setImages((imgs) => [...imgs, ""]);
  }

  function removeImage(index: number) {
    setImages((imgs) => imgs.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((imgs) => {
      const target = index + direction;
      if (target < 0 || target >= imgs.length) return imgs;
      const copy = [...imgs];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      stock: Number(form.stock),
      images: images.map((i) => i.trim()).filter(Boolean),
    };

    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "مشکلی پیش آمد.");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4 rounded-card bg-white p-6 shadow-card">
        <div>
          <label className="mb-1 block text-sm text-ink-muted">نام محصول</label>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-muted">
            نامک (Slug) — برای URL، اختیاری
          </label>
          <input
            className="input-field"
            dir="ltr"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="در صورت خالی بودن، خودکار ساخته می‌شود"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-muted">توضیحات</label>
          <textarea
            className="input-field"
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-ink-muted">قیمت (تومان)</label>
            <input
              type="number"
              className="input-field"
              value={form.price}
              onChange={(e) => update("price", Number(e.target.value) as any)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">
              قیمت قبل از تخفیف (اختیاری)
            </label>
            <input
              type="number"
              className="input-field"
              value={form.compare_at_price}
              onChange={(e) => update("compare_at_price", Number(e.target.value) as any)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-ink-muted">دسته‌بندی</label>
            <select
              className="input-field"
              value={form.category_id}
              onChange={(e) => update("category_id", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">رنگ (اختیاری)</label>
            <input
              className="input-field"
              value={form.color}
              onChange={(e) => update("color", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-muted">موجودی</label>
          <input
            type="number"
            className="input-field"
            value={form.stock}
            onChange={(e) => update("stock", Number(e.target.value) as any)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-muted">تصاویر محصول</label>
          <p className="mb-3 text-xs text-ink-muted">
            اولین تصویر، تصویر اصلی محصول در فروشگاه خواهد بود. برای آپلود تصویر واقعی،
            فایل را در Supabase Storage بارگذاری کرده و آدرس آن را اینجا وارد کنید. ترتیب
            تصاویر را با فلش‌ها می‌توانید تغییر دهید.
          </p>

          <div className="flex flex-col gap-3">
            {images.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-ivory">
                  {/* از img ساده به‌جای next/image استفاده شده تا پیش‌نمایش حین تایپ
                      آدرس (حتی اگر هنوز نامعتبر باشد) خطا ندهد */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url.trim() || "/placeholders/generic.svg"}
                    alt={`تصویر ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholders/generic.svg";
                    }}
                  />
                </div>
                <input
                  className="input-field flex-1"
                  dir="ltr"
                  value={url}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder="/placeholders/necklace.svg یا آدرس Supabase Storage"
                />
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    aria-label="جابه‌جایی به بالا"
                    className="disabled:opacity-30"
                  >
                    <ChevronUp size={14} className="text-ink-muted" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                    aria-label="جابه‌جایی به پایین"
                    className="disabled:opacity-30"
                  >
                    <ChevronDown size={14} className="text-ink-muted" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label="حذف تصویر"
                  className="shrink-0"
                >
                  <Trash2 size={16} className="text-ink-muted hover:text-brand" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addImage}
            className="btn-secondary mt-3 w-full"
          >
            <Plus size={16} />
            افزودن تصویر
          </button>
        </div>
      </div>

      <div className="flex h-fit flex-col gap-4 rounded-card bg-white p-6 shadow-card">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => update("is_active", e.target.checked)}
          />
          فعال (در فروشگاه نمایش داده شود)
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.is_new}
            onChange={(e) => update("is_new", e.target.checked)}
          />
          نمایش برچسب «جدید»
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.is_bestseller}
            onChange={(e) => update("is_bestseller", e.target.checked)}
          />
          نمایش برچسب «پرفروش»
        </label>

        {error && (
          <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand">{error}</p>
        )}

        <button type="submit" disabled={saving} className="btn-primary mt-2">
          {saving ? "در حال ذخیره..." : "ذخیره محصول"}
        </button>
      </div>
    </form>
  );
}
