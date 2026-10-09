import { getSiteSettings } from "@/lib/data";
import CheckoutForm from "@/components/CheckoutForm";
import CheckoutSummary from "@/components/CheckoutSummary";

export const revalidate = 0;

export default async function CheckoutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-page py-10">
      <h1 className="section-title mb-8">تکمیل خرید</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="rounded-card bg-white p-5 shadow-card">
          <h2 className="mb-4 font-display text-lg font-semibold">اطلاعات ارسال</h2>
          <CheckoutForm shippingCost={settings.shipping_cost} />
        </div>
        <CheckoutSummary
          shippingCost={settings.shipping_cost}
          freeShippingThreshold={settings.free_shipping_threshold}
        />
      </div>
    </div>
  );
}
