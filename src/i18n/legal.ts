/**
 * Legal pages: operator details plus the Impressum and Datenschutzerklärung
 * copy, keyed by locale.
 *
 * The contact details are ported verbatim from v1 `lib/const.ts` and the
 * Impressum text verbatim from v1's `impressum` / `imprint` pages — this is
 * binding content, so it is copied, never reworded or re-translated.
 *
 * The privacy text is deliberately NOT a verbatim port. v2's data flows are
 * not v1's: there is no PocketBase behind the contact form, the cookie
 * scanner is new, analytics moved to a client-side cookieless script, and
 * v1's two technical cookies no longer exist. Each section below describes
 * what this build actually does.
 */

import type { Locale } from "./ui";

const email = "info@datapip.de",
  taxId = "DE458020041";

export const legalContact = {
  de: {
    name: "datapip - Philipp Jäckle",
    address: [
      "c/o Online-Impressum.de #5021",
      "Europaring 90",
      "53757 Sankt Augustin",
      "Deutschland",
    ],
    email: email,
    taxId: taxId,
  },
  en: {
    name: "datapip - Philipp Jaeckle",
    address: [
      "c/o Online-Impressum.de #5021",
      "Europaring 90",
      "53757 Sankt Augustin",
      "Germany",
    ],
    email: email,
    taxId: taxId,
  },
} as const satisfies Record<Locale, unknown>;

/**
 * One clause: lead prose, an optional bulleted list, and optional prose after
 * the list. `outro` exists so the rights clause keeps v1's order — list first,
 * closing sentence last — without the renderer having to guess.
 */
export interface LegalSection {
  heading: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
  outro?: readonly string[];
}

export const legal = {
  de: {
    imprint: {
      title: "Impressum | datapip.de",
      description:
        "Impressum und rechtliche Angaben zu Philipp Jäckle / datapip.de.",
      eyebrow: "Rechtliches",
      heading: "Impressum",
      labels: {
        name: "Name",
        address: "Anschrift",
        email: "E-Mail",
        taxId: "Umsatzsteuer-ID",
        contactForm: "Kontaktformular",
      },
      sections: [
        {
          heading: "Verbraucherstreitbeilegung / Universalschlichtungsstelle",
          paragraphs: [
            "Als freiberuflicher Dienstleister bin ich weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Dies gilt insbesondere, da meine Leistungen in der Regel an Unternehmen (B2B) gerichtet sind.",
          ],
        },
        {
          heading: "Haftungsausschluss (Disclaimer)",
          paragraphs: [
            "Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Informationen kann ich jedoch keine Gewähr übernehmen.",
          ],
        },
      ],
    },
    privacy: {
      title: "Datenschutz | datapip.de",
      description:
        "Informationen zum Datenschutz: Hosting, Kontaktformular, Cookie-Scanner, Reichweitenmessung und Ihre Rechte gemäß DSGVO.",
      eyebrow: "Rechtliches",
      heading: "Datenschutz",
      updated: "Stand: September 2026",
      intro: {
        heading: "Allgemeine Hinweise",
        paragraphs: [
          "Personenbezogene Daten sind alle Informationen, mit denen Sie persönlich identifiziert werden können. Diese Datenschutzerklärung erläutert, welche Daten wir erheben, wie wir sie nutzen und welche Rechte Sie haben.",
        ],
      },
      responsible: {
        heading: "Verantwortliche Stelle",
        intro:
          "Verantwortlich für die Datenverarbeitung auf dieser Website ist:",
        contactForm: "Kontaktformular",
      },
      sections: [
        {
          heading: "Hosting",
          paragraphs: [
            "Diese Website wird auf Servern der Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland, gehostet. Zur Nutzung von Hetzner besteht ein Vertrag zur Auftragsverarbeitung (AVV) gemäß Art. 28 DSGVO.",
          ],
        },
        {
          heading: "Cloudflare",
          paragraphs: [
            "Zur Absicherung und Optimierung der Ladezeiten nutzen wir Cloudflare. Dabei werden IP-Adressen und Zugriffsdaten verarbeitet, um Angriffe abzuwehren und Inhalte schneller auszuliefern. Die Datenverarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Sicherheit und schneller Bereitstellung der Inhalte). Für Cloudflare besteht ebenfalls ein AVV bzw. es kommen Standardvertragsklauseln zur Anwendung.",
          ],
        },
        {
          heading: "Kontaktformular",
          paragraphs: [
            "Wenn Sie uns über das Kontaktformular eine Anfrage senden, werden Ihre Angaben (Name, E-Mail-Adresse, optionaler Betreff und Ihre Nachricht) ausschließlich per E-Mail an uns übermittelt und zur Bearbeitung Ihrer Anfrage verwendet. Eine Speicherung in einer Datenbank findet nicht statt; die Daten verbleiben in unserem E-Mail-Postfach, solange dies zur Bearbeitung erforderlich ist. Wir geben diese Daten nicht ohne Ihre Einwilligung weiter. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) oder lit. f (berechtigtes Interesse).",
          ],
        },
        {
          heading: "Cookie-Scanner",
          paragraphs: [
            "Auf dieser Website können Sie eine beliebige URL eingeben und prüfen lassen, welche Cookies die betreffende Seite setzt, bevor eine Consent-Entscheidung getroffen wurde. Die Prüfung führt unser Server mit einem automatisierten Browser durch: Die angegebene Seite wird von unserem Server aufgerufen, nicht von Ihrem Browser. Die geprüfte Website sieht daher die IP-Adresse unseres Servers und nicht Ihre.",
            "Die eingegebene Adresse und das Prüfergebnis werden für fünf Minuten im Arbeitsspeicher zwischengespeichert, damit wiederholte Abfragen derselben Adresse keinen erneuten Seitenaufruf auslösen. Zur Missbrauchsvermeidung wird Ihre IP-Adresse für maximal zehn Minuten im Arbeitsspeicher vorgehalten, um die Zahl der Prüfungen pro Nutzer zu begrenzen. Eine dauerhafte Speicherung, eine Protokollierung der geprüften Adressen oder eine Zusammenführung mit anderen Daten findet nicht statt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am Betrieb und am Schutz des Angebots).",
          ],
        },
        {
          heading: "SSL-/TLS-Verschlüsselung",
          paragraphs: [
            "Diese Seite nutzt eine SSL-/TLS-Verschlüsselung, um die Übertragung vertraulicher Inhalte zu schützen. Daten, die Sie übermitteln, können so nicht von Dritten mitgelesen werden.",
          ],
        },
        {
          heading: "Webanalyse (Umami)",
          paragraphs: [
            "Diese Website nutzt Umami Analytics, eine datenschutzfreundliche Open-Source-Analysesoftware. Umami wird von uns selbst auf einer eigenen Subdomain (measure.datapip.de) betrieben – es findet keine Datenübermittlung an Dritte statt.",
            "Die Messung erfolgt cookielos: Es werden keine Cookies gesetzt und keine Informationen auf Ihrem Endgerät gespeichert oder ausgelesen. Erfasst werden aggregierte Angaben wie die aufgerufene Seite, der Referrer, die ungefähre Herkunft, Gerätetyp und Browser. IP-Adressen werden nicht gespeichert. Es werden keine personenbezogenen Daten erhoben, die eine Identifikation einzelner Personen ermöglichen würden.",
            "Da kein Zugriff auf Informationen in Ihrem Endgerät erfolgt, ist eine Einwilligung nach § 25 TDDDG nicht erforderlich. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Optimierung des Angebots).",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "Diese Website setzt keine Cookies – weder für die Reichweitenmessung noch für die Spracherkennung. Die passende Sprachversion wird anhand der von Ihrem Browser übermittelten Spracheinstellung (Accept-Language) ausgewählt, ohne dass dafür etwas auf Ihrem Gerät gespeichert wird.",
            "Auch vergleichbare Technologien wie Local Storage oder Session Storage werden nicht zur Wiedererkennung eingesetzt. Eine Einwilligung nach § 25 TDDDG ist daher nicht erforderlich, und aus demselben Grund gibt es kein Cookie-Banner.",
          ],
        },
        {
          heading: "Logfile-Analyse",
          paragraphs: [
            "Zur Sicherstellung des ordnungsgemäßen Betriebs unserer Website und zum Schutz vor Cyberangriffen analysieren wir die von unserem Server automatisch erfassten Logfiles. Dabei werden Daten wie IP-Adresse, verwendeter Browser, Betriebssystem, Zugriffszeitpunkt und aufgerufene URL verarbeitet. Die Verarbeitung erfolgt auf Grundlage unseres berechtigten Interesses gemäß Art. 6 Abs. 1 lit. f DSGVO zur Gewährleistung der IT-Sicherheit und zur Optimierung unseres Angebots. Die gespeicherten Daten werden ausschließlich zur Fehleranalyse, Abwehr von Angriffen und Verbesserung der Systemstabilität genutzt.",
          ],
        },
        {
          heading: "Ihre Rechte",
          items: [
            "Auskunft über die gespeicherten personenbezogenen Daten (Art. 15 DSGVO)",
            "Berichtigung unrichtiger Daten (Art. 16 DSGVO)",
            "Löschung oder Einschränkung der Verarbeitung (Art. 17, 18 DSGVO)",
            "Datenübertragbarkeit (Art. 20 DSGVO)",
            "Widerruf erteilter Einwilligungen jederzeit (Art. 7 Abs. 3 DSGVO)",
            "Beschwerderecht bei einer Aufsichtsbehörde",
          ],
          outro: [
            "Zur Ausübung Ihrer Rechte können Sie sich jederzeit an die oben angegebene E-Mail-Adresse wenden.",
          ],
        },
      ],
    },
  },
  en: {
    imprint: {
      title: "Imprint | datapip.de",
      description:
        "Imprint and legal information for Philipp Jäckle / datapip.de.",
      eyebrow: "Legal",
      heading: "Imprint",
      labels: {
        name: "Name",
        address: "Address",
        email: "Email",
        taxId: "VAT ID",
        contactForm: "Contact form",
      },
      sections: [
        {
          heading: "Consumer Dispute Resolution / Universal Arbitration Board",
          paragraphs: [
            "As a freelance service provider, I am neither obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board. This particularly applies as my services are generally aimed at businesses (B2B).",
          ],
        },
        {
          heading: "Disclaimer",
          paragraphs: [
            "The content of this website has been created with the utmost care. However, I cannot guarantee the accuracy, completeness, or timeliness of the information provided.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy Policy | datapip.de",
      description:
        "Privacy information: hosting, contact form, cookie scanner, analytics and your rights under the GDPR.",
      eyebrow: "Legal",
      heading: "Privacy Policy",
      updated: "Last updated: September 2026",
      intro: {
        heading: "General Information",
        paragraphs: [
          "Personal data is any information that can be used to identify you personally. This privacy policy explains what data we collect, how we use it, and your rights.",
        ],
      },
      responsible: {
        heading: "Responsible Party",
        intro: "The responsible party for data processing on this website is:",
        contactForm: "Contact form",
      },
      sections: [
        {
          heading: "Hosting",
          paragraphs: [
            "This website is hosted on servers of Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Germany. A data processing agreement (DPA) according to Art. 28 GDPR is in place for the use of Hetzner.",
          ],
        },
        {
          heading: "Cloudflare",
          paragraphs: [
            "To ensure security and optimize loading times, we use Cloudflare. In doing so, IP addresses and access data are processed to prevent attacks and deliver content more quickly. Data processing is based on Article 6(1)(f) of the GDPR (legitimate interest in security and fast content delivery). A data processing agreement (DPA) with Cloudflare exists, and standard contractual clauses are also applied.",
          ],
        },
        {
          heading: "Contact Form",
          paragraphs: [
            "If you send us an enquiry via the contact form, your details (name, email address, optional subject and your message) are transmitted to us by email only and used to process your enquiry. They are not written to a database; the data remains in our mailbox for as long as handling your request requires. We will not share this data without your consent. The legal basis is Art. 6 (1) (b) GDPR (contract initiation) or (f) (legitimate interest).",
          ],
        },
        {
          heading: "Cookie Scanner",
          paragraphs: [
            "On this website you can enter any URL and have it checked for the cookies that page sets before a consent decision has been made. The check is performed by our server using an automated browser: the page you name is requested by our server, not by your browser. The site being checked therefore sees the IP address of our server and not yours.",
            "The address you enter and the result are cached in memory for five minutes so that repeated queries for the same address do not trigger another page load. To prevent abuse, your IP address is held in memory for at most ten minutes in order to limit the number of checks per user. There is no permanent storage, no log of the addresses checked, and no combination with other data. The legal basis is Art. 6 (1) (f) GDPR (legitimate interest in operating and protecting the service).",
          ],
        },
        {
          heading: "SSL/TLS Encryption",
          paragraphs: [
            "This site uses SSL/TLS encryption to protect the transmission of confidential content. Data you submit cannot be read by third parties.",
          ],
        },
        {
          heading: "Web Analytics (Umami)",
          paragraphs: [
            "This website uses Umami Analytics, a privacy-friendly open-source analytics tool. We host Umami ourselves on our own subdomain (measure.datapip.de) — no data is transmitted to third parties.",
            "Measurement is cookieless: no cookies are set, and no information is stored on or read from your device. What is recorded is aggregate information such as the page requested, the referrer, approximate origin, device type and browser. IP addresses are not stored. No personal data is collected that would allow the identification of individual users.",
            "As no information on your device is accessed, no consent under § 25 TDDDG is required. Processing is based on Art. 6 (1) (f) GDPR (legitimate interest in optimizing the offering).",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "This website sets no cookies — neither for analytics nor for language detection. The appropriate language version is selected from the language preference your browser sends (Accept-Language), without anything being stored on your device.",
            "Comparable technologies such as local storage or session storage are not used for recognition either. No consent under § 25 TDDDG is therefore required, and for the same reason there is no cookie banner.",
          ],
        },
        {
          heading: "Logfile Analysis",
          paragraphs: [
            "To ensure the proper operation of our website and to protect against cyberattacks, we analyze the logfiles automatically recorded by our server. This includes processing data such as IP address, browser used, operating system, access time, and requested URL. The processing is based on our legitimate interest according to Art. 6 para. 1 lit. f GDPR to ensure IT security and to optimize our offer. The stored data is used exclusively for error analysis, attack prevention, and improving system stability.",
          ],
        },
        {
          heading: "Your Rights",
          items: [
            "Right to access stored personal data (Art. 15 GDPR)",
            "Right to correct inaccurate data (Art. 16 GDPR)",
            "Right to delete or restrict processing (Art. 17, 18 GDPR)",
            "Right to data portability (Art. 20 GDPR)",
            "Right to withdraw consent at any time (Art. 7 (3) GDPR)",
            "Right to lodge a complaint with a supervisory authority",
          ],
          outro: [
            "To exercise your rights, you can contact the above email address at any time.",
          ],
        },
      ],
    },
  },
} as const satisfies Record<
  Locale,
  {
    imprint: { sections: readonly LegalSection[] } & Record<string, unknown>;
    privacy: {
      intro: LegalSection;
      sections: readonly LegalSection[];
    } & Record<string, unknown>;
  }
>;
