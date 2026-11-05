import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { LineBadge } from "@/components/product-line";
import { formatPrice } from "@/lib/site";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent"
    >
      <LineBadge line={product.line} />
      <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-accent">{product.name}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{product.tagline}</p>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="font-semibold">{formatPrice(product.price_cents)}</span>
        <span className="inline-flex items-center gap-1 text-sm text-muted group-hover:text-accent">
          View
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
