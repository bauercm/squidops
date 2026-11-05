import Link from "next/link";
import { SquidMark } from "@/components/logo";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Learn",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/feed.xml", label: "RSS feed" },
    ],
  },
  {
    title: "Products",
    links: [
      { href: "/products#toolkit", label: "Toolkits" },
      { href: "/products#course", label: "Courses" },
      { href: "/products#agent", label: "Agents" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/library", label: "Your library" },
      { href: "/login", label: "Sign in" },
      { href: "/about", label: "About" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <SquidMark className="h-8 w-8 text-accent" />
          <p className="mt-3 max-w-xs text-sm text-muted">{site.tagline}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-mono text-xs uppercase tracking-wider text-muted">{col.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-5xl px-4 py-5 font-mono text-xs text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
