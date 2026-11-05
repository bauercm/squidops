import Link from "next/link";
import { Wordmark } from "@/components/logo";

const nav = [
  { href: "/blog", label: "Blog", className: "" },
  { href: "/products", label: "Products", className: "" },
  // Hidden on phones to fit the bar; About is also in the footer.
  { href: "/about", label: "About", className: "hidden sm:inline-block" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="SquidOps home">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm sm:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-2 py-1.5 text-muted transition-colors hover:text-fg sm:px-3 ${item.className}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/library"
            className="ml-1 rounded-md border border-border px-2.5 py-1.5 font-medium transition-colors hover:border-accent hover:text-accent sm:px-3"
          >
            Library
          </Link>
        </nav>
      </div>
    </header>
  );
}
