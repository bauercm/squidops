import { NextResponse, type NextRequest } from "next/server";
import { beehiivApiKey, beehiivPublicationId, newsletterEnabled, siteUrl } from "@/lib/env";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = { email?: unknown; website?: unknown };

// JSON POST from the newsletter form. Creates a beehiiv subscription server-side so the API key
// never reaches the browser.
export async function POST(request: NextRequest) {
  if (!newsletterEnabled) {
    return NextResponse.json({ error: "Newsletter signup isn't set up yet." }, { status: 503 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never see or fill this field. Pretend it worked.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(
      `https://api.beehiiv.com/v2/publications/${beehiivPublicationId()}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${beehiivApiKey()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          // The person is opting in right now, so re-subscribe them if they left before.
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: "website",
          utm_medium: "signup_form",
          referring_site: siteUrl,
        }),
        signal: AbortSignal.timeout(10_000),
      },
    );
  } catch (err) {
    console.error("beehiiv subscribe request failed", err);
    return NextResponse.json({ error: "Couldn't reach the newsletter service. Try again." }, { status: 502 });
  }

  if (!res.ok) {
    // Log status and beehiiv's message, never the email address.
    console.error("beehiiv subscribe error", res.status, await res.text().catch(() => ""));
    if (res.status === 400) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong. Try again in a moment." }, { status: 502 });
  }

  const data = (await res.json().catch(() => null)) as { data?: { status?: string } } | null;
  if (data?.data?.status === "invalid") {
    return NextResponse.json({ error: "That email address can't receive mail." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
