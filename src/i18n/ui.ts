export const locales = ["de", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/**
 * Localised path segments. Keys stay stable across locales; values do not.
 *
 * `cookieScanner`, `dataLayerChecker` and `decoder` are reserved slugs — the
 * pages do not exist yet, so nothing links to them. They are kept here so the
 * v1 URLs are not accidentally reassigned when those pages are built.
 */
export const routes = {
  de: {
    cookieScanner: "cookie-scanner",
    dataLayerChecker: "data-layer-checker",
    decoder: "de-kodierer",
    privacy: "datenschutz",
    imprint: "impressum",
    contact: "kontakt",
  },
  en: {
    cookieScanner: "cookie-crawler",
    dataLayerChecker: "data-layer-crawler",
    decoder: "de-coder",
    privacy: "privacy",
    imprint: "imprint",
    contact: "contact",
  },
} as const satisfies Record<Locale, Record<string, string>>;

/** On-page anchors, localised the same way v1 did it. */
export const sections = {
  de: {
    services: "leistungen",
    testimonials: "referenzen",
    projects: "projekte",
    about: "ueber-mich",
    contact: "kontakt",
  },
  en: {
    services: "services",
    testimonials: "testimonials",
    projects: "projects",
    about: "about-me",
    contact: "contact",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export const ui = {
  de: {
    htmlLang: "de-DE",
    ogLocale: "de_DE",
    meta: {
      title: "Digital Analytics & Development | Philipp Jäckle | datapip.de",
      description:
        "Digital Analyst mit 10+ Jahren Erfahrung in Web Analytics, Tag Management, Consent Management & Web Development.",
      ogImageAlt:
        "datapip.de – Philipp Jäckle, Privacy-Focused Digital Analyst",
    },
    nav: {
      links: [
        { key: "services", label: "Leistungen" },
        { key: "testimonials", label: "Referenzen" },
        { key: "projects", label: "Projekte" },
      ],
      cta: "Anfrage",
      skipToContent: "Zum Inhalt springen",
      languageLabel: "Sprache wechseln",
      navLabel: "Hauptnavigation",
      menuLabel: "Menü",
      menuClose: "Schließen",
    },
    hero: {
      kicker: "Hi, ich bin Pip",
      titleLead: "Privacy-Focused",
      titleTail: "Digital Analyst",
      lede: "Mit über 10 Jahren Erfahrung unterstütze ich bei der Einrichtung und Fehleranalyse von Tracking-Implementierungen – client-seitig, server-seitig oder cookieless, stets DSGVO- und TDDDG-konform.",
      stats: [
        { value: "10+", label: "Jahre Erfahrung" },
        { value: "3", label: "Eigene Tools" },
        { value: "DSGVO", label: "& TDDDG" },
      ],
    },
    scan: {
      title: "Cookie-Scanner",
      ready: "Bereit",
      scanning: "Prüft …",
      done: "Geprüft",
      urlLabel: "Adresse der zu prüfenden Seite",
      placeholder: "https://ihre-domain.de",
      submit: "Prüfen",
      idleHint:
        "Prüft, welche Cookies gesetzt werden, bevor eine Consent-Entscheidung getroffen wurde.",
      resultLabel: "Cookies vor Consent",
      thirdParty: "von Drittanbietern",
      storage: "Storage-Einträge",
      more: "weitere",
      cleanHeading: "Keine Cookies vor Consent",
      cleanBody: "Sauber – vor der Consent-Entscheidung wird nichts gesetzt.",
      note: "Es wird nur die angegebene Seite geladen, ohne Klick auf das Consent-Banner.",
      noscript:
        "Für die Live-Prüfung wird JavaScript benötigt. Alternativ gerne per E-Mail melden.",
      errors: {
        invalid: "Bitte eine vollständige Adresse angeben, z. B. ihre-domain.de",
        private: "Nur öffentlich erreichbare Adressen können geprüft werden.",
        busy: "Gerade laufen zu viele Prüfungen. Bitte in einer Minute erneut versuchen.",
        limit: "Zu viele Prüfungen von dieser Adresse. Bitte später erneut versuchen.",
        failed: "Die Seite konnte nicht geladen werden.",
      },
    },
    services: {
      eyebrow: "Leistungen",
      heading: "Womit ich helfen kann",
      lede: "Egal ob Tracking-Fehler, Consent-Problem oder technische Stolpersteine – lassen Sie uns in einem unverbindlichen Erstgespräch schauen, ob ich helfen kann.",
      items: [
        {
          title: "Tracking-Debugging",
          body: "Ich analysiere bestehende Implementierungen, identifiziere Fehlerquellen und optimiere Data Layer, Tag-Auslösungen und Consent-Logiken.",
          tags: ["Tag Debugging", "Data Layer QA", "Consent", "Analytics QA"],
        },
        {
          title: "Tracking-Setup",
          body: "Client-seitig, server-seitig oder cookieless – inklusive Anbindung von Consent-Management-Systemen. Sauber, skalierbar, dokumentiert.",
          tags: ["Adobe Analytics", "Google Tag Manager", "Server-side", "Architektur"],
        },
        {
          title: "Tracking-Tools",
          body: "Scanner, Checker und De-Kodierer – direkt im Browser nutzbar, ohne Anmeldung und kostenlos.",
          tags: ["Cookie-Scanner", "Data Layer Checker", "De-Kodierer"],
        },
      ],
    },
    footer: {
      tagline: "Privacy-Focused Digital Analyst",
      imprint: "Impressum",
      privacy: "Datenschutz",
      rights: "Alle Rechte vorbehalten.",
    },
    contactPage: {
      title: "Kontakt | datapip.de",
      description:
        "Kostenlose Ersteinschätzung zu Tracking, Consent und Datenqualität – schreiben Sie mir.",
      eyebrow: "Kontakt",
      heading: "Erzählen Sie mir vom Problem",
      lede: "Je konkreter, desto besser: Welche Seite, welches Tool, was genau stimmt nicht? Ich melde mich in der Regel innerhalb von zwei Werktagen.",
      fields: {
        name: "Name",
        email: "E-Mail",
        subject: "Betreff",
        message: "Nachricht",
      },
      hints: {
        subject: "Optional",
        message: "Mindestens 20 Zeichen",
      },
      submit: "Anfrage senden",
      required: "Pflichtfeld",
      success: {
        heading: "Nachricht ist angekommen",
        body: "Danke – ich melde mich in der Regel innerhalb von zwei Werktagen. Eine Kopie geht nicht automatisch an Sie; notieren Sie sich bei Bedarf, was Sie geschrieben haben.",
        back: "Zurück zur Startseite",
      },
      errors: {
        name: "Bitte geben Sie einen Namen an.",
        email: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
        message: "Bitte beschreiben Sie Ihr Anliegen mit mindestens 20 Zeichen.",
        send: "Die Nachricht konnte nicht gesendet werden. Bitte schreiben Sie direkt an info@datapip.de.",
        config:
          "Der Mailversand ist auf diesem Server nicht konfiguriert. Bitte schreiben Sie direkt an info@datapip.de.",
        summary: "Bitte korrigieren Sie die markierten Felder.",
      },
      alternative: "Lieber direkt per Mail?",
    },
    notFound: {
      title: "Seite nicht gefunden | datapip.de",
      code: "Fehler 404",
      heading: "Diese Seite gibt es nicht",
      body: "Der Link ist veraltet oder enthält einen Tippfehler. Von der Startseite aus finden Sie alles Weitere.",
      cta: "Zur Startseite",
    },
  },

  en: {
    htmlLang: "en-US",
    ogLocale: "en_US",
    meta: {
      title: "Digital Analytics & Development | Philipp Jäckle | datapip.de",
      description:
        "Digital Analyst with 10+ years of experience in Web Analytics, Tag Management, Consent Management & Web Development.",
      ogImageAlt:
        "datapip.de – Philipp Jaeckle, Privacy-Focused Digital Analyst",
    },
    nav: {
      links: [
        { key: "services", label: "Services" },
        { key: "testimonials", label: "Testimonials" },
        { key: "projects", label: "Projects" },
      ],
      cta: "Get in touch",
      skipToContent: "Skip to content",
      languageLabel: "Switch language",
      navLabel: "Main navigation",
      menuLabel: "Menu",
      menuClose: "Close",
    },
    hero: {
      kicker: "Hey, I am Pip",
      titleLead: "Privacy-Focused",
      titleTail: "Digital Analyst",
      lede: "With over 10 years of experience, I help set up and debug tracking implementations – client-side, server-side, or cookieless, always compliant with GDPR and TDDDG.",
      stats: [
        { value: "10+", label: "Years experience" },
        { value: "3", label: "Tools built" },
        { value: "GDPR", label: "& TDDDG" },
      ],
    },
    scan: {
      title: "Cookie Crawler",
      ready: "Ready",
      scanning: "Scanning …",
      done: "Scanned",
      urlLabel: "Address of the page to check",
      placeholder: "https://your-domain.com",
      submit: "Scan",
      idleHint:
        "Checks which cookies are set before any consent decision has been made.",
      resultLabel: "cookies before consent",
      thirdParty: "third-party",
      storage: "storage entries",
      more: "more",
      cleanHeading: "No cookies before consent",
      cleanBody: "Clean – nothing is set before the consent decision.",
      note: "Only the given page is loaded, with no click on the consent banner.",
      noscript:
        "The live scan needs JavaScript. Happy to run one for you by email instead.",
      errors: {
        invalid: "Please enter a full address, e.g. your-domain.com",
        private: "Only publicly reachable addresses can be scanned.",
        busy: "Too many scans running right now. Please try again in a minute.",
        limit: "Too many scans from this address. Please try again later.",
        failed: "The page could not be loaded.",
      },
    },
    services: {
      eyebrow: "Services",
      heading: "What I can help with",
      lede: "Tracking bug, consent problem, or a technical dead end – let us use a no-obligation first call to work out whether I can help.",
      items: [
        {
          title: "Tracking debugging",
          body: "I audit existing implementations, find the source of the error, and fix data layers, tag triggers and consent logic.",
          tags: ["Tag debugging", "Data layer QA", "Consent", "Analytics QA"],
        },
        {
          title: "Tracking setup",
          body: "Client-side, server-side or cookieless – including consent management integration. Clean, scalable, documented.",
          tags: ["Adobe Analytics", "Google Tag Manager", "Server-side", "Architecture"],
        },
        {
          title: "Tracking tools",
          body: "Crawler, checker and decoder – usable straight from the browser, no sign-up, free.",
          tags: ["Cookie Crawler", "Data Layer Checker", "De-coder"],
        },
      ],
    },
    footer: {
      tagline: "Privacy-Focused Digital Analyst",
      imprint: "Imprint",
      privacy: "Privacy",
      rights: "All rights reserved.",
    },
    contactPage: {
      title: "Contact | datapip.de",
      description:
        "Free initial assessment on tracking, consent and data quality – get in touch.",
      eyebrow: "Contact",
      heading: "Tell me about the problem",
      lede: "The more specific the better: which site, which tool, what exactly is wrong? I usually reply within two working days.",
      fields: {
        name: "Name",
        email: "Email",
        subject: "Subject",
        message: "Message",
      },
      hints: {
        subject: "Optional",
        message: "At least 20 characters",
      },
      submit: "Send enquiry",
      required: "Required",
      success: {
        heading: "Message received",
        body: "Thanks – I usually reply within two working days. No copy is sent to you automatically, so keep your own note of what you wrote if you need it.",
        back: "Back to the homepage",
      },
      errors: {
        name: "Please enter a name.",
        email: "Please enter a valid email address.",
        message: "Please describe your enquiry in at least 20 characters.",
        send: "The message could not be sent. Please email info@datapip.de directly.",
        config:
          "Mail delivery is not configured on this server. Please email info@datapip.de directly.",
        summary: "Please correct the highlighted fields.",
      },
      alternative: "Prefer plain email?",
    },
    notFound: {
      title: "Page not found | datapip.de",
      code: "Error 404",
      heading: "This page does not exist",
      body: "The link is out of date or contains a typo. The homepage will get you everywhere else.",
      cta: "Go to homepage",
    },
  },
} as const;


type RouteKey = keyof (typeof routes)[typeof defaultLocale];

/** slug -> route key, per locale, so a localised slug can be looked back up. */
const routeKeyBySlug = Object.fromEntries(
  locales.map((locale) => [
    locale,
    Object.fromEntries(
      Object.entries(routes[locale]).map(([key, slug]) => [slug, key]),
    ),
  ]),
) as Record<Locale, Record<string, RouteKey | undefined>>;

/**
 * Swap the locale segment of a pathname AND translate the route slug, because
 * the slugs differ per locale: the English alternate of `/de/impressum/` is
 * `/en/imprint/`, not `/en/impressum/`. Emitting the untranslated slug points
 * hreflang and the language switcher at a 404.
 *
 * A slug with no entry in `routes` is passed through unchanged, so anchors and
 * any future nested path still resolve to something.
 *
 * The trailing slash is preserved so alternates and canonical agree —
 * mismatched trailing slashes read as two different URLs to a crawler.
 */
export function switchLocalePath(pathname: string, to: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (isLocale(segments[0])) {
    const from = segments[0];
    segments[0] = to;

    const key = segments[1] ? routeKeyBySlug[from][segments[1]] : undefined;
    if (key) segments[1] = routes[to][key];
  } else {
    segments.unshift(to);
  }

  const path = "/" + segments.join("/");
  return pathname.endsWith("/") || segments.length === 1 ? path + "/" : path;
}
