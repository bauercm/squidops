import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "What SquidOps is, who it's for, and how the products work.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <article className="mx-auto max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">About</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Built in the field.</h1>
      <div className="prose mt-8">
        <p>
          SquidOps is a resource platform for engineers who build on Azure and ship AI into
          production. Like a squid, good platform work has a lot of arms: networking, identity,
          cost, governance, and now models and agents. This site tries to cover all of them with
          material you can use the same day.
        </p>
        <h2>What you&apos;ll find here</h2>
        <ul>
          <li>
            <strong>Free guides.</strong> Every <Link href="/blog">blog post</Link> starts from a
            real problem and ends with a working fix.
          </li>
          <li>
            <strong>Toolkits.</strong> Infrastructure-as-code modules, policies, and runbooks you
            can adapt to your tenant.
          </li>
          <li>
            <strong>Courses.</strong> Self-paced, written material for going deeper on one topic.
          </li>
          <li>
            <strong>Agents.</strong> Small AI agents that run in your own subscription and do one
            job well.
          </li>
        </ul>
        <h2>How purchases work</h2>
        <p>
          Products are one-time purchases through Stripe. After checkout, everything you own is in
          your <Link href="/library">library</Link>, including future updates to the same version
          line.
        </p>
        <h2>Stay in the loop</h2>
        <p>
          New guides go out through the newsletter on the <Link href="/">home page</Link> and the{" "}
          <Link href="/feed.xml">RSS feed</Link>.
        </p>
      </div>
    </article>
  );
}
