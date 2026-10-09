import Link from "next/link";
import { Instagram } from "lucide-react";
import type { Category, SiteSettings } from "@/lib/types";

export default function Footer({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-ivory-soft">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-xl font-bold text-brand">
            {settings.store_name}
          </h3>
          <p className="mt-3 text-sm text-ink-muted">
            {settings.footer_text ?? "«جزئیات کوچک، تفاوت‌های بزرگ.»"}
          </p>
          {settings.instagram && (
            <a
              href={`https://instagram.com/${settings.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-brand"
            >
              <Instagram size={16} />
              {settings.instagram}
            </a>
          )}
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-ink">دسته‌بندی‌ها</h4>
          <ul className="space-y-2">
            {categories.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="text-sm text-ink-muted hover:text-brand"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-ink">درباره فروشگاه</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="text-sm text-ink-muted hover:text-brand">
                درباره ما
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-ink-muted hover:text-brand">
                تماس با ما
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-sm text-ink-muted hover:text-brand">
                سوالات متداول
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-ink">پشتیبانی</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/shipping-returns" className="text-sm text-ink-muted hover:text-brand">
                ارسال و مرجوعی
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-sm text-ink-muted hover:text-brand">
                قوانین و مقررات
              </Link>
            </li>
            {settings.phone && (
              <li className="text-sm text-ink-muted">{settings.phone}</li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10 py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} {settings.store_name} — تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
