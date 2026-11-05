import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { productLines } from "@/components/product-line";
import { getProduct } from "@/lib/products";
import { formatPrice } from "@/lib/site";

export async function RelatedProduct({ slug }: { slug: string }) {
  const product = await getProduct(slug);
  if (!product) return null;
  const { label, text, Icon } = productLines[product.line];

  return (
    <aside
      className="bg-sonar flex flex-col gap-5 rounded-2xl border border-border p-6 sm:flex-row sm:items-center sm:p-8"
      aria-label="Related product"
    >
      <span className={`self-start rounded-xl border border-border bg-bg p-3 ${text}`}>
        <Icon className="h-7 w-7" />
      </span>
      <div className="flex-1">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          Go further · {label.toLowerCase()}
        </p>
        <p className="mt-1 text-lg font-semibold">{product.name}</p>
        <p className="mt-1 text-sm text-muted">{product.tagline}</p>
      </div>
      <Link
        href={`/products/${product.slug}`}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-semibold text-accent-fg transition-opacity hover:opacity-90"
      >
        {formatPrice(product.price_cents)}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </aside>
  );
}
