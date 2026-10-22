import Link from "next/link";
import { formatPrice, lineLabels } from "@/lib/site";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
    >
      <span className="text-xs font-medium uppercase tracking-wider text-accent">
        {lineLabels[product.line]}
      </span>
      <h3 className="mt-2 font-semibold group-hover:text-accent">{product.name}</h3>
      <p className="mt-1 flex-1 text-sm text-muted">{product.tagline}</p>
      <p className="mt-4 text-sm font-semibold">{formatPrice(product.price_cents)}</p>
    </Link>
  );
}
