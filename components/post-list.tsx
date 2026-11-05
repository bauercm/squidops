import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/site";

export function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`} className="group grid gap-1 py-6 sm:grid-cols-[8rem_1fr] sm:gap-6">
            <time dateTime={post.date} className="pt-1 font-mono text-xs text-muted">
              {formatDate(post.date)}
            </time>
            <div>
              <h3 className="font-semibold leading-snug group-hover:text-accent">{post.title}</h3>
              <p className="mt-1 text-sm text-muted">{post.summary}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
