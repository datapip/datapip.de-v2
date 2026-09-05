/**
 * Product page content, keyed by locale.
 *
 * Copy is ported verbatim from v1's `(shared)/(products)` page components
 * and the metadata/JSON-LD from its `products/<slug>/page.tsx` routes. This is
 * commercial copy that is already indexed under these URLs — port it, do not
 * rewrite it.
 *
 * What is NOT ported: the lucide icons on the feature cards. Instrument
 * colours nothing decoratively, so the cards carry their title and text and
 * the mono grid does the structural work instead.
 *
 * `sectionEyebrow` is new — it is UI chrome for `Section.astro`, not content.
 */

import type { Locale } from "./ui";

export interface ProductFaq {
  q: string;
  a: string;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductStep {
  step: string;
  title: string;
  description: string;
}

/**
 * The two products describe themselves differently: Braze has one prose
 * block, Shopify has an intro, two named parts and a closing line. Both
 * shapes are supported rather than forcing one into the other.
 */
export interface ProductWhatIs {
  eyebrow: string;
  title: string;
  body?: string;
  intro?: string;
  points?: readonly ProductFeature[];
  closing?: string;
}

export interface ProductSchema {
  name: string;
  description: string;
  applicationCategory: string;
  applicationSubCategory: string;
  operatingSystem: string;
  featureList: readonly string[];
  keywords: string;
  breadcrumbHome: string;
}

export interface Product {
  /** Path after the locale, no leading or trailing slash. Indexed — do not change. */
  slug: string;
  gumroadUrl: string;
  /** Value sent as `data-umami-event-name` on both CTAs. */
  umamiName: string;
  meta: { title: string; description: string; keywords: string };
  eyebrow: string;
  h1: string;
  tagline: string;
  badges: readonly string[];
  cta: string;
  imageAlt: string;
  whatIs: ProductWhatIs;
  features: { eyebrow: string; title: string; items: readonly ProductFeature[] };
  steps: { eyebrow: string; title: string; items: readonly ProductStep[] };
  requirements: { eyebrow: string; title: string; items: readonly string[] };
  faq: { eyebrow: string; title: string; items: readonly ProductFaq[] };
  ctaSection: { title: string; description: string; button: string };
  schema: ProductSchema;
}

const BRAZE_GUMROAD = "https://datapip.gumroad.com/l/braze-sgtm-proxy";
const SHOPIFY_GUMROAD =
  "https://datapip.gumroad.com/l/shopify-pixel-gtm-ga4-gads";

export const products = {
  de: {
    brazeProxy: {
      slug: "products/braze-sgtm-proxy",
      gumroadUrl: BRAZE_GUMROAD,
      umamiName: "braze-sgtm-proxy",
      meta: {
        title: "Braze Custom Domain via sGTM | Adblocker umgehen | datapip.de",
        description:
          "Braze Custom Domain über den sGTM-Container einrichten. Braze Web SDK von der eigenen Domain ausliefern, Braze-Adblocker umgehen und die bestehende SDK-Integration unverändert behalten — Einrichtung in Minuten.",
        keywords:
          "Braze Custom Domain, Braze First-Party Endpoint, Braze Adblocker, sGTM Braze Proxy, Braze Web SDK Proxy, Server-Side GTM Braze, sGTM Client Template Braze, Braze Reverse Proxy, Adblocker Braze umgehen, Google Tag Manager Braze Integration, First-Party Braze Tracking",
      },
      eyebrow: "Produkt",
      h1: "sGTM Proxy Client für Braze™",
      tagline:
        "Ein Google Tag Manager Server-Side Client Template, das deinen sGTM-Container in eine Braze Custom Domain verwandelt – und in wenigen Minuten alle Braze-Requests an Adblockern vorbeileitet. Einfach einzurichten.",
      badges: [
        "sGTM Client Template",
        "Reverse Proxy",
        "First-Party",
        "DSGVO-konform",
      ],
      cta: "Template auf Gumroad holen",
      imageAlt:
        "Braze sGTM Proxy Client — Konfigurationsoberfläche in Google Tag Manager",
      whatIs: {
        eyebrow: "Überblick",
        title: "Was ist der Braze sGTM Proxy Client?",
        body: "Der Braze sGTM Proxy Client ist ein Google Tag Manager Server-Side Client Template, das als transparenter Reverse Proxy für das Braze Web SDK fungiert. Wenn ein Browser das Braze Web SDK anfordert, holt das Template die Datei und liefert sie direkt über den sGTM-Container aus — unter deiner eigenen Domain, nicht über Brazes CDN. Wenn das initialisierte SDK dann Braze-Requests sendet, treffen diese deinen sGTM-Endpoint, der sie an den konfigurierten Braze-Endpoint weiterleitet und die Antwort zurück an das SDK streamt. Ergebnis: Dein sGTM-Container wird zum Braze First-Party Endpoint — sämtlicher Braze-Netzwerkverkehr läuft über deine Domain, unsichtbar für Adblocker, während das Web SDK wie gewohnt funktioniert.",
      },
      features: {
        eyebrow: "Funktionen",
        title: "Funktionen",
        items: [
          {
            title: "Web SDK ausliefern",
            description:
              "Die Braze Web SDK-Datei wird von deinem sGTM-Endpoint geholt und ausgeliefert. Browser fordern sie von deiner Domain an — nie direkt von Brazes CDN.",
          },
          {
            title: "Requests weiterleiten",
            description:
              "Alle Braze-Requests des initialisierten SDK werden an den konfigurierten Braze-Endpoint weitergeleitet. Antworten fließen unverändert zurück zum Browser.",
          },
          {
            title: "Adblocker-resistent",
            description:
              "Das Braze-Adblocker-Problem entfällt: SDK-Datei und Requests stammen beide von deiner eigenen Domain. Keine Braze-spezifischen URLs im Browser-Netzwerkverkehr — von First-Party-Requests nicht zu unterscheiden.",
          },
          {
            title: "Security Hardened",
            description:
              "Integriertes API-Key-Whitelisting und Origin-Restriktionen ermöglichen die genaue Kontrolle, welche Aufrufer der Proxy akzeptiert.",
          },
          {
            title: "Braze First-Party Endpoint",
            description:
              "Dein sGTM-Container wird zum dedizierten Braze First-Party Endpoint. Alle SDK-Requests und Antworten fließen über deine eigene Server-Infrastruktur — keine Braze-eigenen Domains in der Netzwerkkette.",
          },
          {
            title: "Einfache Integration",
            description:
              "Die baseUrl der SDK-Initialisierung auf deinen sGTM-Endpoint zeigen lassen. Keine Änderungen an der bestehenden Braze-Event-Tracking-Logik.",
          },
        ],
      },
      steps: {
        eyebrow: "Ablauf",
        title: "So funktioniert es",
        items: [
          {
            step: "1",
            title: "Browser fordert das SDK an",
            description:
              "Der Browser fordert das Braze Web SDK von deinem sGTM-Container-Endpoint (deiner eigenen Domain) an — nicht von Brazes CDN.",
          },
          {
            step: "2",
            title: "sGTM holt und liefert das SDK",
            description:
              "Das Client Template holt das Braze Web SDK server-seitig von Brazes CDN und gibt es an den Browser zurück.",
          },
          {
            step: "3",
            title: "SDK initialisiert und sendet Braze-Requests",
            description:
              "Das SDK läuft wie gewohnt. Seine Datenerfassungs-Requests treffen deinen sGTM-Endpoint statt Braze direkt.",
          },
          {
            step: "4",
            title: "Proxy leitet weiter und gibt die Antwort zurück",
            description:
              "Das Client Template empfängt jeden Braze-Request, leitet ihn an den konfigurierten Braze-Endpoint weiter und streamt die Antwort zurück an das SDK.",
          },
        ],
      },
      requirements: {
        eyebrow: "Setup",
        title: "Voraussetzungen",
        items: [
          "Server-Side Google Tag Manager (sGTM) Container",
          "Braze-Konto mit aktiviertem Web SDK",
          "Braze SDK Endpoint URL (z. B. https://sdk.fra-02.braze.eu)",
          "Optional: API-Key-Whitelist und Origin-Restriktionen für zusätzliche Sicherheit",
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "Häufige Fragen",
        items: [
          {
            q: "Was ist ein Reverse Proxy für das Braze Web SDK?",
            a: "Es ist ein sGTM Client Template, das zwischen Browser und Braze sitzt. Wenn der Browser das Braze Web SDK anfordert, holt das Template es und liefert es von der eigenen Domain aus. Wenn das SDK dann Braze-Requests sendet, empfängt das Template diese, leitet sie an den echten Braze-Endpoint weiter und gibt die Antworten zurück — vollständig transparent.",
          },
          {
            q: "Warum blockieren Adblocker Braze und wie löst das dieses Problem?",
            a: "Adblocker blockieren Braze gezielt, indem sie bekannte CDN-URLs wie js.appboycdn.com und SDK-Endpoints wie sdk.iad-01.braze.com sperren. Dieses Proxy-Template löst das Braze-Adblocker-Problem, indem sowohl die SDK-Datei als auch alle Requests über die eigene sGTM-Domain geleitet werden — diese Braze-URLs tauchen im Browser-Netzwerkverkehr gar nicht erst auf, die Requests sind von First-Party-Calls nicht zu unterscheiden.",
          },
          {
            q: "Muss die bestehende Braze-Integration verändert werden?",
            a: "Nur minimal. Die baseUrl der SDK-Initialisierung wird auf den sGTM-Container-Endpoint statt auf Brazes SDK-Endpoint gesetzt. Das SDK selbst, die Event-Tracking-Logik und alle anderen Konfigurationen bleiben unverändert.",
          },
          {
            q: "Ist das dasselbe wie server-seitiges Event-Tracking?",
            a: "Nein. Server-seitiges Event-Tracking ersetzt Browser-Events durch Server-zu-Server-Requests. Dieser Proxy lässt das Braze Web SDK unverändert im Browser laufen — er leitet lediglich den Netzwerkverkehr des SDK über den eigenen Server. Session-Management, In-App-Messaging und Event-Logik laufen weiterhin im Browser.",
          },
          {
            q: "Ist das Template DSGVO-konform?",
            a: "Das Template ist ein technisches Routing-Tool. Die DSGVO-Konformität hängt von der eigenen Consent-Implementierung und den Auftragsverarbeitungsverträgen (AVV) mit Braze ab. Der Proxy verändert oder speichert keine Daten — er leitet Requests und Responses transparent weiter.",
          },
          {
            q: "Was ist eine Braze Custom Domain?",
            a: "Eine Braze Custom Domain bedeutet, dass das Braze Web SDK und alle SDK-Requests über die eigene Domain laufen — statt über Brazes CDN oder Endpoint-URLs. Dieses Proxy-Template richtet diese Custom Domain auf dem sGTM-Container ein — ohne separaten Server oder DNS-Änderungen.",
          },
          {
            q: "Was ist ein Braze First-Party Endpoint?",
            a: "Ein Braze First-Party Endpoint ist eine URL auf der eigenen Domain, die Braze SDK-Requests empfängt und an Brazes Server weiterleitet. Dieses Template macht die sGTM-Container-URL zu diesem Endpoint — Browser behandeln den gesamten Braze-Traffic als First-Party und umgehen so Adblocker und Drittanbieter-Einschränkungen.",
          },
          {
            q: "Wo bekomme ich das Template?",
            a: "Das Template ist auf Gumroad erhältlich. Nach dem Kauf erhältst du die sGTM Client Template-Datei, die direkt in den sGTM-Container importiert wird.",
          },
        ],
      },
      ctaSection: {
        title: "Schluss mit Braze-Datenverlust durch Adblocker",
        description:
          "Das sGTM Proxy Client Template kaufen und in Minuten einrichten.",
        button: "Auf Gumroad holen",
      },
      schema: {
        name: "sGTM Proxy Client für Braze™",
        description:
          "Ein Google Tag Manager Server-Side Client Template (sGTM), das den sGTM-Container zum Braze First-Party Endpoint macht: liefert das Braze Web SDK von der eigenen Domain, leitet alle Requests an den Braze-Endpoint weiter und löst das Braze-Adblocker-Problem — Security Hardened, Drop-In-Integration.",
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "Tag Management",
        operatingSystem: "Google Tag Manager Server-Side (sGTM)",
        featureList: [
          "Braze Custom Domain für SDK-Auslieferung — SDK von der eigenen Domain, nicht Brazes CDN",
          "Braze First-Party Endpoint — alle SDK-Requests über die eigene sGTM-Domain",
          "Braze-Adblocker-Lösung — keine Braze-spezifischen URLs im Browser-Netzwerkverkehr",
          "Security Hardened mit API-Key-Whitelisting und Origin-Restriktionen",
          "Einfache Integration — nur baseUrl-Änderung in der bestehenden SDK-Initialisierung nötig",
        ],
        keywords:
          "Braze Custom Domain, Braze First-Party Endpoint, Braze Adblocker, sGTM, Braze, Reverse Proxy, Web SDK Proxy, Server-Side GTM, Client Template, First-Party Tracking",
        breadcrumbHome: "Start",
      },
    },
    shopifyGtm: {
      slug: "products/shopify-gtm-setup",
      gumroadUrl: SHOPIFY_GUMROAD,
      umamiName: "shopify-gtm-setup",
      meta: {
        title:
          "DSGVO-Ready Shopify GA4 & Google Ads Tracking Template | datapip.de",
        description:
          "Ein startklares Shopify-Tracking-Setup für GA4 und Google Ads. Sieh die komplette Customer Journey in deinen Analytics, während die Zustimmung deiner Besucher automatisch berücksichtigt wird — ohne Tracking-App-Abo.",
        keywords:
          "shopify ga4 tracking, shopify google ads tracking, shopify custom pixel, shopify gtm setup, shopify consent mode v2, shopify enhanced conversions, dsgvo shopify tracking, shopify server-side tracking, shopify google tag manager template, shopify ecommerce tracking template",
      },
      eyebrow: "Produkt",
      h1: "DSGVO-Ready Shopify GA4 & Google Ads Setup",
      tagline:
        "Ein sofort einsatzbereites Tracking-Setup für Shopify: Erfasse die gesamte Customer Journey – vom ersten Aufruf bis zum Checkout – in GA4 und Google Ads. Volle Datenkontrolle, keine App-Abhängigkeiten und kein Entwicklungsaufwand.",
      badges: [
        "Shopify Custom Pixel",
        "GTM Web Container",
        "GA4 & Google Ads",
        "DSGVO-Ready",
      ],
      cta: "Template auf Gumroad holen",
      imageAlt:
        "Shopify GA4 & Google Ads Tracking Setup — Konfiguration des GTM-Containers",
      whatIs: {
        eyebrow: "Überblick",
        title: "Was dieses Template macht",
        intro: "Es besteht aus zwei einfachen Teilen, die zusammenarbeiten:",
        points: [
          {
            title: "Shopify Custom Pixel",
            description:
              "Erfasst lückenlos alle Events in deinem Shop – von Produktaufrufen über Warenkorb-Aktionen bis hin zum Checkout – und bereitet die Daten sicher in einer isolierten Sandbox auf. Personenbezogene Daten (z. B. E-Mail-Adresse oder Telefonnummer) werden auf Wunsch direkt vor der Übertragung automatisch anonymisiert (SHA-256 Hashing).",
          },
          {
            title: "GTM-Container",
            description:
              "Empfängt die aufbereiteten Pixel-Daten und steuert die Weiterleitung an GA4 und Google Ads. Durch die strikte Verknüpfung mit Shopify's Privacy API werden Tags erst dann ausgeführt, wenn der Besucher die entsprechende Einwilligung erteilt hat.",
          },
        ],
        closing:
          "Du bekommst beide Teile fertig zur eigenen Einrichtung: die Pixel-Datei für Shopify und die Container-Datei für den Google Tag Manager.",
      },
      features: {
        eyebrow: "Vorteile",
        title: "Die wichtigsten Vorteile",
        items: [
          {
            title: "Erfasst deinen gesamten Shop",
            description:
              "Von Seitenaufrufen, über Produtkansichten bis zum abgeschlossenen Kauf – jeder wichtige Schritt wird automatisch erfasst.",
          },
          {
            title: "Berücksichtigt die Zustimmung deiner Besucher",
            description:
              "Es wird nichts getrackt, bevor ein Besucher zugestimmt hat. Sobald das passiert, wird das Tracking aktiviert und Daten gesammelt.",
          },
          {
            title: "Startklar für Google Ads",
            description:
              "Conversion-Tracking und Remarketing sind von Anfang an dabei, damit du deine Anzeigenleistung messen und frühere Besucher erneut ansprechen kannst.",
          },
          {
            title: "Schützt Kundendaten",
            description:
              "Personenbeziehbare Daten wie E-Mails oder Telefonnummern werden direkt auf dem Gerät des Kunden gehashed - wenn du es willst.",
          },
          {
            title: "Frei anpassbar",
            description:
              "Keine abgeschlossene App, keine versteckte Logik — jeder Teil des Codes ist leicht verständlich und lässt sich später anpassen, wenn dein Shop wächst.",
          },
        ],
      },
      steps: {
        eyebrow: "Ablauf",
        title: "So funktioniert es",
        items: [
          {
            step: "1",
            title: "Container importieren",
            description:
              "In Tag Manager die Container-Datei importieren, einen Workspace wählen und mergen oder überschreiben.",
          },
          {
            step: "2",
            title: "Eigene IDs eintragen",
            description:
              "GA4 Measurement ID, Google Ads Account ID und Conversion-Label eintragen.",
          },
          {
            step: "3",
            title: "Pixel zu Shopify hinzufügen",
            description:
              "Das Pixel in die Customer Events einfügen, eigene Angaben eintragen und aktivieren.",
          },
          {
            step: "4",
            title: "Consent prüfen",
            description:
              "Sicherstellen, dass Shopifys Datenschutz-Einstellungen (oder dein Consent-Tool) eingerichtet sind — das Pixel liest die Zustimmung direkt von dort.",
          },
          {
            step: "5",
            title: "Vor Veröffentlichung testen",
            description:
              "Mit einer Testbestellung prüfen, dass alles korrekt funktioniert, dann veröffentlichen.",
          },
        ],
      },
      requirements: {
        eyebrow: "Setup",
        title: "Das brauchst du",
        items: [
          "Einen Shopify-Store, in dem du Custom Pixels hinzufügen kannst",
          "Ein Google-Tag-Manager-Konto",
          "Eine GA4-Property",
          "Optional: Ein Google-Ads-Konto, falls du Conversion-Tracking möchtest",
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "Häufige Fragen",
        items: [
          {
            q: "Was genau bekomme ich beim Kauf dieses Templates?",
            a: "Du bekommst die Pixel-Datei zum Einfügen in Shopify, die GTM-Container-Datei zum Import sowie eine Schritt-für-Schritt-PDF-Anleitung.",
          },
          {
            q: "Muss ich zusätzlich eine Tracking-App installieren?",
            a: "Nein. Dieses Template stellt ein vollständiges Setup dar mit zwei Dateien, die du einmal einrichtest und danach besitzt — ohne laufende monatliche Kosten.",
          },
          {
            q: "Was genau wird getrackt?",
            a: "Alle wichtigen Shop-Ereignisse: Seitenaufrufe, Produktansichten, Warenkorb-Aktionen, jeder Checkout-Schritt, Käufe und die Suche.",
          },
          {
            q: "Wie funktioniert der Consent-Teil?",
            a: "Das Pixel prüft die Zustimmung deiner Besucher direkt in Shopify via Shopify Analytics API. Das Tracking startet erst, wenn ein Besucher tatsächlich zugestimmt hat — standardmäßig läuft vorher nichts.",
          },
          {
            q: "Funktioniert es mit Google Ads?",
            a: "Ja. Ein Conversion-Tag und ein Remarketing-Tag sind enthalten und einsatzbereit. Es gibt außerdem einen zusätzlichen Tag für besseres Anzeigen-Matching mit gehashten Kundendaten — der bleibt ausgeschaltet, bis du ihn aktivierst.",
          },
          {
            q: "Kann ich damit auch andere Tools statt GA4 und Google Ads nutzen?",
            a: "Ja. Pixel und GTM-Container folgen einem Standard-Setup, sodass du auf die gleiche Weise auch Tags für andere Plattformen ergänzen kannst — z. B. Meta, TikTok oder Pinterest. Das Template selbst liefert nur GA4 und Google Ads, die zugrunde liegenden Daten lassen sich aber überallhin weiterleiten.",
          },
          {
            q: "Ist das Template direkt zu 100 % DSGVO-Ready?",
            a: "Kein Template kann die rechtliche Compliance allein garantieren — das hängt immer von deiner Datenschutzerklärung, deinem Consent-Tool und deinem konkreten Business ab. Was dieses Template mitbringt: Tracking bleibt aus, bis ein Besucher zustimmt, und persönliche Daten werden anonymisiert, bevor sie irgendwohin gesendet werden. Prüfe die finale Einrichtung trotzdem mit deinem Datenschutzbeauftragten, bevor du live gehst.",
          },
          {
            q: "Muss ich programmieren können?",
            a: "Nein. Du fügst das Pixel in Shopify ein, importierst den Container in GTM und trägst laut Anleitung deine eigenen IDs ein. Falls du später etwas ändern willst, bleibt der Code einfach und verständlich.",
          },
          {
            q: "Wo bekomme ich das Template?",
            a: "Auf Gumroad. Nach dem Kauf bekommst du die Pixel-Datei, den GTM-Container und die PDF-Anleitung.",
          },
        ],
      },
      ctaSection: {
        title: "DSGVO-Ready Tracking-Setup für Shopify.",
        description:
          "Hol dir das DSGVO-ready Setup aus Custom Pixel und GTM-Container für GA4 & Google Ads.",
        button: "Auf Gumroad kaufen",
      },
      schema: {
        name: "DSGVO-Ready Shopify GA4 & Google Ads Tracking Template",
        description:
          "Ein Shopify Custom Pixel und Google Tag Manager Web Container für GA4- und Google-Ads-Tracking: erfasst die komplette Customer Journey, berücksichtigt die Zustimmung deiner Besucher automatisch, schützt Kundendaten und enthält Google-Ads-Conversion-/Remarketing-Tags — ohne Drittanbieter-Tracking-App.",
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "Tag Management",
        operatingSystem: "Shopify, Google Tag Manager",
        featureList: [
          "Erfasst die komplette Customer Journey — Produktansichten, Warenkorb-Aktionen, Checkout, Käufe — inklusive Preisen, Rabatten und Versandkosten",
          "Berücksichtigt die Zustimmung deiner Besucher automatisch — Tracking startet erst nach erteiltem Consent",
          "Startklar für Google Ads mit Conversion- und Remarketing-Tags",
          "Schützt Kundendaten — E-Mail, Telefonnummer und Adresse werden auf dem Gerät des Kunden gehasht",
          "Sicher zu testen — mit einem Klick zwischen Test- und Live-Umgebung wechseln",
        ],
        keywords:
          "shopify ga4 tracking, shopify google ads tracking, shopify custom pixel, shopify gtm setup, consent mode v2, enhanced conversions, dsgvo tracking template, google tag manager template",
        breadcrumbHome: "Start",
      },
    },
  },
  en: {
    brazeProxy: {
      slug: "products/braze-sgtm-proxy",
      gumroadUrl: BRAZE_GUMROAD,
      umamiName: "braze-sgtm-proxy",
      meta: {
        title: "Braze Custom Domain via sGTM | Bypass Ad Blockers | datapip.de",
        description:
          "Turn your sGTM container into a Braze custom domain. Serve the Braze Web SDK from your own domain, bypass Braze ad blockers, and keep your full SDK integration intact — set up in minutes.",
        keywords:
          "braze custom domain, braze first-party endpoint, braze ad blocker, sGTM Braze proxy, Braze Web SDK proxy, server-side GTM Braze, sGTM client template Braze, Braze reverse proxy, bypass ad blockers Braze, Google Tag Manager Braze integration, first-party Braze tracking",
      },
      eyebrow: "Product",
      h1: "sGTM Proxy Client for Braze™",
      tagline:
        "A Google Tag Manager Server-Side Client Template that turns your sGTM container into a Braze custom domain — routing all Braze requests past ad blockers in minutes. Easy to set up.",
      badges: [
        "sGTM Client Template",
        "Reverse Proxy",
        "First-Party",
        "GDPR-Friendly",
      ],
      cta: "Get the Template on Gumroad",
      imageAlt:
        "Braze sGTM Proxy Client — configuration interface in Google Tag Manager",
      whatIs: {
        eyebrow: "Overview",
        title: "What is the Braze sGTM Proxy Client?",
        body: "The Braze sGTM Proxy Client is a Google Tag Manager Server-Side Client Template that acts as a transparent reverse proxy for the Braze Web SDK. When a browser requests the Braze Web SDK, the template fetches and serves it from your sGTM container — under your own domain, never from Braze's CDN. When the initialized SDK makes Braze requests, those hit your sGTM endpoint, which forwards them to the configured Braze endpoint and streams the response back to the SDK. The result: your sGTM container becomes a Braze first-party endpoint — all Braze network traffic runs through your domain, invisible to ad blockers, while the Web SDK continues to work exactly as before.",
      },
      features: {
        eyebrow: "Features",
        title: "Key Features",
        items: [
          {
            title: "Serve the Web SDK",
            description:
              "The Braze Web SDK file is fetched and served from your sGTM endpoint. Browsers request it from your domain — never directly from Braze's CDN.",
          },
          {
            title: "Proxy Requests",
            description:
              "All Braze requests from the initialized SDK are forwarded to the configured Braze endpoint. Responses flow back to the browser intact.",
          },
          {
            title: "Ad-Blocker Resistant",
            description:
              "The Braze ad blocker problem vanishes: SDK file and all requests originate from your own domain. No Braze-specific URLs appear in browser network traffic — indistinguishable from first-party requests.",
          },
          {
            title: "Security Hardened",
            description:
              "Built-in API key allowlisting and origin restrictions let you control exactly which callers the proxy accepts.",
          },
          {
            title: "Braze First-Party Endpoint",
            description:
              "Your sGTM container becomes a dedicated Braze first-party endpoint. All SDK requests and responses flow through your own server infrastructure — no Braze-owned domains in the network chain.",
          },
          {
            title: "Drop-In Setup",
            description:
              "Point your SDK initialization's baseUrl to your sGTM endpoint. No changes to your existing Braze event tracking logic.",
          },
        ],
      },
      steps: {
        eyebrow: "How it works",
        title: "How It Works",
        items: [
          {
            step: "1",
            title: "Browser requests the SDK",
            description:
              "The browser requests the Braze Web SDK from your sGTM container endpoint (your own domain), not from Braze's CDN.",
          },
          {
            step: "2",
            title: "sGTM fetches and serves the SDK",
            description:
              "The Client Template fetches the Braze Web SDK from Braze's CDN server-side and returns it to the browser.",
          },
          {
            step: "3",
            title: "SDK initializes and sends Braze requests",
            description:
              "The SDK runs as normal. Its data collection requests target your sGTM endpoint instead of Braze directly.",
          },
          {
            step: "4",
            title: "Proxy forwards to Braze and returns the response",
            description:
              "The Client Template receives each Braze request, forwards it to the configured Braze endpoint, and streams the response back to the SDK.",
          },
        ],
      },
      requirements: {
        eyebrow: "Setup",
        title: "Requirements",
        items: [
          "Server-Side Google Tag Manager (sGTM) container",
          "Braze account with Web SDK enabled",
          "Braze SDK endpoint URL (e.g. https://sdk.fra-02.braze.eu)",
          "Optional: API key allowlist and origin restrictions for additional security",
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "Frequently Asked Questions",
        items: [
          {
            q: "What is a reverse proxy for the Braze Web SDK?",
            a: "It is an sGTM Client Template that sits between the browser and Braze. When the browser requests the Braze Web SDK, the template fetches and serves it from your own domain. When the SDK makes Braze requests, the template receives them, forwards them to the real Braze endpoint, and returns the responses — all transparently.",
          },
          {
            q: "Why does Braze get blocked by ad blockers, and how does this fix it?",
            a: "Ad blockers block Braze by targeting known CDN URLs like js.appboycdn.com and SDK endpoints like sdk.iad-01.braze.com. This proxy eliminates the Braze ad blocker problem by routing both the SDK file and all requests through your own sGTM domain — those Braze-specific URLs never appear in browser network traffic, making requests indistinguishable from first-party calls.",
          },
          {
            q: "Do I need to change my existing Braze integration?",
            a: "Only minimally. You point the SDK initialization's baseUrl to your sGTM container endpoint instead of Braze's SDK endpoint. The SDK itself, your event tracking logic, and all other configuration remain unchanged.",
          },
          {
            q: "Is this the same as server-side event tracking?",
            a: "No. Server-side event tracking replaces browser events with server-to-server requests. This proxy keeps the Braze Web SDK running in the browser as-is — it simply routes the SDK's own network traffic through your server. Session management, in-app messaging, and all event logic continue to run in the browser.",
          },
          {
            q: "Is this template GDPR compliant?",
            a: "The template is a technical routing tool. GDPR compliance depends on your consent implementation and your Data Processing Agreements with Braze. The proxy does not alter or persist any data — it transparently forwards requests and responses.",
          },
          {
            q: "What is a Braze custom domain?",
            a: "A Braze custom domain means the Braze Web SDK and all SDK requests are served from and sent to your own domain instead of Braze's CDN or endpoint URLs. This proxy template sets up that custom domain on your sGTM container — no separate server or DNS changes required.",
          },
          {
            q: "What is a Braze first-party endpoint?",
            a: "A Braze first-party endpoint is a URL on your own domain that receives Braze SDK requests and forwards them to Braze's servers. This template turns your sGTM container URL into that endpoint, so browsers treat all Braze traffic as first-party — bypassing ad blockers and third-party cookie restrictions.",
          },
          {
            q: "Where do I get the template?",
            a: "The template is available on Gumroad. After purchase you receive the sGTM Client Template file, which you import directly into your sGTM container.",
          },
        ],
      },
      ctaSection: {
        title: "Stop losing Braze data to ad blockers",
        description:
          "Get the sGTM Proxy Client Template and set it up in minutes.",
        button: "Get it on Gumroad",
      },
      schema: {
        name: "sGTM Proxy Client for Braze™",
        description:
          "A Google Tag Manager Server-Side Client Template (sGTM) that turns your sGTM container into a Braze first-party endpoint: serves the Braze Web SDK from your own domain, proxies all requests to the Braze endpoint, and eliminates the Braze ad blocker problem — security hardened, drop-in setup.",
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "Tag Management",
        operatingSystem: "Google Tag Manager Server-Side (sGTM)",
        featureList: [
          "Braze custom domain for SDK delivery — SDK served from your own domain, not Braze's CDN",
          "Braze first-party endpoint — all SDK requests routed through your sGTM domain",
          "Braze ad blocker bypass — no Braze-specific URLs appear in browser network traffic",
          "Security hardened with API key allowlisting and origin restrictions",
          "Drop-in setup — only baseUrl change required in existing Braze SDK initialization",
        ],
        keywords:
          "braze custom domain, braze first-party endpoint, braze ad blocker, sGTM, Braze, reverse proxy, Web SDK proxy, server-side GTM, Client Template, first-party tracking",
        breadcrumbHome: "Home",
      },
    },
    shopifyGtm: {
      slug: "products/shopify-gtm-setup",
      gumroadUrl: SHOPIFY_GUMROAD,
      umamiName: "shopify-gtm-setup",
      meta: {
        title:
          "GDPR-Ready Shopify GA4 & Google Ads Tracking Template | datapip.de",
        description:
          "A ready-to-use Shopify tracking setup for GA4 and Google Ads. See the full customer journey in your analytics while visitor consent is automatically respected — no tracking-app subscription needed.",
        keywords:
          "shopify ga4 tracking, shopify google ads tracking, shopify custom pixel, shopify gtm setup, shopify consent mode v2, shopify enhanced conversions, gdpr shopify tracking, shopify server-side tracking, shopify google tag manager template, shopify ecommerce tracking template",
      },
      eyebrow: "Product",
      h1: "GDPR-Ready Shopify GA4 & Google Ads Setup",
      tagline:
        "A ready-to-use tracking setup for Shopify: capture the entire customer journey — from the first visit to checkout — in GA4 and Google Ads. Full control over your data, no app dependencies, and no development effort.",
      badges: [
        "Shopify Custom Pixel",
        "GTM Web Container",
        "GA4 & Google Ads",
        "GDPR-Friendly",
      ],
      cta: "Get the Template on Gumroad",
      imageAlt:
        "Shopify GA4 & Google Ads tracking setup — GTM container configuration",
      whatIs: {
        eyebrow: "Overview",
        title: "What This Template Does",
        intro: "It's made up of two simple parts that work together:",
        points: [
          {
            title: "Shopify Custom Pixel",
            description:
              "Captures every event in your shop without gaps — from product views to cart actions to checkout — and prepares the data safely inside an isolated sandbox. Personal data such as email address or phone number can optionally be anonymized automatically before it's transmitted (SHA-256 hashing).",
          },
          {
            title: "GTM Container",
            description:
              "Receives the prepared pixel data and controls the handoff to GA4 and Google Ads. Through its strict link to Shopify's Privacy API, tags only fire once the visitor has actually given the relevant consent.",
          },
        ],
        closing:
          "You get both parts ready to set up yourself: the pixel file for Shopify and the container file for Google Tag Manager.",
      },
      features: {
        eyebrow: "Benefits",
        title: "Key Benefits",
        items: [
          {
            title: "Tracks Your Whole Shop",
            description:
              "From page views, to product views, to a completed purchase — every important step is captured automatically.",
          },
          {
            title: "Respects Visitor Consent",
            description:
              "Nothing is tracked until a visitor agrees. As soon as they do, tracking is activated and data collection begins.",
          },
          {
            title: "Ready for Google Ads",
            description:
              "Conversion tracking and remarketing are included from day one, so you can measure ad performance and reach past visitors again.",
          },
          {
            title: "Keeps Customer Data Private",
            description:
              "Personal data like emails or phone numbers can be hashed right on the customer's device — if you want it to be.",
          },
          {
            title: "Yours to Adjust",
            description:
              "No locked-down app and no hidden logic — every part of the code is easy to read and can be changed later if your shop's needs grow.",
          },
        ],
      },
      steps: {
        eyebrow: "How it works",
        title: "How It Works",
        items: [
          {
            step: "1",
            title: "Import the GTM Container",
            description:
              "In Tag Manager, import the container file, choose a workspace, and merge or overwrite.",
          },
          {
            step: "2",
            title: "Add Your Own IDs",
            description:
              "Enter your GA4 Measurement ID, Google Ads Account ID, and Conversion Label.",
          },
          {
            step: "3",
            title: "Add the Pixel to Shopify",
            description:
              "Paste the pixel into Customer Events, fill in your own details, and switch it on.",
          },
          {
            step: "4",
            title: "Check Consent Is Set Up",
            description:
              "Make sure Shopify's privacy settings (or your consent tool) are switched on — the pixel reads consent directly from there.",
          },
          {
            step: "5",
            title: "Test Before You Publish",
            description:
              "Use a test order to confirm everything works correctly, then publish.",
          },
        ],
      },
      requirements: {
        eyebrow: "Setup",
        title: "What You Need",
        items: [
          "A Shopify store where you can add Custom Pixels",
          "A Google Tag Manager account",
          "A GA4 property",
          "Optional: A Google Ads account, if you want conversion tracking",
        ],
      },
      faq: {
        eyebrow: "FAQ",
        title: "Frequently Asked Questions",
        items: [
          {
            q: "What exactly do I get when I buy this template?",
            a: "You get the pixel file to paste into Shopify, the GTM container file to import, and a step-by-step PDF guide.",
          },
          {
            q: "Do I need to install a separate tracking app?",
            a: "No. This template is a complete setup made up of two files you set up once and then own — no ongoing monthly fee.",
          },
          {
            q: "What does it track?",
            a: "Every important shop event: page views, product views, cart actions, every checkout step, purchases, and on-site search.",
          },
          {
            q: "How does the consent part work?",
            a: "The pixel checks your visitor's consent choice directly in Shopify via the Shopify Analytics API. Tracking only turns on once a visitor has actually agreed — by default, nothing runs before that.",
          },
          {
            q: "Does it work with Google Ads?",
            a: "Yes. A conversion tag and a remarketing tag are included and ready to use. There's also an extra tag for improved ad matching using hashed customer data — it stays switched off until you decide to turn it on.",
          },
          {
            q: "Can I use this for other tools besides GA4 and Google Ads?",
            a: "Yes. The pixel and GTM container follow a standard setup, so you can add tags for other platforms — like Meta, TikTok, or Pinterest — the same way. This template ships with GA4 and Google Ads only, but the underlying data is available to route anywhere you need.",
          },
          {
            q: "Is this template completely GDPR-compliant out of the box?",
            a: "No template can guarantee full legal compliance on its own — that always depends on your privacy policy, your consent tool, and your specific business. What this template does provide: tracking stays off until a visitor consents, and personal data is anonymized before it's sent anywhere. Still, check your final setup with your data protection officer before going live.",
          },
          {
            q: "Do I need to know how to code?",
            a: "No. You paste the pixel into Shopify, import the container into GTM, and fill in your own IDs using the setup guide. If you ever want to change something later, the code stays simple and readable.",
          },
          {
            q: "Where do I get the template?",
            a: "On Gumroad. After buying, you'll receive the pixel file, the GTM container, and the PDF setup guide.",
          },
        ],
      },
      ctaSection: {
        title: "GDPR-Ready Tracking Setup for Shopify.",
        description:
          "Get the GDPR-ready setup made of Custom Pixel and GTM Container for GA4 & Google Ads.",
        button: "Buy it on Gumroad",
      },
      schema: {
        name: "GDPR-Ready Shopify GA4 & Google Ads Tracking Template",
        description:
          "A Shopify Custom Pixel and Google Tag Manager Web Container for GA4 and Google Ads tracking: tracks the full shop journey, respects visitor consent automatically, keeps customer data private, and includes Google Ads conversion/remarketing tags — without a third-party tracking app.",
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "Tag Management",
        operatingSystem: "Shopify, Google Tag Manager",
        featureList: [
          "Tracks the whole shop journey — product views, cart actions, checkout, purchases — including prices, discounts, and shipping",
          "Respects visitor consent automatically — tracking only switches on once a visitor agrees",
          "Ready for Google Ads with conversion and remarketing tags included",
          "Keeps customer data private — emails, phone numbers, and addresses are hashed on the customer's device",
          "Safe to test — switch between a test and a live setup with one click",
        ],
        keywords:
          "shopify ga4 tracking, shopify google ads tracking, shopify custom pixel, shopify gtm setup, consent mode v2, enhanced conversions, gdpr tracking template, google tag manager template",
        breadcrumbHome: "Home",
      },
    },
  },
} as const satisfies Record<Locale, Record<string, Product>>;
