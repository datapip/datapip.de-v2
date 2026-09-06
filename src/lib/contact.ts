import { ui, type Locale } from "../i18n/ui";
import { isMailConfigured, sendMail } from "./mailer";
import { createRecord, FEEDBACK_COLLECTION } from "./pocketbase";

export interface ContactValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactErrors {
  name?: string;
  email?: string;
  message?: string;
  form?: string;
}

export type ContactResult =
  | { status: "success" }
  | { status: "error"; errors: ContactErrors; values: ContactValues };

const MIN_MESSAGE_LENGTH = 20;

/**
 * v1 tagged contact enquiries with this, which is what tells them apart from
 * extension feedback in the same collection. Do not change it, or the history
 * splits in two.
 */
const CONTACT_SOURCE = "datapip";

/** Deliberately permissive: the only authority on an address is delivery. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function handleContactSubmission(
  formData: FormData,
  lang: Locale,
): Promise<ContactResult> {
  const t = ui[lang].contactPage;

  const values: ContactValues = {
    name: asString(formData.get("name")),
    email: asString(formData.get("email")),
    subject: asString(formData.get("subject")),
    message: asString(formData.get("message")),
  };

  // Honeypot: a field hidden from people but filled in by naive bots.
  // Report success so the bot has nothing to learn from, and send nothing.
  if (asString(formData.get("company")) !== "") {
    return { status: "success" };
  }

  const errors: ContactErrors = {};
  if (values.name.length === 0) errors.name = t.errors.name;
  if (!looksLikeEmail(values.email)) errors.email = t.errors.email;
  if (values.message.length < MIN_MESSAGE_LENGTH) errors.message = t.errors.message;

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  // Checked before sending so a half-configured host reports a clear
  // configuration error rather than a generic send failure.
  if (!isMailConfigured()) {
    return { status: "error", errors: { form: t.errors.config }, values };
  }

  const [mail, stored] = await Promise.allSettled([
    sendMail({
      replyTo: `${values.name} <${values.email}>`,
      subject: values.subject
        ? `[datapip.de] ${values.subject}`
        : `[datapip.de] ${lang.toUpperCase()} enquiry from ${values.name}`,
      text: [
        `Name:    ${values.name}`,
        `Email:   ${values.email}`,
        `Subject: ${values.subject || "-"}`,
        `Locale:  ${lang}`,
        "",
        values.message,
      ].join("\n"),
    }),
    storeEnquiry(values),
  ]);

  if (stored.status === "rejected") {
    console.error("[contact] PocketBase write failed:", stored.reason);
  }

  /* What the visitor is told tracks the MAIL, not "either channel landed".
     v1 returned success when either did, so with SMTP down a visitor saw
     "sent" while the enquiry sat in a database nobody was watching. The row
     exists for durability — so a failed send is recoverable instead of lost —
     and durability is not the same thing as delivery. */
  if (mail.status === "rejected") {
    console.error("[contact] send failed:", mail.reason);
    console.error(
      stored.status === "fulfilled"
        ? `[contact] the enquiry IS stored in "${FEEDBACK_COLLECTION}" and can be recovered from there`
        : "[contact] BOTH channels failed — this enquiry is lost",
    );
    return { status: "error", errors: { form: t.errors.send }, values };
  }

  return { status: "success" };
}

/**
 * The durable copy of an enquiry, in the collection v1 used.
 *
 * That collection has no subject field, so the subject rides at the top of
 * the message rather than being dropped: this row is what survives a failed
 * send, and it must not hold less than the email would have.
 */
async function storeEnquiry(values: ContactValues): Promise<void> {
  await createRecord(FEEDBACK_COLLECTION, {
    source: CONTACT_SOURCE,
    name: values.name,
    email: values.email,
    message: values.subject
      ? `${values.subject}\n\n${values.message}`
      : values.message,
    publish: false,
  });
}
