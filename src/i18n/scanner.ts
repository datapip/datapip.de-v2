/**
 * Cookie scanner page copy, keyed by locale.
 *
 * The page copy, form labels and the "how to copy a CSS selector" list are
 * ported from v1's `(shared)/(crawler)` components. The consent-comparison
 * strings are new: v1 clicked the banner and reported one snapshot, so it had
 * nothing to compare. v2 always keeps the pre-consent pass and reports the
 * delta, which is the whole argument of the tool.
 */

import type { Locale } from "./ui";

export const scanner = {
  de: {
    meta: {
      title: "Cookie-Scanner | Cookies vor Consent prüfen | datapip.de",
      description:
        "Kostenloses Tool: prüft, welche Cookies, Storage-Einträge und Requests eine Webseite setzt, bevor eine Consent-Entscheidung getroffen wurde. Optional mit Vorher-Nachher-Vergleich.",
      keywords:
        "Cookie-Scanner, Cookies prüfen, Consent, DSGVO, TDDDG, Local Storage, Tracking, Datenschutz",
    },
    eyebrow: "Werkzeug",
    h1: "Cookie-Scanner",
    lede: "Ein unkompliziertes Tool, das zeigt, welche Cookies, Sessions und Local-Storage-Daten auf einer Webseite gesetzt werden – schnell, transparent und ohne Registrierung.",

    form: {
      panelTitle: "Prüfung",
      urlLabel: "URL der Webseite",
      urlDescription:
        "Kopiere die vollständige URL der Webseite aus der Adresszeile des Browsers.",
      urlPlaceholder: "https://www.example.de",
      selectorLabel: "Einwilligungs-Button",
      selectorOptional: "optional",
      selectorDescription:
        "Gib einen klickbaren CSS-Selektor an – z. B. für den „Alle akzeptieren“-Button des Cookie-Banners. Ohne Angabe wird das Banner nicht angeklickt.",
      selectorHintTitle: "Selektor aus dem Browser kopieren",
      selectorHintSteps: [
        "Rechtsklick auf gewünschtes Element",
        'Klick auf "Untersuchen"',
        "Rechtsklick auf markiertes Element in geöffneten Entwicklertools",
        '"Kopieren" auswählen',
        'Klick auf "Selektor kopieren"',
      ],
      selectorPlaceholder: "button#accept-all",
      submit: "Prüfung starten",
      running: "Prüft …",
      runningHint: "Dies kann bis zu einer Minute dauern.",
    },

    result: {
      heading: "Ergebnis",
      on: "Auf",
      scannedIn: "geprüft in",
      metrics: {
        cookies: "Cookies vor Consent",
        cookiesAfter: "Cookies nach Consent",
        thirdPartyCookies: "davon Drittanbieter",
        storage: "Storage-Einträge",
        requests: "Requests",
        thirdPartyHosts: "fremde Hosts",
      },
      clean: {
        heading: "Keine Cookies vor Consent",
        body: "Sauber – vor der Consent-Entscheidung wird nichts gesetzt.",
      },
      tables: {
        cookies: "Cookies",
        storage: "Storage-Einträge",
        requests: "Beobachtete Requests",
      },
      columns: {
        name: "Name",
        value: "Wert",
        domain: "Domain",
        path: "Pfad",
        expiry: "Laufzeit",
        type: "Typ",
        storage: "Speicher",
        frame: "Frame",
        url: "URL",
        host: "Host",
      },
      party: { first: "First-Party", third: "Drittanbieter" },
      source: { http: "HTTP", js: "JS" },
      empty: "Nichts gefunden.",
      /** Shown instead of a number when no consent click was made. */
      notMeasured: "–",
      truncated: "Liste gekürzt – die Zahlen oben sind vollständig.",
      scrollHint: "Tabelle horizontal scrollbar",
    },

    consent: {
      heading: "Vorher / Nachher",
      body: "Der Einwilligungs-Button wurde geklickt und die Seite ein zweites Mal ausgelesen.",
      notClicked:
        "Der angegebene Selektor wurde nicht gefunden – es wurde nichts geklickt. Shadow DOM und iframes werden mitdurchsucht, ein Tippfehler im Selektor ist also die häufigste Ursache. Die Zahlen entsprechen dem Zustand vor Consent.",
      notClickable:
        "Der Selektor wurde gefunden, ließ sich aber nicht anklicken – das Element war verdeckt, unsichtbar oder deaktiviert. Die Zahlen entsprechen dem Zustand vor Consent.",
      before: "vor Consent",
      after: "nach Consent",
      added: "Nach Consent hinzugekommen",
      noChange: "Die Einwilligung hat keine zusätzlichen Cookies gesetzt.",
    },

    note: "Die Seite wird von unserem Server geladen, nicht von deinem Browser. Ohne Selektor wird das Consent-Banner nicht angeklickt.",
    noscript:
      "Für die Prüfung wird JavaScript benötigt. Alternativ gerne per E-Mail melden.",

    errors: {
      invalid: "Bitte eine vollständige Adresse angeben, z. B. ihre-domain.de",
      private: "Nur öffentlich erreichbare Adressen können geprüft werden.",
      busy: "Gerade laufen zu viele Prüfungen. Bitte in einer Minute erneut versuchen.",
      limit: "Zu viele Prüfungen von dieser Adresse. Bitte später erneut versuchen.",
      failed: "Die Seite konnte nicht geladen werden.",
      title: "Fehler",
      unknown: "Es gab einen unbekannten Fehler.",
    },
  },

  en: {
    meta: {
      title: "Cookie Crawler | Check cookies before consent | datapip.de",
      description:
        "Free tool: checks which cookies, storage entries and requests a website sets before any consent decision has been made. Optional before/after comparison.",
      keywords:
        "cookie crawler, cookie scanner, consent, GDPR, TDDDG, local storage, tracking, privacy",
    },
    eyebrow: "Tool",
    h1: "Cookie Crawler",
    lede: "A simple tool that shows which cookies, sessions, and local storage data are set on a website – fast, transparent, and without registration.",

    form: {
      panelTitle: "Scan",
      urlLabel: "Website URL",
      urlDescription:
        "Copy the full URL of the website from your browser’s address bar.",
      urlPlaceholder: "https://www.example.com",
      selectorLabel: "Consent Button",
      selectorOptional: "optional",
      selectorDescription:
        "Enter a clickable CSS selector – for example, for the “Accept all” button of the cookie banner. Left empty, the banner is not clicked.",
      selectorHintTitle: "Copy a selector from your browser",
      selectorHintSteps: [
        "Right-click on the desired element",
        "Click on ‘Inspect’",
        "Right-click on the highlighted element in the developer tools",
        "Select ‘Copy’",
        "Click on ‘Copy selector’",
      ],
      selectorPlaceholder: "button#accept-all",
      submit: "Start scan",
      running: "Scanning …",
      runningHint: "This may take up to a minute.",
    },

    result: {
      heading: "Result",
      on: "On",
      scannedIn: "scanned in",
      metrics: {
        cookies: "cookies before consent",
        cookiesAfter: "cookies after consent",
        thirdPartyCookies: "of those third-party",
        storage: "storage entries",
        requests: "requests",
        thirdPartyHosts: "third-party hosts",
      },
      clean: {
        heading: "No cookies before consent",
        body: "Clean – nothing is set before the consent decision.",
      },
      tables: {
        cookies: "Cookies",
        storage: "Storage entries",
        requests: "Observed requests",
      },
      columns: {
        name: "Name",
        value: "Value",
        domain: "Domain",
        path: "Path",
        expiry: "Lifetime",
        type: "Type",
        storage: "Storage",
        frame: "Frame",
        url: "URL",
        host: "Host",
      },
      party: { first: "first-party", third: "third-party" },
      source: { http: "HTTP", js: "JS" },
      empty: "Nothing found.",
      notMeasured: "–",
      truncated: "List truncated – the counts above are complete.",
      scrollHint: "Table scrolls horizontally",
    },

    consent: {
      heading: "Before / after",
      body: "The consent button was clicked and the page read a second time.",
      notClicked:
        "The given selector was not found – nothing was clicked. Shadow DOM and iframes are searched too, so a typo in the selector is the most likely cause. The numbers reflect the state before consent.",
      notClickable:
        "The selector matched an element, but it could not be clicked – it was covered, invisible or disabled. The numbers reflect the state before consent.",
      before: "before consent",
      after: "after consent",
      added: "Added after consent",
      noChange: "Consent did not set any additional cookies.",
    },

    note: "The page is loaded by our server, not by your browser. Without a selector the consent banner is not clicked.",
    noscript:
      "The scan needs JavaScript. Happy to run one for you by email instead.",

    errors: {
      invalid: "Please enter a full address, e.g. your-domain.com",
      private: "Only publicly reachable addresses can be scanned.",
      busy: "Too many scans running right now. Please try again in a minute.",
      limit: "Too many scans from this address. Please try again later.",
      failed: "The page could not be loaded.",
      title: "Error",
      unknown: "An unknown error occurred.",
    },
  },
} as const satisfies Record<Locale, unknown>;
