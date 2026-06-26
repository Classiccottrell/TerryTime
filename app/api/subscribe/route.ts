import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter signup. Provider-agnostic:
 *  - If RESEND_API_KEY + RESEND_AUDIENCE_ID are set, adds the contact to a
 *    Resend audience.
 *  - Else if NEWSLETTER_WEBHOOK_URL is set (Buttondown / ConvertKit / Zapier /
 *    Mailchimp via a webhook), POSTs { email } to it.
 *  - Else returns 503 so the UI can show an honest "not live yet" message.
 */
export async function POST(req: Request) {
  let email: string | undefined;
  try {
    const body = await req.json();
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "That doesn't look like an email." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const resendAudience = process.env.RESEND_AUDIENCE_ID;
  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;

  try {
    if (resendKey && resendAudience) {
      const res = await fetch(
        `https://api.resend.com/audiences/${resendAudience}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, unsubscribed: false }),
        }
      );
      if (!res.ok && res.status !== 409) {
        const detail = await res.text();
        console.error("[subscribe] Resend error:", res.status, detail);
        return NextResponse.json(
          { error: "Couldn't sign you up. Try again in a moment." },
          { status: 502 }
        );
      }
      return NextResponse.json({ ok: true });
    }

    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        console.error("[subscribe] Webhook error:", res.status, await res.text());
        return NextResponse.json(
          { error: "Couldn't sign you up. Try again in a moment." },
          { status: 502 }
        );
      }
      return NextResponse.json({ ok: true });
    }

    // Nothing configured yet.
    console.warn(`[subscribe] No provider configured. Would have added: ${email}`);
    return NextResponse.json(
      {
        error:
          "Signups aren't live yet — set RESEND_API_KEY + RESEND_AUDIENCE_ID (or NEWSLETTER_WEBHOOK_URL) to enable them.",
      },
      { status: 503 }
    );
  } catch (err) {
    console.error("[subscribe] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again in a moment." },
      { status: 500 }
    );
  }
}
