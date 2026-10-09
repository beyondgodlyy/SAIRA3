import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateOrderNumber } from "@/lib/utils/format";
import { getCurrentCustomerId } from "@/lib/customer-session";

type IncomingItem = { product_id: string; quantity: number };

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer, items } = body as {
    customer: {
      full_name: string;
      phone: string;
      email?: string;
      address: string;
      city?: string;
      postal_code?: string;
    };
    items: IncomingItem[];
  };

  if (!customer?.full_name || !customer?.phone || !customer?.address) {
    return NextResponse.json(
      { error: "اطلاعات مشتری ناقص است." },
      { status: 400 }
    );
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "سبد خرید خالی است." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // خواندن قیمت و موجودی واقعی محصولات از دیتابیس (هرگز به قیمت ارسالی از کلاینت اعتماد نمی‌شود)
  const productIds = items.map((i) => i.product_id);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, stock, is_active")
    .in("id", productIds);

  if (productsError || !products) {
    return NextResponse.json(
      { error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }

  // بررسی موجودی
  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id);
    if (!product || !product.is_active) {
      return NextResponse.json(
        { error: "یکی از محصولات سبد خرید دیگر در دسترس نیست." },
        { status: 400 }
      );
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `موجودی «${product.name}» کافی نیست.` },
        { status: 400 }
      );
    }
  }

  const { data: settings } = await supabase
    .from("site_settings")
    .select("shipping_cost, free_shipping_threshold")
    .eq("id", 1)
    .maybeSingle();

  const subtotal = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.product_id)!;
    return sum + product.price * item.quantity;
  }, 0);

  const shippingCost =
    settings?.free_shipping_threshold != null &&
    subtotal >= settings.free_shipping_threshold
      ? 0
      : settings?.shipping_cost ?? 0;

  // اگر کاربر لاگین است، سفارش را به پروفایل او متصل می‌کنیم تا در
  // «سفارش‌های من» قابل مشاهده باشد؛ در غیر این صورت سفارش مهمان ثبت می‌شود.
  const loggedInCustomerId = getCurrentCustomerId();
  let customerRow;

  if (loggedInCustomerId) {
    const { data: updatedProfile, error: updateError } = await supabase
      .from("customers")
      .update({
        full_name: customer.full_name,
        phone: customer.phone,
        email: customer.email || null,
        address: customer.address,
        city: customer.city || null,
        postal_code: customer.postal_code || null,
      })
      .eq("id", loggedInCustomerId)
      .select()
      .single();

    if (updateError || !updatedProfile) {
      return NextResponse.json(
        { error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید." },
        { status: 500 }
      );
    }
    customerRow = updatedProfile;
  } else {
    // سفارش مهمان: مشتری جدید و بدون اتصال به حساب کاربری
    const { data: guestProfile, error: guestError } = await supabase
      .from("customers")
      .insert({
        full_name: customer.full_name,
        phone: customer.phone,
        email: customer.email || null,
        address: customer.address,
        city: customer.city || null,
        postal_code: customer.postal_code || null,
      })
      .select()
      .single();

    if (guestError || !guestProfile) {
      return NextResponse.json(
        { error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید." },
        { status: 500 }
      );
    }
    customerRow = guestProfile;
  }

  const orderNumber = generateOrderNumber();

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_id: customerRow.id,
      status: "pending",
      subtotal,
      shipping_cost: shippingCost,
      total: subtotal + shippingCost,
    })
    .select()
    .single();

  if (orderError || !orderRow) {
    return NextResponse.json(
      { error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }

  const orderItemsPayload = items.map((item) => {
    const product = products.find((p) => p.id === item.product_id)!;
    return {
      order_id: orderRow.id,
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      quantity: item.quantity,
    };
  });

  await supabase.from("order_items").insert(orderItemsPayload);

  // کاهش موجودی هر محصول
  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id)!;
    await supabase
      .from("products")
      .update({ stock: product.stock - item.quantity })
      .eq("id", product.id);
  }

  return NextResponse.json({ order_number: orderNumber, order_id: orderRow.id });
}
