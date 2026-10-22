"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${next}` },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  async function signInWithGitHub() {
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  if (status === "sent") {
    return (
      <p className="rounded-lg border border-border bg-card p-5" role="status">
        Check <strong>{email}</strong> for a sign-in link. You can close this tab.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={sendLink} className="space-y-3">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-border bg-bg px-3 py-2 outline-none focus:border-accent"
          placeholder="you@example.com"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-md bg-accent px-4 py-2.5 font-semibold text-accent-fg hover:opacity-90 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Email me a magic link"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        onClick={signInWithGitHub}
        className="w-full rounded-md border border-border px-4 py-2.5 font-semibold hover:border-accent"
      >
        Continue with GitHub
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
