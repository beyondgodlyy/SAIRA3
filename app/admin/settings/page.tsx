import { getSiteSettings } from "@/lib/data";
import AdminSettingsForm from "@/components/AdminSettingsForm";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="section-title mb-6">تنظیمات فروشگاه</h1>
      <AdminSettingsForm settings={settings} />
    </div>
  );
}
