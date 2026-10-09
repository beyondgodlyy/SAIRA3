-- ============================================================
-- SAIRA — Migration: ورود مشتری با شماره تلفن + کد تایید پیامکی
-- این فایل را در Supabase SQL Editor اجرا کنید.
-- اگر قبلاً migration-customer-accounts.sql را اجرا کرده‌اید،
-- مشکلی ندارد؛ این فایل مستقل و ایمن برای اجرای دوباره است.
-- ============================================================

-- نام کامل دیگر در لحظه‌ی ثبت‌نام (اولین ورود با تلفن) اجباری نیست
alter table customers alter column full_name drop not null;

-- شماره تلفن برای جستجوی سریع ایندکس می‌شود (عمداً Unique نیست، چون
-- سفارش‌های مهمانِ قبلی ممکن است چند بار با یک شماره ثبت شده باشند)
create index if not exists idx_customers_phone on customers(phone);

-- جدول کدهای تایید پیامکی
create table if not exists otp_codes (
  id uuid primary key default uuid_generate_v4(),
  phone text not null,
  code_hash text not null,
  attempts int not null default 0,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_otp_codes_phone on otp_codes(phone);

alter table otp_codes enable row level security;
-- عمداً هیچ Policy عمومی تعریف نشده — فقط از طریق Service Role در سرور قابل دسترسی است.
