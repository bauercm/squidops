import Link from "next/link";
import { ArrowRightIcon, BookIcon } from "@/components/icons";
import { Newsletter } from "@/components/newsletter";
import { PostCard } from "@/components/post-card";
import { ProductCard } from "@/components/product-card";
import { productLines } from "@/components/product-line";
import { Terminal } from "@/components/terminal";
import { getAllPosts } from "@/lib/blog";
import { getLiveProducts } from "@/lib/products";
import { storeEnabled } from "@/lib/site";
import type { ProductLine } from "@/lib/types";

export const revalidate = 300;

export default async function Home() {
  const posts = getAllPosts().slice(0, 3);
  const products = storeEnabled ? await getLiveProducts(3) : [];

  return (
    <div className="space-y-20 sm:space-y-24">
      <section className="bg-sonar -mx-4 -mt-10 border-b border-border px-4 pb-12 pt-12 sm:mx-0 sm:mt-0 sm:rounded-2xl sm:border sm:p-10 lg:p-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-accent">
              {"// for azure + ai engineers"}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Ship Azure and AI systems that hold up in production.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              {storeEnabled
                ? "Free, problem-first guides from the field, plus toolkits, courses, and agents you can drop into your own tenant."
                : "Free, problem-first guides from the field: the real problem, the fix, and the commands."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-semibold text-accent-fg transition-opacity hover:opacity-90"
              >
                Read the guides
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href={storeEnabled ? "/products" : "#newsletter"}
                className="rounded-lg border border-border bg-bg/60 px-5 py-2.5 font-semibold transition-colors hover:border-accent"
              >
                {storeEnabled ? "Browse products" : "Get the newsletter"}
              </Link>
            </div>
          </div>
          <Terminal posts={posts} products={products} />
        </div>
      </section>

      {storeEnabled && (
        <section aria-labelledby="what">
          <SectionHeading id="what" eyebrow="What's here" title="Everything an engineer needs, nothing they don't." />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Pillar
              href="/blog"
              title="Free guides"
              body="Real problems, the fix, and the commands. Every post is free, forever."
              icon={<BookIcon className="h-6 w-6" />}
              tone="text-accent"
            />
            {(Object.keys(productLines) as ProductLine[]).map((line) => {
              const { plural, blurb, text, Icon } = productLines[line];
              return (
                <Pillar
                  key={line}
                  href={`/products#${line}`}
                  title={plural}
                  body={blurb}
                  icon={<Icon className="h-6 w-6" />}
                  tone={text}
                />
              );
            })}
          </ul>
        </section>
      )}

      {posts.length > 0 && (
        <section aria-labelledby="latest">
          <SectionHeading id="latest" eyebrow="From the blog" title="Latest guides" href="/blog" linkLabel="All posts" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section aria-labelledby="featured">
          <SectionHeading id="featured" eyebrow="Products" title="Featured" href="/products" linkLabel="All products" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
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

function SectionHeading({
  id,
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  id: string;
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-accent">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-2xl font-bold tracking-tight">
          {title}
        </h2>
      </div>
      {href && (
        <Link href={href} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
          {linkLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function Pillar({
  href,
  title,
  body,
  icon,
  tone,
}: {
  href: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent"
      >
        <span className={tone}>{icon}</span>
        <span className="mt-4 font-semibold group-hover:text-accent">{title}</span>
        <span className="mt-1 text-sm text-muted">{body}</span>
      </Link>
    </li>
  );
}
