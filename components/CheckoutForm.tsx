"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CheckoutForm({ shippingCost }: { shippingCost: number }) {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postal_code: "",
  });

  // اگر کاربر لاگین باشد، فرم را از روی پروفایل او پیش‌پر می‌کنیم
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/account/profile");
        if (!res.ok) return;
        const data = await res.json();
        setIsLoggedIn(true);
        if (data.profile) {
          setForm({
            full_name: data.profile.full_name ?? "",
            phone: data.profile.phone ?? "",
            email: data.profile.email ?? "",
            address: data.profile.address ?? "",
            city: data.profile.city ?? "",
            postal_code: data.profile.postal_code ?? "",
          });
        } else if (data.phone) {
          setForm((f) => ({ ...f, phone: data.phone }));
        }
      } catch {
        // کاربر لاگین نیست؛ فرم خالی می‌ماند (سفارش مهمان)
      }
    }
    loadProfile();
  }, []);

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.full_name || !form.phone || !form.address) {
      setError("لطفاً نام، شماره تماس و آدرس را کامل وارد کنید.");
      return;
    }
    if (items.length === 0) {
      setError("سبد خرید شما خالی است.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/checkout/success?order=${data.order_number}`);
    } catch {
      setError("مشکلی پیش آمد. لطفاً دوباره تلاش کنید.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!isLoggedIn && (
        <p className="rounded-lg bg-ink/5 px-3 py-2 text-xs text-ink-muted">
          سفارش را به‌صورت مهمان ثبت می‌کنید.{" "}
          <Link href="/account/login" className="text-brand hover:underline">
            وارد شوید
          </Link>{" "}
          تا بتوانید بعداً وضعیت سفارش‌تان را پیگیری کنید.
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm text-ink-muted">نام و نام خانوادگی</label>
        <input
          className="input-field"
          value={form.full_name}
          onChange={(e) => update("full_name", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm text-ink-muted">شماره تماس</label>
          <input
            className="input-field"
            dir="ltr"
            placeholder="09xxxxxxxxx"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            disabled={isLoggedIn}
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
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink-muted">آدرس کامل</label>
        <textarea
          className="input-field"
          rows={3}
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm text-ink-muted">شهر</label>
          <input
            className="input-field"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
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

      {error && (
        <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand">{error}</p>
      )}

      <p className="text-xs text-ink-muted">
        در این نسخه، درگاه پرداخت آنلاین واقعی فعال نیست. سفارش شما ثبت می‌شود و تیم
        فروشگاه برای هماهنگی پرداخت و ارسال با شما تماس می‌گیرد.
      </p>

      <button type="submit" disabled={submitting} className="btn-primary mt-2">
        {submitting ? "در حال ثبت سفارش..." : "ثبت نهایی سفارش"}
      </button>
    </form>
  );
}
