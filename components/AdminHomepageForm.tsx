"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HomepageContent } from "@/lib/types";

export default function AdminHomepageForm({ content }: { content: HomepageContent }) {
  const router = useRouter();
  const [form, setForm] = useState({
    hero_title: content.hero_title,
    hero_subtitle: content.hero_subtitle,
    hero_image_url: content.hero_image_url ?? "",
    hero_cta_label: content.hero_cta_label,
    hero_cta_url: content.hero_cta_url,
    about_text: content.about_text ?? "",
    promo_text: content.promo_text ?? "",
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

    const res = await fetch("/api/admin/homepage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
        <label className="mb-1 block text-sm text-ink-muted">عنوان اصلی (Hero)</label>
        <input className="input-field" value={form.hero_title} onChange={(e) => update("hero_title", e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-ink-muted">توضیح کوتاه</label>
        <input className="input-field" value={form.hero_subtitle} onChange={(e) => update("hero_subtitle", e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-ink-muted">آدرس تصویر Hero</label>
        <input
          dir="ltr"
          className="input-field"
          value={form.hero_image_url}
          onChange={(e) => update("hero_image_url", e.target.value)}
          placeholder="/placeholders/hero.svg یا آدرس Supabase Storage"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-ink-muted">متن دکمه CTA</label>
          <input className="input-field" value={form.hero_cta_label} onChange={(e) => update("hero_cta_label", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-muted">لینک دکمه CTA</label>
          <input dir="ltr" className="input-field" value={form.hero_cta_url} onChange={(e) => update("hero_cta_url", e.target.value)} />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-ink-muted">متن «درباره برند»</label>
        <textarea className="input-field" rows={4} value={form.about_text} onChange={(e) => update("about_text", e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-ink-muted">متن تبلیغاتی (اختیاری)</label>
        <input className="input-field" value={form.promo_text} onChange={(e) => update("promo_text", e.target.value)} />
      </div>

      <button type="submit" disabled={saving} className="btn-primary mt-2">
        {saving ? "در حال ذخیره..." : saved ? "ذخیره شد ✓" : "ذخیره تغییرات"}
      </button>
    </form>
  );
}
