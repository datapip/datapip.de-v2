/**
 * Feedback endpoint for the two browser extensions.
 *
 * `simple-data-layer-viewer` and `simple-in-page-analytics-viewer` both POST
 * their feedback sheet here. Their builds are already in the stores and
 * cannot be changed by deploying this site, so **this endpoint's contract is
 * fixed by them, not the other way round**: a JSON body of `{ message, email,
 * source }`, success signalled by any 2xx (they only read `response.ok`).
 *
 * The feedback goes to **both** channels: emailed to `TO_EMAIL`, and stored
 * in PocketBase the way v1 stored it. They run in parallel and independently
 * — see `deliver()` for what happens when only one of them succeeds.
 *
 * The callers are extension pages, so this is genuinely cross-origin:
 * `chrome-extension://<id>` on Chrome, `moz-extension://<uuid>` on Firefox
 * where the UUID differs per installation. An origin allowlist therefore
 * cannot work, and the endpoint is open by necessity — the rate limit and the
 * payload caps are what defend it, since a POST here sends mail.
 */
export const prerender = false;

import type { APIRoute } from "astro";

import { PB_ENDPOINT, PB_USER, PB_PASSWORD } from "astro:env/server";

import { clientIp, withinFeedbackRateLimit } from "../../lib/guards";
import { sendMail } from "../../lib/mailer";

interface Feedback {
  message: string;
  email: string;
  name: string;
  source: string;
}

/** Matches the extensions' own client-side validation. */
const MIN_MESSAGE = 5;
const MAX_MESSAGE = 5_000;
const MAX_FIELD = 200;

const CORS_HEADERS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "86400",
};

function reply(status: number): Response {
  return new Response(JSON.stringify({}), {
    status,
    headers: { "content-type": "application/json", ...CORS_HEADERS },
  });
}

/**
 * An extension sending `content-type: application/json` makes the request
 * non-simple, so the browser preflights it. Without this handler the
 * preflight 404s and the POST is never sent.
 */
export const OPTIONS: APIRoute = () =>
  new Response(null, { status: 204, headers: CORS_HEADERS });

/** Deliberately permissive, like the contact form: delivery is the authority. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!withinFeedbackRateLimit(clientIp(request, clientAddress))) return reply(429);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return reply(400);
  }

  const message = field(body.message, MAX_MESSAGE);
  if (message.length < MIN_MESSAGE) return reply(400);

  const feedback: Feedback = {
    message,
    email: field(body.email, MAX_FIELD),
    name: field(body.name, MAX_FIELD),
    // v1 stored `source` to tell the two extensions apart; it becomes the subject.
    source: field(body.source, MAX_FIELD) || "unknown",
  };

  // v1 answered 201. The extensions only check `response.ok`, but keep it.
  return (await deliver(feedback)) ? reply(201) : reply(500);
};

/* ------------------------------ Delivery ------------------------------- */

async function mailFeedback(feedback: Feedback): Promise<void> {
  await sendMail({
    // The address is optional in both extensions, so only reply to a
    // plausible one — a malformed replyTo can bounce the whole message.
    ...(looksLikeEmail(feedback.email) ? { replyTo: feedback.email } : {}),
    subject: `[datapip.de] Feedback — ${feedback.source}`,
    text: [
      `Source:  ${feedback.source}`,
      `Name:    ${feedback.name || "-"}`,
      `Email:   ${feedback.email || "-"}`,
      "",
      feedback.message,
    ].join("\n"),
  });
}

/** Same collection and field names v1 wrote, so existing rows stay uniform. */
async function storeInPocketBase(feedback: Feedback): Promise<void> {
  if (!PB_ENDPOINT || !PB_USER || !PB_PASSWORD) {
    throw new Error("PocketBase is not configured");
  }

  const { default: PocketBase } = await import("pocketbase");
  const pb = new PocketBase(PB_ENDPOINT);

  await pb.collection("users").authWithPassword(PB_USER, PB_PASSWORD);

  await pb.collection("feedback").create({
    source: feedback.source,
    name: feedback.name,
    email: feedback.email,
    message: feedback.message,
    // Never sent by either extension; v1 stored it, so the shape is kept.
    publish: false,
  });
}

/**
 * Mail and PocketBase in parallel, and **either one landing counts as
 * received** — because it genuinely was. A partial failure is loud in the
 * logs so it gets fixed, but it is not reported to the sender.
 *
 * This is the opposite call from the one CLAUDE.md warns about on the contact
 * form, and deliberately so. There, reporting "sent" while SMTP was down left
 * an enquiry unread in a database nobody watched. Here PocketBase is the
 * channel that notifies, so a stored row IS a delivered message — and
 * reporting failure would only make someone send their feedback twice.
 */
async function deliver(feedback: Feedback): Promise<boolean> {
  const [mail, stored] = await Promise.allSettled([
    mailFeedback(feedback),
    storeInPocketBase(feedback),
  ]);

  if (mail.status === "rejected") {
    console.error("[feedback] mail failed:", mail.reason);
  }
  if (stored.status === "rejected") {
    console.error("[feedback] PocketBase failed:", stored.reason);
  }

  return mail.status === "fulfilled" || stored.status === "fulfilled";
}
