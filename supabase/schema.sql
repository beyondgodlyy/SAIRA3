-- ============================================================
-- SAIRA — Schema پایگاه داده (Supabase / PostgreSQL)
-- این فایل را در Supabase SQL Editor اجرا کنید.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- دسته‌بندی‌ها
-- ------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- محصولات
-- ------------------------------------------------------------
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12,0) not null,          -- تومان، بدون اعشار
  compare_at_price numeric(12,0),        -- قیمت قبل از تخفیف (اختیاری)
  category_id uuid references categories(id) on delete set null,
  color text,
  stock int not null default 0,
  is_new boolean not null default false,
  is_bestseller boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_active on products(is_active);

-- ------------------------------------------------------------
-- تصاویر محصول (چند تصویر برای هر محصول)
-- ------------------------------------------------------------
create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_images_product on product_images(product_id);

-- ------------------------------------------------------------
-- سفارش‌ها
-- ------------------------------------------------------------
create type order_status as enum (
  'pending',      -- در انتظار
  'processing',   -- در حال پردازش
  'shipped',      -- ارسال شده
  'delivered',    -- تحویل شده
  'cancelled'     -- لغو شده
);

create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null, -- قدیمی/اختیاری، برای ورود با ایمیل استفاده نمی‌شود
  full_name text,          -- در اولین ورود با شماره تلفن هنوز نام گرفته نشده
  phone text not null,
  email text,
  address text,          -- در زمان ثبت‌نام ممکن است هنوز آدرس وجود نداشته باشد
  city text,
  postal_code text,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_customers_user_id on customers(user_id) where user_id is not null;
create index if not exists idx_customers_phone on customers(phone);

-- ------------------------------------------------------------
-- کدهای تایید پیامکی (OTP) برای ورود/عضویت مشتری با شماره تلفن
-- ------------------------------------------------------------
create table if not exists otp_codes (
  id uuid primary key default uuid_generate_v4(),
  phone text not null,
  code_hash text not null,     -- کد به‌صورت هش‌شده ذخیره می‌شود، نه متن ساده
  attempts int not null default 0,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_otp_codes_phone on otp_codes(phone);

create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  customer_id uuid references customers(id) on delete set null,
  status order_status not null default 'pending',
  subtotal numeric(12,0) not null default 0,
  shipping_cost numeric(12,0) not null default 0,
  total numeric(12,0) not null default 0,
  payment_note text default 'پرداخت آنلاین واقعی در این نسخه فعال نیست.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,   -- snapshot از نام محصول در زمان خرید
  unit_price numeric(12,0) not null,
  quantity int not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order on order_items(order_id);

-- ------------------------------------------------------------
-- محتوای صفحه اصلی (CMS ساده)
-- ------------------------------------------------------------
create table if not exists homepage_content (
  id int primary key default 1,
  hero_title text not null default 'جزئیات کوچک، تفاوت‌های بزرگ',
  hero_subtitle text not null default 'اکسسوری‌هایی برای کامل کردن استایل تو.',
  hero_image_url text,
  hero_cta_label text not null default 'مشاهده محصولات',
  hero_cta_url text not null default '/shop',
  about_text text default 'SAIRA برندی است برای زنانی که ظرافت را در جزئیات می‌بینند.',
  promo_text text,
  constraint single_row check (id = 1)
);

insert into homepage_content (id) values (1) on conflict (id) do nothing;

-- ------------------------------------------------------------
-- تنظیمات فروشگاه
-- ------------------------------------------------------------
create table if not exists site_settings (
  id int primary key default 1,
  store_name text not null default 'SAIRA',
  phone text,
  instagram text,
  address text,
  shipping_cost numeric(12,0) not null default 0,
  free_shipping_threshold numeric(12,0),
  return_policy text,
  shipping_policy text,
  footer_text text default '«جزئیات کوچک، تفاوت‌های بزرگ.»',
  constraint single_row_settings check (id = 1)
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ============================================================
-- Row Level Security
-- قانون کلی: خواندن عمومی فقط برای داده‌های "فعال" آزاد است.
-- هرگونه نوشتن (insert/update/delete) فقط از طریق Server
-- با Service Role Key انجام می‌شود (که RLS را دور می‌زند)،
-- بنابراین برای عموم Policy نوشتنی تعریف نمی‌کنیم.
-- ============================================================

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table homepage_content enable row level security;
alter table site_settings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table customers enable row level security;
alter table otp_codes enable row level security;

create policy "public read active categories"
  on categories for select
  using (is_active = true);

create policy "public read active products"
  on products for select
  using (is_active = true);

create policy "public read product images"
  on product_images for select
  using (
    exists (
      select 1 from products p
      where p.id = product_images.product_id and p.is_active = true
    )
  );

create policy "public read homepage content"
  on homepage_content for select
  using (true);

create policy "public read site settings"
  on site_settings for select
  using (true);

-- سفارش‌ها و مشتریان: هیچ خواندن یا نوشتن عمومی مجاز نیست.
-- فقط از طریق API با Service Role (سرور) قابل دسترسی است.
-- (عمداً هیچ Policy برای این جداول تعریف نشده)
--
-- توجه درباره حساب کاربری مشتری: صفحات «حساب من» و «سفارش‌های من»
-- هم از همین قانون پیروی می‌کنند — RLS برای این جداول باز نمی‌شود.
-- به‌جای آن، Route Handlerهای مربوطه (app/api/account/*) ابتدا با
-- createServerSupabase() هویت کاربر لاگین‌شده را از روی Session
-- تایید می‌کنند و سپس با Service Role Key فقط داده‌های متعلق به
-- همان user_id را می‌خوانند/می‌نویسند. این یعنی کنترل دسترسی در
-- لایه برنامه انجام می‌شود، نه در لایه دیتابیس.

-- ------------------------------------------------------------
-- Trigger برای به‌روزرسانی updated_at
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_products_updated_at
before update on products
for each row execute function set_updated_at();

create trigger trg_orders_updated_at
before update on orders
for each row execute function set_updated_at();
