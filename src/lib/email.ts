/**
 * Resend over REST. No npm dependency, matching the pattern already used by
 * anvilroad.com, the skills storefront and bptrack.app.
 *
 * The API key is read from the server environment and never reaches the
 * browser. There is deliberately no NEXT_PUBLIC_ variant of anything here.
 */

export interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export function resendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export async function sendEmail(args: SendArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');

  const from = process.env.LEAD_FROM || 'Anvil Road <hello@send.anvilroad.com>';

  const body: Record<string, unknown> = {
    from,
    to: [args.to],
    subject: args.subject,
    html: args.html,
    text: args.text,
  };
  if (args.replyTo) body.reply_to = args.replyTo;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend send failed: ${res.status} ${detail}`);
  }
}

/**
 * Add the address to the shared Resend audience, which owns subscribe and
 * unsubscribe state across the portfolio.
 *
 * Non-fatal on purpose. If the audience is not configured the signup is still
 * recorded by the notification email, so nobody's address is lost.
 */
export async function addToAudience(email: string): Promise<'added' | 'skipped' | 'failed'> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return 'skipped';

  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
    return res.ok ? 'added' : 'failed';
  } catch {
    return 'failed';
  }
}
