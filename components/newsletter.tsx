import Link from "next/link";
import { newsletterEnabled } from "@/lib/env";
import { NewsletterForm } from "./newsletter-form";

export function Newsletter() {
  return (
    <section
      aria-labelledby="newsletter"
      className="bg-sonar overflow-hidden rounded-2xl border border-border p-6 sm:p-10"
    >
      <p className="font-mono text-xs uppercase tracking-wider text-accent">Newsletter</p>
      <h2 id="newsletter" className="mt-2 text-2xl font-bold tracking-tight">
        One field-tested fix a week.
      </h2>
      <p className="mt-2 max-w-xl text-muted">
        A practical Azure or AI engineering write-up in your inbox every week. No spam, unsubscribe
        anytime.
      </p>
      {newsletterEnabled ? (
        <>
          <NewsletterForm />
          <p className="mt-3 text-xs text-muted">
            Your email is used only for the newsletter. See the{" "}
            <Link href="/privacy" className="underline hover:text-accent">
              privacy policy
            </Link>
            .
          </p>
        </>
      ) : (
        <p className="mt-6 font-mono text-xs text-muted">
          {"// signup form appears here once BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID are set"}
        </p>
      )}
    </section>
  );
}
