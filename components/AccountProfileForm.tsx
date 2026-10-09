"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Customer } from "@/lib/types";

export default function AccountProfileForm({
  profile,
  phone,
}: {
  profile: Customer | null;
  phone: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    address: profile?.address ?? "",
    city: profile?.city ?? "",
    postal_code: profile?.postal_code ?? "",
    email: profile?.email ?? "",
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

    const res = await fetch("/api/account/profile", {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-card bg-white p-6 shadow-card">
      <div>
        <label className="mb-1 block text-sm text-ink-muted">شماره تلفن (شناسه ورود)</label>
        <input className="input-field" dir="ltr" value={phone} disabled />
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink-muted">نام و نام خانوادگی</label>
        <input
          className="input-field"
          value={form.full_name}
          onChange={(e) => update("full_name", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink-muted">ایمیل (اختیاری)</label>
        <input
          className="input-field"
          dir="ltr"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink-muted">آدرس</label>
        <textarea
          className="input-field"
          rows={3}
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-ink-muted">شهر</label>
          <input className="input-field" value={form.city} onChange={(e) => update("city", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-muted">کد پستی</label>
          <input
            className="input-field"
            dir="ltr"
            value={form.postal_code}
            onChange={(e) => update("postal_code", e.target.value)}
          />
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary mt-2">
        {saving ? "در حال ذخیره..." : saved ? "ذخیره شد ✓" : "ذخیره اطلاعات"}
      </button>
    </form>
  );
}
