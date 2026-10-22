import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { siteUrl, stripeWebhookSecret } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Signature verification needs the raw body and Node crypto: never run this on Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, stripeWebhookSecret());
  } catch (err) {
    console.error("Stripe signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object;
    // Delayed payment methods complete with payment_status "unpaid"; wait for async_payment_succeeded.
    if (session.payment_status === "paid") {
      try {
        await grantAccess(session);
      } catch (err) {
        console.error(`Failed to grant access for ${session.id}`, err);
        // 500 makes Stripe retry; grantAccess is idempotent.
        return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function grantAccess(session: Stripe.Checkout.Session) {
  const admin = createAdminClient();
  const productId = session.metadata?.product_id;
  if (!productId) throw new Error("Session has no product_id metadata");

  const email = session.customer_details?.email ?? session.customer_email ?? session.metadata?.email;
  let userId = session.metadata?.user_id ?? null;
  const signedInBuyer = Boolean(userId);

  if (!userId) {
    if (!email) throw new Error("Guest session has no email");
    userId = await findOrCreateUser(email);
  }

  const { data: inserted, error } = await admin
    .from("purchases")
    .upsert(
      {
        user_id: userId,
        product_id: productId,
        stripe_session_id: session.id,
        amount_cents: session.amount_total ?? 0,
      },
      { onConflict: "user_id,product_id", ignoreDuplicates: true },
    )
    .select("id");
  if (error) throw error;

  // Guest buyers get a magic link to their library. Skip on webhook retries.
  if (!signedInBuyer && email && inserted.length > 0) {
    const { error: otpError } = await admin.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: `${siteUrl}/library` },
    });
    // The purchase is saved; the buyer can still sign in from /login.
    if (otpError) console.error(`Magic link email failed for session ${session.id}`, otpError);
  }
}

async function findOrCreateUser(email: string): Promise<string> {
  const admin = createAdminClient();
  const { data: existing, error: lookupError } = await admin.rpc("user_id_by_email", { p_email: email });
  if (lookupError) throw lookupError;
  if (existing) return existing as string;

  const { data, error } = await admin.auth.admin.createUser({ email, email_confirm: true });
  if (data.user) return data.user.id;

  // Lost a race with a concurrent webhook delivery: the user exists now.
  const { data: raced } = await admin.rpc("user_id_by_email", { p_email: email });
  if (raced) return raced as string;
  throw error ?? new Error("Could not create user");
}
