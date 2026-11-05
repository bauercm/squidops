// The SquidOps mark: a geometric squid. Inherits color from `currentColor`.
export function SquidMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <path
        d="M16 2.5c-4.3 2.7-7.2 6.8-7.2 11.4 0 1.5.3 2.8.9 3.9h12.6c.6-1.1.9-2.4.9-3.9 0-4.6-2.9-8.7-7.2-11.4Z"
        fill="currentColor"
      />
      <circle cx="13.3" cy="13.6" r="1.35" fill="var(--bg)" />
      <circle cx="18.7" cy="13.6" r="1.35" fill="var(--bg)" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M11.2 18.6c-.4 3.1-2.6 4.6-2.6 7.9" />
        <path d="M14.4 18.6c0 3.6-1.1 5.6-1.1 9.4" />
        <path d="M17.6 18.6c0 3.6 1.1 5.6 1.1 9.4" />
        <path d="M20.8 18.6c.4 3.1 2.6 4.6 2.6 7.9" />
      </g>
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 text-lg font-bold tracking-tight">
      <SquidMark className="h-7 w-7 text-accent" />
      <span>
        Squid<span className="text-accent">Ops</span>
      </span>
    </span>
  );
}
