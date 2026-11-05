import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const colors = { bg: "#060a12", fg: "#e3e8f1", muted: "#8e99ad", accent: "#2de2d0", border: "#19212f" };

// Shared 1200x630 share card: dark "abyss" background, squid mark, eyebrow, title.
export function ogImage({
  eyebrow,
  title,
  footer,
  tone = colors.accent,
}: {
  eyebrow: string;
  title: string;
  footer?: string;
  tone?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: colors.bg,
          backgroundImage: "radial-gradient(circle at 12% 0%, rgba(45,226,208,0.18), transparent 55%)",
          color: colors.fg,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 2.5c-4.3 2.7-7.2 6.8-7.2 11.4 0 1.5.3 2.8.9 3.9h12.6c.6-1.1.9-2.4.9-3.9 0-4.6-2.9-8.7-7.2-11.4Z"
              fill={colors.accent}
            />
            <circle cx="13.3" cy="13.6" r="1.35" fill={colors.bg} />
            <circle cx="18.7" cy="13.6" r="1.35" fill={colors.bg} />
            <g stroke={colors.accent} strokeWidth="1.8" strokeLinecap="round">
              <path d="M11.2 18.6c-.4 3.1-2.6 4.6-2.6 7.9" />
              <path d="M14.4 18.6c0 3.6-1.1 5.6-1.1 9.4" />
              <path d="M17.6 18.6c0 3.6 1.1 5.6 1.1 9.4" />
              <path d="M20.8 18.6c.4 3.1 2.6 4.6 2.6 7.9" />
            </g>
          </svg>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>
            Squid<span style={{ color: colors.accent }}>Ops</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 3, textTransform: "uppercase", color: tone }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: title.length > 60 ? 56 : 68, fontWeight: 700, lineHeight: 1.12 }}>
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `2px solid ${colors.border}`,
            paddingTop: 28,
            fontSize: 26,
            color: colors.muted,
          }}
        >
          <span>squidops.io</span>
          <span style={{ color: colors.fg }}>{footer ?? "Azure + AI engineering"}</span>
        </div>
      </div>
    ),
    ogSize,
  );
}

export const lineTones = { toolkit: "#2de2d0", course: "#a78bfa", agent: "#fbbf24" } as const;
