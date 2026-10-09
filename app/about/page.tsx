import { getHomepageContent } from "@/lib/data";

export const revalidate = 0;

export default async function AboutPage() {
  const content = await getHomepageContent();

  return (
    <div className="container-page max-w-2xl py-16">
      <h1 className="section-title mb-6">درباره ما</h1>
      <p className="leading-8 text-ink-muted">
        {content.about_text ??
          "SAIRA برندی است برای زنانی که ظرافت را در جزئیات می‌بینند. هر قطعه با دقت انتخاب می‌شود تا استایل روزمره شما را کامل کند."}
      </p>
    </div>
  );
}
