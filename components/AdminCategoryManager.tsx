"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Plus } from "lucide-react";
import type { Category } from "@/lib/types";

export default function AdminCategoryManager({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName.trim(),
        image_url: newImageUrl.trim() || null,
        sort_order: categories.length,
      }),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "مشکلی پیش آمد.");
      return;
    }
    setNewName("");
    setNewImageUrl("");
    router.refresh();
  }

  async function handleRename(cat: Category, name: string) {
    await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    router.refresh();
  }

  async function handleImageChange(cat: Category, imageUrl: string) {
    await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl.trim() || null }),
    });
    router.refresh();
  }

  async function handleToggle(cat: Category) {
    await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !cat.is_active }),
    });
    router.refresh();
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`آیا از حذف دسته‌بندی «${cat.name}» مطمئن هستید؟`)) return;
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
  }

  return (
    <div className="rounded-card bg-white p-6 shadow-card">
      <form onSubmit={handleAdd} className="mb-6 flex flex-col gap-2 sm:flex-row">
        <input
          className="input-field"
          placeholder="نام دسته‌بندی جدید"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          className="input-field"
          dir="ltr"
          placeholder="آدرس تصویر (اختیاری) — مثلاً /placeholders/necklace.svg"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
        />
        <button type="submit" disabled={saving} className="btn-primary shrink-0">
          <Plus size={16} />
          افزودن
        </button>
      </form>

      {error && (
        <p className="mb-4 rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand">{error}</p>
      )}

      <div className="flex flex-col divide-y divide-ink/5">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-ivory">
              <Image
                src={cat.image_url ?? `/placeholders/${cat.slug}.svg`}
                alt={cat.name}
                fill
                className="object-cover"
              />
            </div>
            <input
              className="input-field flex-1"
              defaultValue={cat.name}
              onBlur={(e) => {
                if (e.target.value.trim() && e.target.value !== cat.name) {
                  handleRename(cat, e.target.value.trim());
                }
              }}
            />
            <input
              className="input-field flex-1"
              dir="ltr"
              placeholder="آدرس تصویر دسته‌بندی"
              defaultValue={cat.image_url ?? ""}
              onBlur={(e) => {
                if (e.target.value !== (cat.image_url ?? "")) {
                  handleImageChange(cat, e.target.value);
                }
              }}
            />
            <button
              onClick={() => handleToggle(cat)}
              className={
                cat.is_active
                  ? "shrink-0 rounded-full bg-brand/10 px-3 py-1 text-xs text-brand"
                  : "shrink-0 rounded-full bg-ink/10 px-3 py-1 text-xs text-ink-muted"
              }
            >
              {cat.is_active ? "فعال" : "غیرفعال"}
            </button>
            <button onClick={() => handleDelete(cat)} aria-label="حذف">
              <Trash2 size={16} className="text-ink-muted hover:text-brand" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

