-- Product pages need the list of included files for anyone, but product_files rows
-- (with storage paths) stay private to buyers. Expose labels only, for live products.
create function public.product_contents(p_slug text)
returns table (label text, sort_order integer)
language sql
stable
security definer
set search_path = ''
as $$
  select pf.label, pf.sort_order
  from public.product_files pf
  join public.products p on p.id = pf.product_id
  where p.slug = p_slug and p.status = 'live'
  order by pf.sort_order;
$$;

revoke all on function public.product_contents(text) from public;
grant execute on function public.product_contents(text) to anon, authenticated;

-- Used by the Stripe webhook (service role) to find an existing user for a guest checkout.
create function public.user_id_by_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1;
$$;

revoke all on function public.user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.user_id_by_email(text) to service_role;
