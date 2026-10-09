import { getSiteSettings } from "@/lib/data";
import { formatPrice } from "@/lib/utils/format";

export const revalidate = 0;

export default async function ShippingReturnsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-page max-w-2xl py-16">
      <h1 className="section-title mb-8">ارسال و مرجوعی</h1>

      <section className="mb-8 rounded-card bg-white p-6 shadow-card">
        <h2 className="mb-3 font-display text-lg font-semibold">ارسال سفارش</h2>
        <p className="leading-7 text-ink-muted">
          {settings.shipping_policy ??
            `هزینه ارسال ${formatPrice(settings.shipping_cost)} است${
              settings.free_shipping_threshold
                ? ` و برای خریدهای بالای ${formatPrice(settings.free_shipping_threshold)} رایگان می‌باشد.`
                : "."
            }`}
        </p>
      </section>

      <section className="rounded-card bg-white p-6 shadow-card">
        <h2 className="mb-3 font-display text-lg font-semibold">مرجوعی</h2>
        <p className="leading-7 text-ink-muted">
          {settings.return_policy ??
            "در صورت وجود مشکل در محصول دریافتی، حداکثر تا ۷ روز پس از تحویل با پشتیبانی تماس بگیرید."}
        </p>
      </section>
    </div>
  );
}
