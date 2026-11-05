import { lineTones, ogImage, ogSize } from "@/lib/og";
import { getProduct } from "@/lib/products";
import { formatPrice } from "@/lib/site";

export const alt = "SquidOps product";
export const size = ogSize;
export const contentType = "image/png";
export const revalidate = 300;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) return ogImage({ eyebrow: "Products", title: "Tools for the job." });
  return ogImage({
    eyebrow: product.line,
    title: product.name,
    footer: `${formatPrice(product.price_cents)} · one-time`,
    tone: lineTones[product.line],
  });
}
