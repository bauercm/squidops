import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/site";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl border border-border p-5 transition-colors hover:border-accent"
    >
      <time dateTime={post.date} className="font-mono text-xs text-muted">
        {formatDate(post.date)} · {post.readingMinutes} min read
      </time>
      <h3 className="mt-2 font-semibold leading-snug group-hover:text-accent">{post.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{post.summary}</p>
    </Link>
  );
}
