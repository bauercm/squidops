import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Product } from "@/lib/types";

const COLUMNS =
  "id, slug, name, tagline, description_md, price_cents, stripe_price_id, line, status, version, lead_url, created_at";

export async function getLiveProducts(limit?: number): Promise<Product[]> {
  let query = createPublicClient()
    .from("products")
    .select(COLUMNS)
    .eq("status", "live")
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const { data, error } = await createPublicClient()
    .from("products")
    .select(COLUMNS)
    .eq("slug", slug)
    .eq("status", "live")
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
});

export async function getProductContents(slug: string): Promise<string[]> {
  const { data, error } = await createPublicClient().rpc("product_contents", { p_slug: slug });
  if (error) throw error;
  return (data as { label: string }[]).map((r) => r.label);
}
