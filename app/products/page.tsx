import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { productLines } from "@/components/product-line";
import { getLiveProducts } from "@/lib/products";
import type { ProductLine } from "@/lib/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Products",
  description: "Toolkits, courses, and agents for Azure and AI engineers. One-time purchase, lifetime access.",
  alternates: { canonical: "/products" },
};

export default async function Products() {
  const products = await getLiveProducts();
  const lines = (Object.keys(productLines) as ProductLine[]).filter((line) =>
    products.some((p) => p.line === line),
  );

  return (
    <>
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">Products</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Tools for the job.</h1>
        <p className="mt-3 text-lg text-muted">
          Pay once, download from your library, and get every update to the version you bought.
        </p>
      </header>

      {products.length === 0 ? (
        <p className="mt-12 text-muted">Nothing here yet. Check back soon.</p>
      ) : (
        <div className="mt-14 space-y-16">
          {lines.map((line) => {
            const { plural, blurb, text, Icon } = productLines[line];
            return (
              <section key={line} id={line} aria-labelledby={`${line}-heading`} className="scroll-mt-24">
                <div className="flex items-center gap-3">
                  <span className={`rounded-lg border border-border bg-card p-2 ${text}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 id={`${line}-heading`} className="text-xl font-bold tracking-tight">
                      {plural}
                    </h2>
                    <p className="text-sm text-muted">{blurb}</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products
                    .filter((p) => p.line === line)
                    .map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
