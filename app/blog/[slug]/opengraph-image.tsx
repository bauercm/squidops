import { getAllPosts, getPost } from "@/lib/blog";
import { ogImage, ogSize } from "@/lib/og";
import { formatDate } from "@/lib/site";

export const alt = "SquidOps blog post";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  return ogImage({
    eyebrow: post ? `Guide · ${post.readingMinutes} min read` : "Guide",
    title: post?.title ?? "SquidOps blog",
    footer: post ? formatDate(post.date) : undefined,
  });
}
