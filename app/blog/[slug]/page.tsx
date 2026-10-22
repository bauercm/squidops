import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import { RelatedProduct } from "@/components/related-product";
import { getAllPosts, getPost } from "@/lib/blog";
import { formatDate } from "@/lib/site";

export const dynamicParams = false;
export const revalidate = 300; // keeps the related-product callout fresh

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <article>
      <Link href="/blog" className="text-sm text-muted hover:text-fg">
        ← Blog
      </Link>
      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <time dateTime={post.date} className="mt-2 block text-sm text-muted">
          {formatDate(post.date)}
        </time>
      </header>
      <div className="prose mt-8">
        <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>
      {post.relatedProduct && (
        <div className="mt-12">
          <RelatedProduct slug={post.relatedProduct} />
        </div>
      )}
    </article>
  );
}
