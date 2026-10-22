import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-wrap justify-between gap-4 px-4 py-8 text-sm text-muted">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex gap-5">
          <li>
            <Link href="/feed.xml" className="hover:text-fg">
              RSS
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-fg">
              About
            </Link>
          </li>
          <li>
            <Link href="/login" className="hover:text-fg">
              Sign in
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
