import { beehiivFormUrl } from "@/lib/env";

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
      {beehiivFormUrl ? (
        <iframe
          src={beehiivFormUrl}
          title="Newsletter signup"
          className="mt-6 h-[60px] w-full max-w-xl border-0 bg-transparent"
          loading="lazy"
        />
      ) : (
        <p className="mt-6 font-mono text-xs text-muted">
          {"// signup form appears here once NEXT_PUBLIC_BEEHIIV_FORM_URL is set"}
        </p>
      )}
    </section>
  );
}
