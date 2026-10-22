import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { href: "/blog", label: "Blog" },
  { href: "/products", label: "Products" },
  { href: "/library", label: "Library" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          <span aria-hidden>🦑 </span>
          {site.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-5 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
