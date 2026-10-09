import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { getCategories, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "SAIRA | جواهرات و اکسسوری زنانه",
  description:
    "SAIRA — اکسسوری‌ها و جواهرات ظریف زنانه. جزئیات کوچک، تفاوت‌های بزرگ.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <html lang="fa" dir="rtl">
      <body>
        <CartProvider>
          <WishlistProvider>
            <Navbar categories={categories} storeName={settings.store_name} />
            <main className="min-h-[60vh]">{children}</main>
            <Footer settings={settings} categories={categories} />
            <CartDrawer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
