import "server-only";

/**
 * ارسال پیامک کد تایید.
 *
 * پیش‌فرض این تابع از سرویس Kavenegar (کاوه‌نگار) استفاده می‌کند، چون
 * برای ارسال OTP در ایران رایج و ساده است و نیازی به تایید قالب پیام
 * عمومی ندارد (از متد Verify Lookup استفاده می‌کند).
 *
 * برای استفاده:
 * ۱. در kavenegar.com ثبت‌نام کنید و یک API Key بگیرید.
 * ۲. یک «الگوی OTP» (Verify Template) بسازید — معمولاً چیزی شبیه:
 *    «کد تایید شما در SAIRA: %token%» — و نامش را همان‌جا ثبت کنید.
 * ۳. مقادیر زیر را در .env.local قرار دهید:
 *    SMS_PROVIDER_API_KEY=...
 *    SMS_OTP_TEMPLATE=verify   (یا هر نامی که برای الگو گذاشتید)
 *
 * اگر از سرویس دیگری استفاده می‌کنید (مثلاً ippanel یا Farapayamak)،
 * فقط کافیست بدنه‌ی تابع sendOtpSms را با API همان سرویس جایگزین کنید؛
 * بقیه‌ی پروژه به این تابع کاری ندارد.
 */
export async function sendOtpSms(phone: string, code: string): Promise<void> {
  const apiKey = process.env.SMS_PROVIDER_API_KEY;
  const template = process.env.SMS_OTP_TEMPLATE;

  if (!apiKey || !template) {
    // در محیط توسعه (بدون تنظیم سرویس پیامک واقعی)، کد را در Log سرور
    // نمایش می‌دهیم تا بتوانید بدون هزینه‌ی پیامک واقعی تست کنید.
    console.warn(
      `⚠️ [SMS در حالت توسعه] SMS_PROVIDER_API_KEY تنظیم نشده. کد تایید برای ${phone}: ${code}`
    );
    return;
  }

  const url = new URL(`https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json`);
  url.searchParams.set("receptor", phone);
  url.searchParams.set("token", code);
  url.searchParams.set("template", template);

  const res = await fetch(url.toString(), { method: "GET" });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ارسال پیامک ناموفق بود: ${res.status} ${text}`);
  }
}
