import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, CheckIcon, FileIcon } from "@/components/icons";
import { Markdown } from "@/components/markdown";
import { LineBadge } from "@/components/product-line";
import { getLiveProducts, getProduct, getProductContents } from "@/lib/products";
import { formatPrice } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getLiveProducts()).map((p) => ({ slug: p.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title: product.name, description: product.tagline },
  };
}

const steps = [
  { title: "Check out with Stripe", body: "Pay securely by card. No account needed up front." },
  { title: "Get your sign-in link", body: "We email a one-click link to the address you paid with." },
  { title: "Download from your library", body: "Files and future updates live in your library." },
];

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const contents = await getProductContents(slug);

  return (
    <article>
      <Link href="/products" className="font-mono text-xs text-muted hover:text-fg">
        ← products
      </Link>

      <header className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <LineBadge line={product.line} />
          <span className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted">
            v{product.version}
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{product.name}</h1>
        <p className="mt-4 text-lg text-muted sm:text-xl">{product.tagline}</p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <aside className="order-first lg:order-none lg:col-start-2 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            <BuyBox slug={product.slug} priceCents={product.price_cents} leadUrl={product.lead_url} />
          </div>
        </aside>

        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <Markdown>{product.description_md}</Markdown>

          {contents.length > 0 && (
            <section className="mt-12" aria-labelledby="included">
              <h2 id="included" className="text-xl font-bold tracking-tight">
                What&apos;s included
              </h2>
              <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
                {contents.map((label) => (
                  <li key={label} className="flex items-center gap-3 px-4 py-3">
                    <FileIcon className="h-5 w-5 shrink-0 text-muted" />
                    {label}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-12" aria-labelledby="how">
            <h2 id="how" className="text-xl font-bold tracking-tight">
              How it works
            </h2>
            <ol className="mt-4 space-y-4">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs text-accent">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-sm text-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </article>
  );
}

function BuyBox({ slug, priceCents, leadUrl }: { slug: string; priceCents: number; leadUrl: string | null }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-4xl font-bold tracking-tight">{formatPrice(priceCents)}</p>
      <p className="mt-1 text-sm text-muted">One-time payment</p>
      <form action="/api/checkout" method="post" className="mt-5">
        <input type="hidden" name="slug" value={slug} />
        <button
          type="submit"
          className="w-full rounded-lg bg-accent px-5 py-3 font-semibold text-accent-fg transition-opacity hover:opacity-90"
        >
          Buy now
        </button>
      </form>
      <ul className="mt-5 space-y-2 text-sm text-muted">
        {["Instant download", "Lifetime updates to this version", "Secure checkout via Stripe"].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <CheckIcon className="h-4 w-4 shrink-0 text-accent" />
            {t}
          </li>
        ))}
      </ul>
      {leadUrl && (
        <Link
          href={leadUrl}
          className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4 text-sm font-medium text-accent hover:underline"
        >
          Not ready? Read the free guide
          <ArrowRightIcon className="h-4 w-4 shrink-0" />
        </Link>
      )}
    </div>
  );
}
