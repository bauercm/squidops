export type ProductLine = "toolkit" | "course" | "agent";
export type ProductStatus = "draft" | "live";

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description_md: string;
  price_cents: number;
  stripe_price_id: string | null;
  line: ProductLine;
  status: ProductStatus;
  version: string;
  lead_url: string | null;
  created_at: string;
};

export type ProductFile = {
  id: string;
  product_id: string;
  storage_path: string;
  label: string;
  sort_order: number;
};

export type Purchase = {
  id: string;
  user_id: string;
  product_id: string;
  stripe_session_id: string;
  amount_cents: number;
  created_at: string;
};

export const PRODUCT_FILES_BUCKET = "product-files";
