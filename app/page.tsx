import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import { PostList } from "@/components/post-list";
import { ProductCard } from "@/components/product-card";
import { getAllPosts } from "@/lib/blog";
import { getLiveProducts } from "@/lib/products";

export const revalidate = 300;

export default async function Home() {
  const posts = getAllPosts().slice(0, 3);
  const products = await getLiveProducts(3);

  return (
    <div className="space-y-16">
      <section className="pt-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ship Azure and AI systems that hold up in production.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          SquidOps publishes free, problem-first guides for cloud and AI engineers, plus toolkits,
          courses, and agents you can drop into your own tenant.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:opacity-90"
          >
            Read the guides
          </Link>
          <Link
            href="/products"
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:border-accent"
          >
            Browse products
          </Link>
        </div>
      </section>

      <section aria-labelledby="what">
        <h2 id="what" className="text-xl font-semibold">
          What SquidOps is
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          <li className="rounded-lg border border-border p-4">
            <p className="font-semibold">Free guides</p>
            <p className="mt-1 text-sm text-muted">
              Real problems, the fix, and the commands. Every post is free.
            </p>
          </li>
          <li className="rounded-lg border border-border p-4">
            <p className="font-semibold">Digital products</p>
            <p className="mt-1 text-sm text-muted">
              Toolkits, courses, and agents. Buy once, download forever, get updates.
            </p>
          </li>
          <li className="rounded-lg border border-border p-4">
            <p className="font-semibold">Built in the field</p>
            <p className="mt-1 text-sm text-muted">
              Everything here comes from shipping on Azure, not from slideware.
            </p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="latest">
        <div className="flex items-baseline justify-between">
          <h2 id="latest" className="text-xl font-semibold">
            Latest posts
          </h2>
          <Link href="/blog" className="text-sm text-accent hover:underline">
            All posts →
          </Link>
        </div>
        <div className="mt-4">
          <PostList posts={posts} />
        </div>
      </section>

      {products.length > 0 && (
        <section aria-labelledby="featured">
          <div className="flex items-baseline justify-between">
            <h2 id="featured" className="text-xl font-semibold">
              Featured products
            </h2>
            <Link href="/products" className="text-sm text-accent hover:underline">
              All products →
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Newsletter />
    </div>
  );
}
