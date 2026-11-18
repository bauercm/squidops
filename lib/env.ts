// Central place to read env vars so a missing one fails loudly with its name.
function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const supabaseUrl = () =>
  required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
export const supabaseAnonKey = () =>
  required("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const supabaseServiceRoleKey = () =>
  required("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);

export const stripeSecretKey = () => required("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY);
export const stripeWebhookSecret = () =>
  required("STRIPE_WEBHOOK_SECRET", process.env.STRIPE_WEBHOOK_SECRET);

// Server only. The signup form renders only when both are set.
export const beehiivApiKey = () => required("BEEHIIV_API_KEY", process.env.BEEHIIV_API_KEY);
export const beehiivPublicationId = () =>
  required("BEEHIIV_PUBLICATION_ID", process.env.BEEHIIV_PUBLICATION_ID);
export const newsletterEnabled = Boolean(
  process.env.BEEHIIV_API_KEY && process.env.BEEHIIV_PUBLICATION_ID,
);
