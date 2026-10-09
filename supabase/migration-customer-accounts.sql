-- ============================================================
-- SAIRA — Migration: افزودن حساب کاربری مشتری
-- اگر قبلاً schema.sql را اجرا کرده‌اید، فقط همین فایل را در
-- Supabase SQL Editor اجرا کنید (نیازی به اجرای دوباره schema.sql نیست).
-- اگر تازه پروژه را راه‌اندازی می‌کنید، همین تغییرات از قبل در
-- schema.sql جدید وجود دارد و نیازی به این فایل نیست.
-- ============================================================

-- اتصال مشتری به حساب کاربری Supabase Auth (اختیاری — سفارش مهمان هم مجاز است)
alter table customers add column if not exists user_id uuid references auth.users(id) on delete set null;

create unique index if not exists idx_customers_user_id
  on customers(user_id) where user_id is not null;

-- اجازه بده آدرس در زمان ثبت‌نام (قبل از اولین سفارش) خالی باشد
alter table customers alter column address drop not null;
