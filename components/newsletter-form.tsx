"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Try again in a moment.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Try again in a moment.");
    }
  }

  if (status === "done") {
    return (
      <p className="mt-6 max-w-xl rounded-lg border border-accent/40 bg-card p-4 text-sm" role="status">
        You&apos;re in. Check <strong>{email}</strong> for a welcome email.
      </p>
    );
  }

  return (
    <form onSubmit={subscribe} className="mt-6 max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? "newsletter-error" : undefined}
          className="min-w-0 flex-1 rounded-md border border-border bg-bg px-3 py-2.5 outline-none focus:border-accent"
        />
        {/* Honeypot for bots: hidden from people and assistive tech. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="absolute -left-[9999px] h-px w-px opacity-0"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-fg hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p id="newsletter-error" className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
