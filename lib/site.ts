// The store (products, checkout, library, sign-in) is built but switched off while the site is
// blog-only. Flip to true to bring back the nav links, home sections and /products, /library,
// /login and /api/checkout. Products also need status = 'live' in Supabase to show.
export const storeEnabled = false;

export const site = {
  name: "SquidOps",
  tagline: "Practical resources for Azure and AI engineers.",
  description: storeEnabled
    ? "Free guides plus toolkits, courses, and agents for engineers building on Azure and shipping AI to production."
    : "Free, problem-first guides for engineers building on Azure and shipping AI to production.",
};

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function formatDate(iso: string) {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
