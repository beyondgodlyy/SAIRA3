import { getHomepageContent } from "@/lib/data";
import AdminHomepageForm from "@/components/AdminHomepageForm";

export const revalidate = 0;

export default async function AdminHomepagePage() {
  const content = await getHomepageContent();

  return (
    <div>
      <h1 className="section-title mb-6">مدیریت صفحه اصلی</h1>
      <AdminHomepageForm content={content} />
    </div>
  );
}
