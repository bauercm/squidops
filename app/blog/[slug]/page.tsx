import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RelatedProduct } from "@/components/related-product";
import { getAllPosts, getPost } from "@/lib/blog";
import { mdxComponents, mdxOptions } from "@/lib/mdx";
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
    <article className="mx-auto max-w-3xl">
      <Link href="/blog" className="font-mono text-xs text-muted hover:text-fg">
        ← blog
      </Link>
      <header className="mt-6 border-b border-border pb-8">
        <p className="font-mono text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-lg text-muted">{post.summary}</p>
      </header>
      <div className="prose mt-8">
        <MDXRemote source={post.content} components={mdxComponents} options={{ mdxOptions }} />
      </div>
      {post.relatedProduct && (
        <div className="mt-14">
          <RelatedProduct slug={post.relatedProduct} />
        </div>
      )}
    </article>
  );
}
