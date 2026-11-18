import type { Metadata } from "next";
import Link from "next/link";
import { site, storeEnabled } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `What ${site.name} collects, why, and who handles it.`,
  alternates: { canonical: "/privacy" },
};

// Update this date whenever the policy text changes.
const lastUpdated = "November 18, 2026";

export default function Privacy() {
  return (
    <article className="mx-auto max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">Privacy</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Privacy policy</h1>
      <p className="mt-3 text-sm text-muted">Last updated {lastUpdated}</p>
      <div className="prose mt-8">
        <p>
          {site.name} collects as little as it can. Reading the blog needs no account, sets no
          tracking cookies, and loads no ads or analytics scripts.
        </p>

        <h2>The newsletter</h2>
        <p>
          When you subscribe to The Tuesday Plan, the email address you enter is sent to{" "}
          <a href="https://www.beehiiv.com/privacy">beehiiv</a>, the service that stores the
          subscriber list and sends the emails. Along with it, beehiiv receives a note that you
          signed up through the form on this site. {site.name} doesn&apos;t keep its own copy of
          your address.
        </p>
        <p>
          Your address is used only to send the newsletter and the occasional note about it. It is
          never sold or shared for anyone else&apos;s marketing. beehiiv records standard email
          metrics such as opens and clicks, which show which issues are useful.
        </p>
        <p>
          Every email has an unsubscribe link. Using it stops the emails right away. To have your
          address deleted completely, reply to any issue and ask.
        </p>

        {storeEnabled && (
          <>
            <h2>Purchases and accounts</h2>
            <p>
              Payments are handled by <a href="https://stripe.com/privacy">Stripe</a>. Card details
              go straight to Stripe and never reach {site.name}. After a purchase, your email
              address and what you bought are stored with{" "}
              <a href="https://supabase.com/privacy">Supabase</a> so your{" "}
              <Link href="/library">library</Link> can show your downloads. Signing in sets a
              session cookie that keeps you signed in; it isn&apos;t used for tracking.
            </p>
          </>
        )}

        <h2>Hosting</h2>
        <p>
          The site runs on <a href="https://vercel.com/legal/privacy-policy">Vercel</a>. Like any
          web host, Vercel briefly keeps request logs, which include your IP address and browser
          type, to run and secure the service. Those logs aren&apos;t used to identify or profile
          visitors.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>Unsubscribe from the newsletter at any time with the link in any email.</li>
          <li>Ask to see or delete the data held about you by replying to any issue.</li>
          <li>Read everything on the site without giving any personal information.</li>
        </ul>

        <h2>Changes</h2>
        <p>
          If this policy changes, the date at the top changes with it. A meaningful change (for
          example, adding analytics) will also be mentioned in the newsletter.
        </p>
      </div>
    </article>
  );
}
