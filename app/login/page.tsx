import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { safeNext } from "@/lib/redirect";
import { storeEnabled } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{ next?: string; error?: string; checkout?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  if (!storeEnabled) notFound();
  const params = await searchParams;
  // Origin is irrelevant here: only relative paths pass.
  const next = safeNext(params.next ?? null, "null");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next);

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-muted">
        Sign in to download the products you own. No password needed.
      </p>
      {params.checkout === "success" && (
        <p className="mt-6 rounded-lg border border-accent/40 bg-card p-4 text-sm" role="status">
          Thanks for your purchase! We&apos;ve emailed you a sign-in link. Or sign in below with the
          email you used at checkout.
        </p>
      )}
      {params.error && (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400" role="alert">
          That sign-in link is invalid or expired. Request a new one below.
        </p>
      )}
      <div className="mt-8">
        <LoginForm next={next} />
      </div>
    </div>
  );
}
