import Link from "next/link";
import { productLines } from "@/components/product-line";
import type { PostMeta } from "@/lib/blog";
import { formatPrice } from "@/lib/site";
import type { Product } from "@/lib/types";

// Hero "terminal" that lists real posts and products, so it never goes stale.
export function Terminal({ posts, products }: { posts: PostMeta[]; products: Product[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg/90 font-mono text-[13px] leading-relaxed shadow-[0_20px_60px_-25px_var(--glow)]">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-2 text-xs text-muted">~/squidops</span>
      </div>
      <div className="space-y-1 px-4 py-4">
        <p>
          <span className="text-accent">$</span> squidops guides --latest
        </p>
        {posts.length === 0 && <p className="text-muted">{"// first guide ships soon"}</p>}
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex gap-2 text-muted hover:text-fg">
            <span aria-hidden className="text-accent">
              ↳
            </span>
            <span className="truncate group-hover:underline">{p.title}</span>
          </Link>
        ))}
        <p className="pt-3">
          <span className="text-accent">$</span> squidops products
        </p>
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="group flex items-baseline gap-2 text-muted hover:text-fg"
          >
            <span className={`w-16 shrink-0 ${productLines[p.line].text}`}>{p.line}</span>
            <span className="min-w-0 flex-1 truncate group-hover:underline">{p.name}</span>
            <span className="shrink-0 text-fg">{formatPrice(p.price_cents)}</span>
          </Link>
        ))}
        <p className="pt-3">
          <span className="text-accent">$</span>{" "}
          <span className="inline-block h-4 w-2 translate-y-0.5 bg-accent motion-safe:animate-pulse" />
        </p>
      </div>
    </div>
  );
}
