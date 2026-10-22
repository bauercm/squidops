import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { getLiveProducts, getProduct, getProductContents } from "@/lib/products";
import { formatPrice, lineLabels } from "@/lib/site";

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

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const contents = await getProductContents(slug);

  return (
    <article>
      <Link href="/products" className="text-sm text-muted hover:text-fg">
        ← Products
      </Link>
      <header className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">
          {lineLabels[product.line]} · v{product.version}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{product.name}</h1>
        <p className="mt-2 text-lg text-muted">{product.tagline}</p>
      </header>

      <BuyBox productSlug={product.slug} priceCents={product.price_cents} leadUrl={product.lead_url} />

      <section className="mt-10" aria-label="Description">
        <Markdown>{product.description_md}</Markdown>
      </section>

      {contents.length > 0 && (
        <section className="mt-10" aria-labelledby="included">
          <h2 id="included" className="text-xl font-semibold">
            What&apos;s included
          </h2>
          <ul className="mt-4 space-y-2">
            {contents.map((label) => (
              <li key={label} className="flex gap-2">
                <span aria-hidden className="text-accent">
                  ✓
                </span>
                {label}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10">
        <BuyBox productSlug={product.slug} priceCents={product.price_cents} leadUrl={null} />
      </div>
    </article>
  );
}

function BuyBox({
  productSlug,
  priceCents,
  leadUrl,
}: {
  productSlug: string;
  priceCents: number;
  leadUrl: string | null;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-5">
      <p className="text-2xl font-bold">{formatPrice(priceCents)}</p>
      <form action="/api/checkout" method="post">
        <input type="hidden" name="slug" value={productSlug} />
        <button
          type="submit"
          className="rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-fg hover:opacity-90"
        >
          Buy now
        </button>
      </form>
      {leadUrl && (
        <Link href={leadUrl} className="text-sm text-accent hover:underline">
          Start with the free guide →
        </Link>
      )}
      <p className="w-full text-xs text-muted">
        One-time payment via Stripe. Files appear in your library right after checkout.
      </p>
    </div>
  );
}
