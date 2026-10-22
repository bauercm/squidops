// Only allow same-origin redirects after auth, to avoid open redirects.
export function safeNext(next: string | null, origin: string, fallback = "/library") {
  if (!next) return fallback;
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  try {
    const url = new URL(next);
    if (url.origin === origin) return `${url.pathname}${url.search}`;
  } catch {
    // not a URL
  }
  return fallback;
}
