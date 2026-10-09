const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** تبدیل اعداد لاتین به اعداد فارسی */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** فرمت قیمت به تومان با جداکننده هزارگان و اعداد فارسی، مثل «۱٬۲۹۰٬۰۰۰ تومان» */
export function formatPrice(amount: number): string {
  const withSeparators = Math.round(amount)
    .toLocaleString("en-US")
    .replace(/,/g, "٬");
  return `${toPersianDigits(withSeparators)} تومان`;
}

/** درصد تخفیف بین قیمت اصلی و قیمت قبل از تخفیف */
export function discountPercent(price: number, compareAt: number | null): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/** فرمت تاریخ میلادی ساده به صورت خوانا (برای Admin) */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return toPersianDigits(
    d.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" })
  );
}

/** ساخت شماره سفارش یکتای خوانا، مثل SAIRA-240915-4821 */
export function generateOrderNumber(): string {
  const date = new Date();
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SAIRA-${y}${m}${d}-${rand}`;
}
