export type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  color: string | null;
  stock: number;
  is_new: boolean;
  is_bestseller: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  category?: Category | null;
  product_images?: ProductImage[];
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

export type Customer = {
  id: string;
  user_id: string | null;
  full_name: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};

export type Order = {
  id: string;
  order_number: string;
  customer_id: string | null;
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_note: string | null;
  created_at: string;
  customer?: Customer | null;
  order_items?: OrderItem[];
};

export type HomepageContent = {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  hero_cta_label: string;
  hero_cta_url: string;
  about_text: string | null;
  promo_text: string | null;
};

export type SiteSettings = {
  id: number;
  store_name: string;
  phone: string | null;
  instagram: string | null;
  address: string | null;
  shipping_cost: number;
  free_shipping_threshold: number | null;
  return_policy: string | null;
  shipping_policy: string | null;
  footer_text: string | null;
};

export type CartLine = {
  product_id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
};
