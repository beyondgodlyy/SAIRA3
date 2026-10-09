"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/types";

export default function AdminSettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState({
    store_name: settings.store_name,
    phone: settings.phone ?? "",
    instagram: settings.instagram ?? "",
    address: settings.address ?? "",
    shipping_cost: settings.shipping_cost,
    free_shipping_threshold: settings.free_shipping_threshold ?? 0,
    return_policy: settings.return_policy ?? "",
    shipping_policy: settings.shipping_policy ?? "",
    footer_text: settings.footer_text ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        shipping_cost: Number(form.shipping_cost),
        free_shipping_threshold: form.free_shipping_threshold
          ? Number(form.free_shipping_threshold)
          : null,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-4 rounded-card bg-white p-6 shadow-card">
      <div>
        <label className="mb-1 block text-sm text-ink-muted">نام فروشگاه</label>
        <input className="input-field" value={form.store_name} onChange={(e) => update("store_name", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-ink-muted">شماره تماس</label>
          <input dir="ltr" className="input-field" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-muted">اینستاگرام</label>
          <input dir="ltr" className="input-field" value={form.instagram} onChange={(e) => update("instagram", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink-muted">آدرس</label>
        <input className="input-field" value={form.address} onChange={(e) => update("address", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-ink-muted">هزینه ارسال (تومان)</label>
          <input
            type="number"
            className="input-field"
            value={form.shipping_cost}
            onChange={(e) => update("shipping_cost", Number(e.target.value) as any)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-muted">
            حداقل مبلغ ارسال رایگان (اختیاری)
          </label>
          <input
            type="number"
            className="input-field"
            value={form.free_shipping_threshold}
            onChange={(e) => update("free_shipping_threshold", Number(e.target.value) as any)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink-muted">قوانین ارسال</label>
        <textarea
          className="input-field"
          rows={3}
          value={form.shipping_policy}
          onChange={(e) => update("shipping_policy", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink-muted">قوانین مرجوعی</label>
        <textarea
          className="input-field"
          rows={3}
          value={form.return_policy}
          onChange={(e) => update("return_policy", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink-muted">متن Footer</label>
        <input className="input-field" value={form.footer_text} onChange={(e) => update("footer_text", e.target.value)} />
      </div>

      <button type="submit" disabled={saving} className="btn-primary mt-2">
        {saving ? "در حال ذخیره..." : saved ? "ذخیره شد ✓" : "ذخیره تنظیمات"}
      </button>
    </form>
  );
}
