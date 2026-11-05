import type { MDXComponents } from "mdx/types";
import { Children, isValidElement } from "react";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const prettyCode: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: false,
  defaultLang: "plaintext",
};

export const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypePrettyCode, prettyCode]] as never,
};

function textOf(node: React.ReactNode): string {
  return Children.toArray(node)
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? String(child)
        : isValidElement<{ children?: React.ReactNode }>(child)
          ? textOf(child.props.children)
          : "",
    )
    .join("");
}

// Posts follow a problem/solution format; tag those headings so they get a badge.
const kinds: [RegExp, string][] = [
  [/^the problem/i, "problem"],
  [/^the (solution|fix)/i, "solution"],
  [/^(takeaway|tl;?dr)/i, "takeaway"],
];

export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => {
    const text = textOf(children);
    const kind = kinds.find(([re]) => re.test(text))?.[1];
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return (
      <h2 id={id} data-kind={kind} {...props}>
        {children}
      </h2>
    );
  },
};
