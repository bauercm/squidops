import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { getLiveProducts } from "@/lib/products";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Products",
  description: "Toolkits, courses, and agents for Azure and AI engineers. One-time purchase, lifetime access.",
  alternates: { canonical: "/products" },
};

export default async function Products() {
  const products = await getLiveProducts();

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Products</h1>
      <p className="mt-2 text-muted">
        Toolkits, courses, and agents. Pay once, download from your library, get every update.
      </p>
      {products.length === 0 ? (
        <p className="mt-8 text-muted">Nothing here yet. Check back soon.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
