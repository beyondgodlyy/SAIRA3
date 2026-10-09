const FAQS = [
  {
    q: "چطور می‌توانم سفارش خود را پیگیری کنم؟",
    a: "پس از ثبت سفارش، تیم SAIRA برای هماهنگی ارسال و پیگیری با شما تماس می‌گیرد.",
  },
  {
    q: "آیا امکان مرجوع کردن محصول وجود دارد؟",
    a: "بله، شرایط مرجوعی در صفحه «ارسال و مرجوعی» توضیح داده شده است.",
  },
  {
    q: "هزینه ارسال چقدر است؟",
    a: "هزینه ارسال بر اساس تنظیمات فروشگاه محاسبه و در مرحله تکمیل خرید نمایش داده می‌شود.",
  },
  {
    q: "آیا پرداخت آنلاین امکان‌پذیر است؟",
    a: "در نسخه فعلی، سفارش شما ثبت می‌شود و هماهنگی پرداخت پس از تماس تیم فروشگاه انجام می‌شود.",
  },
];

export default function FaqPage() {
  return (
    <div className="container-page max-w-2xl py-16">
      <h1 className="section-title mb-8">سوالات متداول</h1>
      <div className="flex flex-col gap-4">
        {FAQS.map((item) => (
          <div key={item.q} className="rounded-card bg-white p-5 shadow-card">
            <p className="mb-2 font-medium text-ink">{item.q}</p>
            <p className="text-sm leading-7 text-ink-muted">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
