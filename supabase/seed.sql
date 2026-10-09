-- ============================================================
-- SAIRA — داده‌های نمونه (Seed)
-- بعد از اجرای schema.sql این فایل را اجرا کنید.
-- تمام این محصولات از پنل مدیریت قابل ویرایش/حذف هستند.
-- ============================================================

-- دسته‌بندی‌ها
insert into categories (name, slug, sort_order) values
  ('گردنبند', 'necklace', 1),
  ('دستبند', 'bracelet', 2),
  ('انگشتر', 'ring', 3),
  ('گوشواره', 'earring', 4),
  ('پابند', 'anklet', 5),
  ('عینک', 'sunglasses', 6)
on conflict (slug) do nothing;

-- محصولات: گردنبند
insert into products (name, slug, description, price, compare_at_price, category_id, stock, is_new, is_bestseller)
select 'گردنبند زنجیری ظریف', 'necklace-fine-chain',
  'گردنبندی ظریف و مینیمال برای تکمیل استایل روزمره.',
  1290000, null, c.id, 12, true, false
from categories c where c.slug = 'necklace'
on conflict (slug) do nothing;

insert into products (name, slug, description, price, compare_at_price, category_id, stock, is_bestseller)
select 'گردنبند قلب', 'necklace-heart',
  'طرحی ظریف با آویز قلب، مناسب هدیه و استفاده روزمره.',
  1450000, 1690000, c.id, 8, true
from categories c where c.slug = 'necklace'
on conflict (slug) do nothing;

insert into products (name, slug, description, price, category_id, stock)
select 'گردنبند چندلایه', 'necklace-multilayer',
  'ترکیب چند زنجیر ظریف در یک طراحی مدرن.',
  1690000, c.id, 6
from categories c where c.slug = 'necklace'
on conflict (slug) do nothing;

insert into products (name, slug, description, price, category_id, stock, is_new)
select 'گردنبند مرواریدی', 'necklace-pearl',
  'گردنبندی کلاسیک با نگین‌های مرواریدی.',
  1890000, c.id, 5, true
from categories c where c.slug = 'necklace'
on conflict (slug) do nothing;

-- محصولات: دستبند
insert into products (name, slug, description, price, category_id, stock, is_bestseller)
select 'دستبند زنجیری', 'bracelet-chain',
  'دستبندی مینیمال با زنجیر ظریف طلایی.',
  990000, c.id, 15, true
from categories c where c.slug = 'bracelet'
on conflict (slug) do nothing;

insert into products (name, slug, description, price, category_id, stock)
select 'دستبند ظریف', 'bracelet-delicate',
  'دستبندی ساده و شیک برای استفاده روزانه.',
  890000, c.id, 20
from categories c where c.slug = 'bracelet'
on conflict (slug) do nothing;

insert into products (name, slug, description, price, category_id, stock, is_new)
select 'دستبند مهره‌ای', 'bracelet-beaded',
  'دستبندی رنگارنگ با مهره‌های ظریف.',
  760000, c.id, 2, true
from categories c where c.slug = 'bracelet'
on conflict (slug) do nothing;

-- محصولات: انگشتر
insert into products (name, slug, description, price, category_id, stock)
select 'انگشتر مینیمال', 'ring-minimal',
  'انگشتری ساده و ظریف، مناسب لایه‌بندی با انگشترهای دیگر.',
  650000, c.id, 18
from categories c where c.slug = 'ring'
on conflict (slug) do nothing;

insert into products (name, slug, description, price, compare_at_price, category_id, stock, is_bestseller)
select 'انگشتر نگین‌دار', 'ring-stone',
  'انگشتری شیک با نگین مرکزی.',
  980000, 1190000, c.id, 9, true
from categories c where c.slug = 'ring'
on conflict (slug) do nothing;

insert into products (name, slug, description, price, category_id, stock)
select 'انگشتر چندلایه', 'ring-multilayer',
  'ست انگشتر با طراحی چندلایه مدرن.',
  1120000, c.id, 7
from categories c where c.slug = 'ring'
on conflict (slug) do nothing;

-- محصولات: گوشواره
insert into products (name, slug, description, price, category_id, stock, is_new)
select 'گوشواره حلقه‌ای', 'earring-hoop',
  'گوشواره حلقه‌ای کلاسیک و همیشگی.',
  790000, c.id, 14, true
from categories c where c.slug = 'earring'
on conflict (slug) do nothing;

insert into products (name, slug, description, price, category_id, stock)
select 'گوشواره مینیمال', 'earring-minimal',
  'طراحی ساده برای استفاده روزمره.',
  650000, c.id, 16
from categories c where c.slug = 'earring'
on conflict (slug) do nothing;

insert into products (name, slug, description, price, compare_at_price, category_id, stock, is_bestseller)
select 'گوشواره نگین‌دار', 'earring-stone',
  'گوشواره‌ای شیک با نگین‌های ظریف، مناسب مجالس.',
  980000, 1150000, c.id, 4, true
from categories c where c.slug = 'earring'
on conflict (slug) do nothing;

-- محصولات: پابند
insert into products (name, slug, description, price, category_id, stock)
select 'پابند زنجیری', 'anklet-chain',
  'پابندی ظریف با زنجیر مینیمال.',
  590000, c.id, 11
from categories c where c.slug = 'anklet'
on conflict (slug) do nothing;

insert into products (name, slug, description, price, category_id, stock, is_new)
select 'پابند ظریف', 'anklet-delicate',
  'طراحی ساده و سبک برای فصل تابستان.',
  540000, c.id, 13, true
from categories c where c.slug = 'anklet'
on conflict (slug) do nothing;

-- محصولات: عینک
insert into products (name, slug, description, price, category_id, stock, is_bestseller)
select 'عینک فریم مشکی', 'sunglasses-black',
  'عینک آفتابی کلاسیک با فریم مشکی مات.',
  2190000, c.id, 6, true
from categories c where c.slug = 'sunglasses'
on conflict (slug) do nothing;

insert into products (name, slug, description, price, category_id, stock, is_new)
select 'عینک فریم Cherry', 'sunglasses-cherry',
  'عینکی متمایز با فریم قرمز شرابی، هماهنگ با هویت برند.',
  2390000, c.id, 3, true
from categories c where c.slug = 'sunglasses'
on conflict (slug) do nothing;

insert into products (name, slug, description, price, category_id, stock)
select 'عینک فریم ظریف', 'sunglasses-thin',
  'فریمی نازک و مینیمال برای استایل روزمره.',
  1990000, c.id, 8
from categories c where c.slug = 'sunglasses'
on conflict (slug) do nothing;

-- اتصال تصویر Placeholder برای هر محصول (یک تصویر پیش‌فرض بر اساس دسته)
-- توجه: این آدرس‌ها را بعداً از پنل مدیریت با عکس واقعی جایگزین کنید.
insert into product_images (product_id, url, alt, sort_order)
select p.id, '/placeholders/' || c.slug || '.svg', p.name, 0
from products p
join categories c on c.id = p.category_id
where not exists (
  select 1 from product_images pi where pi.product_id = p.id
);
