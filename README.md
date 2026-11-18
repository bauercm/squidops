# SquidOps

Resource platform for Azure and AI engineers: free MDX blog posts plus paid digital products
(toolkits, courses, agents) sold with Stripe Checkout and delivered from Supabase Storage.

**Stack:** Next.js 15 (App Router, TypeScript, Tailwind v4) on Vercel · Supabase (Postgres,
Auth, Storage, RLS) · Stripe Checkout · MDX in `content/blog` · beehiiv (newsletter only).

> **Blog-only for now.** `storeEnabled` in `lib/site.ts` is `false`, which hides the Products and
> Library links, the store sections of the home and About pages, and returns 404 for `/products`,
> `/library`, `/login` and `POST /api/checkout`. The store code below is intact: set it to `true`
> and mark products `status = 'live'` in Supabase to turn the store back on.

## How it fits together

| Path | What it does |
| --- | --- |
| `/`, `/blog`, `/products`, `/about` | Static/ISR pages (revalidate every 5 minutes). Products are read with the anon key; RLS only exposes `status = 'live'`. |
| `POST /api/checkout` | Form post from a product page. Creates a Stripe Checkout session with `product_id` (+ `user_id`/`email` when signed in) in metadata and 303-redirects to Stripe. Uses `stripe_price_id` if set, otherwise an inline price from `price_cents`. |
| `POST /api/stripe/webhook` | Node runtime. Verifies the signature, and on `checkout.session.completed` (paid) finds or creates the user, inserts the purchase (idempotent on `user_id, product_id`) and, for guest checkouts, emails a magic link. |
| `/library` | Signed-in only. Lists purchases joined to `product_files` (RLS: own rows only) and creates 1-hour signed download URLs. Storage RLS only lets buyers sign files of products they own. |
| `/login` | Magic link or GitHub. `/auth/confirm` verifies magic links (token hash), `/auth/callback` finishes OAuth. |
| `POST /api/newsletter` | JSON post from the home page signup form. Validates the email, drops honeypot hits, and creates a beehiiv subscription with the server-side API key (welcome email on, re-subscribes people who left). The form only renders when `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` are set. |
| `/feed.xml`, `/sitemap.xml`, `/robots.txt` | SEO. beehiiv can read `/feed.xml` for RSS-to-send. |

Database schema and policies live in `supabase/migrations`. All writes go through the service
role (webhook, seed script, Supabase dashboard); `anon`/`authenticated` have select-only access.

## Local setup

Prerequisites: Node 22 (`package.json` pins `22.x`, which Vercel also uses), Docker (for the local Supabase
stack), and the [Stripe CLI](https://docs.stripe.com/stripe-cli).

```bash
npm install
cp .env.example .env.local
```

### 1. Supabase

**Local stack (recommended):**

```bash
npx supabase start          # applies supabase/migrations, creates the product-files bucket
npx supabase status         # copy API URL, anon key and service_role key into .env.local
```

Local emails (magic links) are caught by Mailpit at http://127.0.0.1:54324.

**Or a hosted project:** link it and push the migrations, then copy the URL and keys from
Project Settings > API Keys.

```bash
npx supabase link --project-ref <ref>
npx supabase db push
```

### 2. Seed sample data

```bash
npm run seed
```

On Node 20, run `NODE_OPTIONS=--experimental-websocket npm run seed` instead: supabase-js needs
the global `WebSocket` that Node 22 provides.

Upserts 3 live sample products (one toolkit, one course, one agent) and uploads their sample
files from `supabase/seed-files` to the private `product-files` bucket. Safe to re-run. There
are no sample posts; the blog shows an empty state until the first `content/blog/*.mdx` exists.

### 3. Stripe

Use test mode keys. In a second terminal:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`.

### 4. Run

```bash
npm run dev
```

Buy a product with test card `4242 4242 4242 4242`, any future date and CVC. After checkout
you land on `/library` (or `/login` if you checked out as a guest; the magic link is in
Mailpit locally).

### GitHub sign-in (optional locally)

Create a GitHub OAuth app with callback `http://127.0.0.1:54321/auth/v1/callback`, put
`SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID` and `SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET` in
`supabase/.env`, set `enabled = true` under `[auth.external.github]` in
`supabase/config.toml`, and restart with `npx supabase stop && npx supabase start`.

## Deploy

### Supabase (production project)

1. `npx supabase link --project-ref <ref> && npx supabase db push`
2. **Authentication > URL Configuration:** Site URL = `https://your-domain`; add
   `https://your-domain/**` (and `https://*-<team>.vercel.app/**` for previews) to Redirect URLs.
3. **Authentication > Email Templates:** paste `supabase/templates/magic_link.html` into
   *Magic Link* and `supabase/templates/confirmation.html` into *Confirm signup*. Magic links must
   go to `/auth/confirm?token_hash=...` so they work when opened in a different browser (as the
   webhook's emails always are).
4. **Authentication > Sign In / Providers > GitHub:** enable with a GitHub OAuth app whose
   callback is `https://<ref>.supabase.co/auth/v1/callback`.
5. **Authentication > Emails > SMTP:** configure a real SMTP provider. The built-in sender is
   rate-limited to a few emails per hour and is not meant for production.
6. Upload real product files to the `product-files` bucket (see below).

### Stripe

1. Developers > Webhooks > Add endpoint: `https://your-domain/api/stripe/webhook`, events
   `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
2. Copy its signing secret into `STRIPE_WEBHOOK_SECRET` in Vercel.

### Vercel

1. Import the repo (framework preset: Next.js).
2. Add every variable from `.env.example` for Production (and Preview with test keys).
   `NEXT_PUBLIC_SITE_URL` must be the production URL. When it is a custom domain,
   `next.config.ts` permanently redirects `squidops.vercel.app` to it.
3. Deploy. The webhook route exports `runtime = "nodejs"` (never Edge) and `vercel.json` gives
   it a 30s max duration.

## Adding a product

There is no admin UI; use the Supabase dashboard.

1. **Storage > product-files:** upload files under a folder named after the slug, e.g.
   `my-new-toolkit/my-new-toolkit-v1.zip`.
2. **Table editor > products:** insert a row with `slug`, `name`, `tagline`, `description_md`
   (Markdown), `price_cents`, `line` (`toolkit`/`course`/`agent`), `version`, optional
   `lead_url` (free lead piece, e.g. `/blog/some-post`), and `status = 'draft'`.
3. **Table editor > product_files:** one row per file with `product_id`, `storage_path`
   (the full path inside the bucket, without the bucket name), `label` and `sort_order`.
4. Optional: create a Product + Price in Stripe and paste the `price_...` id into
   `stripe_price_id`. Without it, checkout charges `price_cents` with an inline price.
5. Set `status = 'live'`. The catalog picks it up within 5 minutes (ISR).

To ship an update, upload the new file, update `storage_path`/`label` in `product_files`, and
bump `version`. Existing buyers see it in their library immediately.

## Adding a blog post

Create `content/blog/<slug>.mdx`:

```mdx
---
title: "Problem-first title"
date: "2026-10-22"
summary: "One or two sentences for listings, RSS and meta description."
relatedProduct: "azure-landing-zone-toolkit"   # optional product slug
---

## The problem
...

## The solution
...
```

Commit and deploy; posts are statically generated.

## Scripts

| Command | |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build (needs Supabase env vars: product pages are prerendered) |
| `npm run seed` | Seed sample products and files (reads `.env.local`) |
| `npm run lint` / `npm run typecheck` | Checks |

## Out of scope for v1

Membership/paywall (beehiiv), course player, community, admin UI (use the Supabase dashboard).
