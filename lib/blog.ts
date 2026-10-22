import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const BLOG_DIR = join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  relatedProduct?: string;
};

export type Post = PostMeta & { content: string };

function parse(file: string): Post {
  const slug = file.replace(/\.mdx$/, "");
  const { data, content } = matter(readFileSync(join(BLOG_DIR, file), "utf8"));
  for (const key of ["title", "date", "summary"]) {
    if (!data[key]) throw new Error(`content/blog/${file} is missing frontmatter "${key}"`);
  }
  return {
    slug,
    title: String(data.title),
    // gray-matter turns unquoted YAML dates into Date objects.
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
    summary: String(data.summary),
    relatedProduct: data.relatedProduct ? String(data.relatedProduct) : undefined,
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { content: _content, ...meta } = parse(f);
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    return parse(`${slug}.mdx`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}
