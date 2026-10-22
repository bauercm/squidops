import type { Metadata } from "next";
import { PostList } from "@/components/post-list";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Problem-first guides for Azure and AI engineers: what broke, why, and how to fix it.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mt-2 text-muted">Real problems, the fix, and the commands. Always free.</p>
      <div className="mt-8">
        <PostList posts={getAllPosts()} />
      </div>
    </>
  );
}
