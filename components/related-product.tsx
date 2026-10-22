import Link from "next/link";
import { getProduct } from "@/lib/products";
import { formatPrice, lineLabels } from "@/lib/site";

export async function RelatedProduct({ slug }: { slug: string }) {
  const product = await getProduct(slug);
  if (!product) return null;

  return (
    <aside className="rounded-lg border border-accent/40 bg-card p-6" aria-label="Related product">
      <p className="text-xs font-medium uppercase tracking-wider text-accent">
        Related {lineLabels[product.line].toLowerCase()}
      </p>
      <p className="mt-2 text-lg font-semibold">{product.name}</p>
      <p className="mt-1 text-sm text-muted">{product.tagline}</p>
      <Link
        href={`/products/${product.slug}`}
        className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:opacity-90"
      >
        Get it for {formatPrice(product.price_cents)}
      </Link>
    </aside>
  );
}
