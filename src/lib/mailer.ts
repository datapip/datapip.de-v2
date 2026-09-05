/**
 * The one place that talks to SMTP.
 *
 * Both senders — the contact form and the extensions' feedback endpoint —
 * used to build their own transport with the same port/secure logic, and
 * checked readiness differently: one required all five variables, the other
 * only two. So a half-configured host failed the form cleanly and failed
 * feedback as a caught exception. One module, one definition of "configured".
 */
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  TO_EMAIL,
} from "astro:env/server";

export interface MailMessage {
  subject: string;
  text: string;
  /** Only ever a plausible address — a malformed one can bounce the message. */
  replyTo?: string;
}

/** Every variable, not just the host: a partial config cannot send. */
export function isMailConfigured(): boolean {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && FROM_EMAIL && TO_EMAIL);
}

export async function sendMail(message: MailMessage): Promise<void> {
  if (!isMailConfigured()) throw new Error("SMTP is not configured");

  // Imported lazily so the module stays out of the build when no mailing
  // route is hit, and so a missing dependency cannot break a page render.
  const { createTransport } = await import("nodemailer");

  const port = SMTP_PORT ?? 587;

  const transport = createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transport.sendMail({ from: FROM_EMAIL, to: TO_EMAIL, ...message });
}
