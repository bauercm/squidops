import type { NextConfig } from "next";

// The old production hostname. Once NEXT_PUBLIC_SITE_URL points at the custom domain, every
// request to it is permanently redirected there so links and search results move over.
// Preview URLs (squidops-<hash>-<team>.vercel.app) are left alone.
const legacyHost = "squidops.vercel.app";

function siteOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (!raw) return null;
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).origin;
  } catch {
    return null;
  }
}

const nextConfig: NextConfig = {
  async redirects() {
    const origin = siteOrigin();
    if (!origin || new URL(origin).host === legacyHost) return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: legacyHost }],
        destination: `${origin}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
