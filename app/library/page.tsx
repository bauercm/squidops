import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import { PRODUCT_FILES_BUCKET, type Product, type ProductFile } from "@/lib/types";

export const metadata: Metadata = {
  title: "Your library",
  robots: { index: false },
};

const SIGNED_URL_TTL_SECONDS = 60 * 60;

type OwnedProduct = Pick<Product, "id" | "slug" | "name" | "version"> & {
  product_files: Pick<ProductFile, "id" | "label" | "storage_path" | "sort_order">[];
};
type PurchaseRow = { id: string; created_at: string; products: OwnedProduct };

type Props = { searchParams: Promise<{ checkout?: string }> };

export default async function LibraryPage({ searchParams }: Props) {
  const { checkout } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=/library${checkout === "success" ? "&checkout=success" : ""}`);
  }

  // RLS limits every table here to the signed-in user's purchases.
  const { data, error } = await supabase
    .from("purchases")
    .select(
      "id, created_at, products (id, slug, name, version, product_files (id, label, storage_path, sort_order))",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  const purchases = (data ?? []) as unknown as PurchaseRow[];

  const paths = purchases.flatMap((p) => p.products.product_files.map((f) => f.storage_path));
  const urls = new Map<string, string>();
  if (paths.length > 0) {
    // Storage RLS lets buyers sign URLs only for files of products they own.
    const { data: signed, error: signError } = await supabase.storage
      .from(PRODUCT_FILES_BUCKET)
      .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS, { download: true });
    if (signError) throw signError;
    for (const s of signed) if (s.path && s.signedUrl) urls.set(s.path, s.signedUrl);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-accent">Library</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Your products</h1>
        </div>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-sm text-muted hover:text-fg">
            Sign out ({user.email})
          </button>
        </form>
      </div>

      {checkout === "success" && (
        <p className="mt-6 rounded-lg border border-accent/40 bg-card p-4 text-sm" role="status">
          Thanks for your purchase! If it isn&apos;t listed yet, give it a few seconds and{" "}
          <Link href="/library" className="text-accent underline">
            refresh
          </Link>
          .
        </p>
      )}

      {purchases.length === 0 ? (
        <p className="mt-8 text-muted">
          You don&apos;t own any products yet.{" "}
          <Link href="/products" className="text-accent underline">
            Browse products
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {purchases.map(({ id, created_at, products: product }) => (
            <li key={id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-semibold">
                  <Link href={`/products/${product.slug}`} className="hover:text-accent">
                    {product.name}
                  </Link>
                </h2>
                <p className="text-xs text-muted">
                  v{product.version} · purchased {formatDate(created_at)}
                </p>
              </div>
              <ul className="mt-4 space-y-2">
                {[...product.product_files]
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((file) => {
                    const url = urls.get(file.storage_path);
                    return (
                      <li key={file.id} className="flex items-center justify-between gap-4 text-sm">
                        <span>{file.label}</span>
                        {url ? (
                          <a href={url} className="shrink-0 font-medium text-accent hover:underline">
                            Download
                          </a>
                        ) : (
                          <span className="shrink-0 text-muted">Unavailable</span>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-8 font-mono text-xs text-muted">Download links expire after one hour. Reload for fresh ones.</p>
    </div>
  );
}
