-- SquidOps v1 schema: products, product files, purchases.
-- All writes go through the service role (Stripe webhook, seed script, Supabase dashboard).

create type public.product_line as enum ('toolkit', 'course', 'agent');
create type public.product_status as enum ('draft', 'live');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  tagline text not null default '',
  description_md text not null default '',
  price_cents integer not null check (price_cents >= 0),
  -- Optional: when null, checkout builds an inline price from price_cents.
  stripe_price_id text,
  line public.product_line not null,
  status public.product_status not null default 'draft',
  version text not null default '1.0.0',
  -- Optional free lead piece (blog post, PDF, repo) shown on the product page.
  lead_url text,
  created_at timestamptz not null default now()
);

create table public.product_files (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null unique,
  label text not null,
  sort_order integer not null default 0
);

create index product_files_product_id_idx on public.product_files (product_id, sort_order);

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  stripe_session_id text not null unique,
  amount_cents integer not null check (amount_cents >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index purchases_product_id_idx on public.purchases (product_id);

-- Row Level Security -------------------------------------------------------

alter table public.products enable row level security;
alter table public.product_files enable row level security;
alter table public.purchases enable row level security;

-- Only the service role writes. RLS already blocks writes without policies;
-- revoking the grants makes that explicit.
revoke insert, update, delete, truncate on public.products, public.product_files, public.purchases
  from anon, authenticated;

create policy "Live products are public"
  on public.products for select
  to anon, authenticated
  using (status = 'live');

-- Buyers keep seeing products they own even if a product is later unpublished.
create policy "Buyers can read products they own"
  on public.products for select
  to authenticated
  using (
    exists (
      select 1 from public.purchases p
      where p.product_id = products.id and p.user_id = (select auth.uid())
    )
  );

create policy "Buyers can read files of products they own"
  on public.product_files for select
  to authenticated
  using (
    exists (
      select 1 from public.purchases p
      where p.product_id = product_files.product_id and p.user_id = (select auth.uid())
    )
  );

create policy "Users can read their own purchases"
  on public.purchases for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Storage ------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-files', 'product-files', false)
on conflict (id) do nothing;

-- Lets a buyer create signed URLs for objects listed in product_files for a
-- product they purchased. Uploads remain service-role only.
create policy "Buyers can read purchased product files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'product-files'
    and exists (
      select 1
      from public.product_files pf
      join public.purchases p on p.product_id = pf.product_id
      where pf.storage_path = storage.objects.name
        and p.user_id = (select auth.uid())
    )
  );
