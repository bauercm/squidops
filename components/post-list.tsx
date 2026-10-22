import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/site";

export function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <ul className="divide-y divide-border">
      {posts.map((post) => (
        <li key={post.slug} className="py-5 first:pt-0">
          <Link href={`/blog/${post.slug}`} className="group block">
            <time dateTime={post.date} className="text-xs text-muted">
              {formatDate(post.date)}
            </time>
            <h3 className="mt-1 font-semibold group-hover:text-accent">{post.title}</h3>
            <p className="mt-1 text-sm text-muted">{post.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
