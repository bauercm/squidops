import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { PostList } from "@/components/post-list";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: "Problem-first guides for Azure and AI engineers: what broke, why, and how to fix it.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const [latest, ...rest] = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-accent">Blog</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Field notes.</h1>
        <p className="mt-3 text-lg text-muted">
          Real problems, the fix, and the commands. Always free.{" "}
          <Link href="/feed.xml" className="text-accent hover:underline">
            RSS
          </Link>
        </p>
      </header>

      {!latest && (
        <p className="mt-10 rounded-2xl border border-border p-6 font-mono text-sm text-muted sm:p-8">
          {"// first guide ships soon"}
        </p>
      )}

      {latest && (
        <Link
          href={`/blog/${latest.slug}`}
          className="bg-sonar group mt-10 block rounded-2xl border border-border p-6 transition-colors hover:border-accent sm:p-8"
        >
          <p className="font-mono text-xs text-muted">
            Latest · {formatDate(latest.date)} · {latest.readingMinutes} min read
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-snug tracking-tight group-hover:text-accent">
            {latest.title}
          </h2>
          <p className="mt-3 text-muted">{latest.summary}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            Read the guide
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="mt-10">
          <PostList posts={rest} />
        </div>
      )}
    </div>
  );
}
