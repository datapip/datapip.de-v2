import { ui, type Locale } from "../i18n/ui";
import { isMailConfigured, sendMail } from "./mailer";

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

  try {
    await sendMail({
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
    });

    return { status: "success" };
  } catch (error) {
    console.error("[contact] send failed:", error);
    return { status: "error", errors: { form: t.errors.send }, values };
  }
}
