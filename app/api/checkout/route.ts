import { NextResponse, type NextRequest } from "next/server";
import { getProduct } from "@/lib/products";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Form POST from a product page. Redirects (303) to Stripe Checkout.
export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const form = await request.formData();
  const slug = String(form.get("slug") ?? "");

  const product = await getProduct(slug);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: owned } = await supabase
      .from("purchases")
      .select("id")
      .eq("product_id", product.id)
      .maybeSingle();
    if (owned) return NextResponse.redirect(`${origin}/library`, 303);
  }

  const lineItem = product.stripe_price_id
    ? { price: product.stripe_price_id, quantity: 1 }
    : {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: product.price_cents,
          product_data: { name: product.name, description: product.tagline || undefined },
        },
      };

  const metadata: Record<string, string> = { product_id: product.id };
  if (user) metadata.user_id = user.id;
  if (user?.email) metadata.email = user.email;

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    line_items: [lineItem],
    customer_email: user?.email ?? undefined,
    metadata,
    payment_intent_data: { metadata },
    allow_promotion_codes: true,
    success_url: `${origin}/library?checkout=success`,
    cancel_url: `${origin}/products/${product.slug}`,
  });

  return NextResponse.redirect(session.url!, 303);
}
