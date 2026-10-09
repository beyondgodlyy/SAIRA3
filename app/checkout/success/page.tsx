import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <CheckCircle2 size={56} className="text-brand" />
      <h1 className="font-display text-2xl font-bold text-ink">سفارش شما با موفقیت ثبت شد</h1>
      {searchParams.order && (
        <p className="text-sm text-ink-muted">
          شماره سفارش: <span dir="ltr" className="font-medium text-ink">{searchParams.order}</span>
        </p>
      )}
      <p className="max-w-md text-sm text-ink-muted">
        تیم SAIRA به‌زودی برای هماهنگی پرداخت و ارسال با شما تماس می‌گیرد.
      </p>
      <Link href="/shop" className="btn-primary mt-4">
        ادامه خرید
      </Link>
    </div>
  );
}
