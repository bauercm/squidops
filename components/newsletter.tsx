import { beehiivFormUrl } from "@/lib/env";

export function Newsletter() {
  return (
    <section aria-labelledby="newsletter" className="rounded-lg border border-border bg-card p-6">
      <h2 id="newsletter" className="text-lg font-semibold">
        Get new guides by email
      </h2>
      <p className="mt-1 text-sm text-muted">
        One practical Azure or AI engineering write-up a week. No spam, unsubscribe anytime.
      </p>
      {beehiivFormUrl ? (
        <iframe
          src={beehiivFormUrl}
          title="Newsletter signup"
          className="mt-4 h-[60px] w-full border-0 bg-transparent"
          loading="lazy"
        />
      ) : (
        <p className="mt-4 text-sm text-muted">
          Newsletter signup is not configured (set NEXT_PUBLIC_BEEHIIV_FORM_URL).
        </p>
      )}
    </section>
  );
}
