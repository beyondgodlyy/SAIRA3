import { Instagram, MapPin, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/data";

export const revalidate = 0;

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="container-page max-w-lg py-16">
      <h1 className="section-title mb-6">تماس با ما</h1>
      <div className="flex flex-col gap-4 rounded-card bg-white p-6 shadow-card">
        {settings.phone && (
          <div className="flex items-center gap-3 text-sm text-ink">
            <Phone size={18} className="text-brand" />
            <span dir="ltr">{settings.phone}</span>
          </div>
        )}
        {settings.instagram && (
          <div className="flex items-center gap-3 text-sm text-ink">
            <Instagram size={18} className="text-brand" />
            {settings.instagram}
          </div>
        )}
        {settings.address && (
          <div className="flex items-center gap-3 text-sm text-ink">
            <MapPin size={18} className="text-brand" />
            {settings.address}
          </div>
        )}
        {!settings.phone && !settings.instagram && !settings.address && (
          <p className="text-sm text-ink-muted">
            اطلاعات تماس هنوز در پنل مدیریت ثبت نشده است.
          </p>
        )}
      </div>
    </div>
  );
}
