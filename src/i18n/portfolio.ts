import type { ImageMetadata } from "astro";
import type { Locale } from "./ui";

import brazeProxy from "../assets/projects/braze-reverse-proxy.webp";
import shopifyGtm from "../assets/projects/shopify-gtm-tracking-setup.webp";
import dataLayerViewer from "../assets/projects/simple-data-layer-viewer.webp";
import analyticsViewer from "../assets/projects/simple-page-analytics-viewer.webp";
import sardinienhunde from "../assets/projects/sardinienhunde.org.webp";
import brotrechner from "../assets/projects/brotrechner.de.webp";

export interface Project {
  title: string;
  description: string;
  image: ImageMetadata;
  technologies: string[];
  primaryText: string;
  primaryLink: string;
  secondaryText?: string;
  secondaryLink?: string;
}

export interface Testimonial {
  name: string;
  designation: string;
  company: string;
  link: string;
  quote: string;
}

export interface Role {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

interface PortfolioContent {
  projects: { eyebrow: string; heading: string; lede: string; items: Project[] };
  testimonials: { eyebrow: string; heading: string; items: Testimonial[] };
  about: {
    eyebrow: string;
    heading: string;
    body: string[];
    tableLabel: string;
    columns: { role: string; company: string; period: string };
    roles: Role[];
  };
  contact: { eyebrow: string; heading: string; lede: string; cta: string; email: string };
}

export const portfolio: Record<Locale, PortfolioContent> = {
  de: {
    projects: {
      eyebrow: "Projekte",
      heading: "Gebaut, betrieben, dokumentiert",
      lede: "Diese Webseite, der Brotrechner und weitere Services werden auf einem Server in Deutschland betrieben.",
      items: [
        {
          title: "sGTM Proxy Client für Braze™",
          description:
            "Ein sGTM Client Template, das das Braze Web SDK über die eigene Domain ausliefert und alle Braze-Requests weiterleitet – adblocker-resistent, first-party und DSGVO-konform.",
          image: brazeProxy,
          technologies: ["Google Tag Manager", "GTM API", "Braze™", "Reverse Proxy"],
          primaryText: "Zur Produktseite",
          primaryLink: "/de/products/braze-sgtm-proxy/",
        },
        {
          title: "Shopify GA4 & Google Ads Setup",
          description:
            "Ein Shopify Custom Pixel + GTM Web Container für DSGVO-Ready GA4- und Google-Ads-Tracking – volle Ecommerce-Abdeckung, Consent Mode v2 und gehashte Nutzerdaten, ohne Tracking-App-Abo.",
          image: shopifyGtm,
          technologies: ["Shopify Custom Pixel", "Google Tag Manager", "GA4", "Google Ads"],
          primaryText: "Zur Produktseite",
          primaryLink: "/de/products/shopify-gtm-setup/",
        },
        {
          title: "Simple Data Layer Viewer",
          description:
            "Die Erweiterung zeigt mit nur einem Klick den Data Layer der aktuellen Webseite an. Sie unterstützt Live-Updates, das Injizieren von Code und das Umleiten von Requests.",
          image: dataLayerViewer,
          technologies: ["WXT", "WebExtensions API", "React", "TypeScript"],
          primaryText: "Für Chrome",
          primaryLink:
            "https://chromewebstore.google.com/detail/simple-data-layer-viewer/mkdjegdakgimmckobdnfiimhgmabbido",
          secondaryText: "Für Firefox",
          secondaryLink:
            "https://addons.mozilla.org/en-GB/firefox/addon/simple-data-layer-viewer/",
        },
        {
          title: "Simple In-Page Analytics Viewer",
          description:
            "Die Erweiterung zeigt mit nur einem Klick die wichtigsten Adobe-Analytics-Daten der aktuellen Seite an – für heute, gestern oder die letzten 7 Tage.",
          image: analyticsViewer,
          technologies: ["WXT", "WebExtensions API", "React", "Adobe APIs"],
          primaryText: "Für Chrome",
          primaryLink:
            "https://chromewebstore.google.com/detail/simple-page-analytics-vie/caiplbcpfpcafighmdbijbdfafjffipn",
        },
        {
          title: "SardinienHunde.org",
          description:
            "Die Webseite für den Tierschutzverein ist komplett selbst entwickelt – inklusive Cookie-Banner und Google-Analytics-Tracking. Herzstück ist die Filterfunktion für zu vermittelnde Hunde.",
          image: sardinienhunde,
          technologies: ["Next.js", "Contentful", "AWS", "Google Tag Manager"],
          primaryText: "Zur Webseite",
          primaryLink: "https://www.sardinienhunde.org/",
        },
        {
          title: "Brotrechner.de",
          description:
            "Der Rechner ist eigenständig entwickelt und soll das Brotbacken so einfach wie möglich machen. Im Hintergrund läuft ein selbstgehostetes Server-Side-Tracking.",
          image: brotrechner,
          technologies: ["Next.js", "TypeScript", "Server", "Linux", "Docker"],
          primaryText: "Zur Webseite",
          primaryLink: "https://www.brotrechner.de",
        },
      ],
    },
    testimonials: {
      eyebrow: "Referenzen",
      heading: "Was Kunden sagen",
      items: [
        {
          name: "Manfred Carsten",
          designation: "CEO",
          company: "Musterklick Marketing GmbH",
          link: "https://www.northdata.de/Musterklick+Marketing+GmbH%2C+L%C3%B6rrach",
          quote:
            "Herr Jäckle sorgte dafür, dass unsere Conversion-Messung stimmt – ein echter Erfolgsfaktor für unsere Kampagnen.",
        },
        {
          name: "Prof. Dr. Tobias Werner",
          designation: "Vorstand",
          company: "SardinienHunde e.V.",
          link: "https://www.sardinienhunde.org",
          quote:
            "Dank Herrn Jäckle haben wir nun eine moderne Webseite mit praktischer Filterfunktion; er kümmert sich zuverlässig um alles – von Hosting bis Tracking.",
        },
        {
          name: "Adrien Günther",
          designation: "CEO",
          company: "Digital Synergies GmbH",
          link: "https://digital-synergies.de",
          quote:
            "Dank der Beratung von Herrn Jäckle läuft unser Server-Setup reibungslos – und unsere digitalen Prozesse sind heute spürbar effizienter.",
        },
      ],
    },
    about: {
      eyebrow: "Über mich",
      heading: "Technik verstehen, Qualität sichern, Daten nutzen",
      body: [
        "Ich arbeite seit über zehn Jahren im Bereich Digital Analytics – mit Fokus auf Tracking, Consent und Datenqualität. Mein Ziel ist es, saubere und datenschutzkonforme Setups zu schaffen, die zuverlässig funktionieren und echten Mehrwert liefern.",
        "Erfahrung aus Agentur-, Technologie- und Konzernumfeld hilft mir, Unternehmen technisch fundiert und praxisnah zu unterstützen – von der Analyse bis zur Implementierung.",
      ],
      tableLabel: "Stationen",
      columns: { role: "Rolle", company: "Unternehmen", period: "Zeitraum" },
      roles: [
        {
          title: "Web Analytics Specialist",
          company: "Versicherungskammer Bayern",
          period: "2025 – heute",
          description:
            "Weiterentwicklung des markenübergreifenden Digital-Analytics-Setups mit Fokus auf Qualitätssicherung und kontinuierliche datenbasierte Optimierung.",
          technologies: ["Adobe Analytics", "Adobe Target", "Adobe Tags"],
        },
        {
          title: "Projektleiter Digital Analytics",
          company: "AUDI AG",
          period: "2023 – 2025",
          description:
            "Verantwortung für das internationale Digital-Analytics-Setup und Sicherstellung der Rechtskonformität.",
          technologies: ["Adobe Analytics", "Adobe Target", "CHEQ"],
        },
        {
          title: "Technical Digital Analyst",
          company: "Audi Business Innovation GmbH",
          period: "2019 – 2023",
          description:
            "Umsetzung und Weiterentwicklung des internationalen Digital-Analytics- und Consent-Management-Setups.",
          technologies: ["Adobe Analytics", "Adobe Target", "CHEQ", "AWS"],
        },
        {
          title: "Digital Analytics Consultant",
          company: "Piano (vormals AT Internet)",
          period: "2015 – 2019",
          description:
            "Durchführung von Digital-Analytics-Projekten für diverse Kunden sowie KPI-Workshops und Pre-Sales-Beratung.",
          technologies: ["Piano Analytics", "Google Tag Manager", "Tealium", "CommandersAct"],
        },
        {
          title: "Account Manager Performance Marketing",
          company: "plan.net (Serviceplan Group)",
          period: "2014 – 2015",
          description:
            "Planung, Umsetzung und Optimierung von Performance-Kampagnen sowie Automatisierung mit Google Ads Scripts.",
          technologies: ["Google Ads", "Google Tag Manager", "Google Analytics"],
        },
      ],
    },
    contact: {
      eyebrow: "Kontakt",
      heading:
        "Tracking fehlerhaft oder Datenschutz nicht gewährleistet? Consent-Setup unvollständig? Data Layer defekt?",
      lede: "Melden Sie sich für eine kostenlose Ersteinschätzung – gemeinsam analysieren wir das Problem und beheben es präzise, DSGVO-konform und nachhaltig.",
      cta: "Jetzt kostenlos anfragen",
      email: "info@datapip.de",
    },
  },

  en: {
    projects: {
      eyebrow: "Projects",
      heading: "Built, hosted, documented",
      lede: "This website, the Bread Calculator, and other services are hosted on a server in Germany.",
      items: [
        {
          title: "sGTM Proxy Client for Braze™",
          description:
            "An sGTM Client Template that serves the Braze Web SDK from your own domain and proxies all Braze requests — ad-blocker resistant, first-party, and GDPR-friendly.",
          image: brazeProxy,
          technologies: ["Google Tag Manager", "GTM API", "Braze™", "Reverse Proxy"],
          primaryText: "View product",
          primaryLink: "/en/products/braze-sgtm-proxy/",
        },
        {
          title: "Shopify GA4 & Google Ads Setup",
          description:
            "A Shopify Custom Pixel + GTM Web Container for GDPR-ready GA4 and Google Ads tracking — full ecommerce event coverage, Consent Mode v2, and hashed user data, with no tracking-app subscription.",
          image: shopifyGtm,
          technologies: ["Shopify Custom Pixel", "Google Tag Manager", "GA4", "Google Ads"],
          primaryText: "View product",
          primaryLink: "/en/products/shopify-gtm-setup/",
        },
        {
          title: "Simple Data Layer Viewer",
          description:
            "The extension displays the data layer of the current website with just one click. It supports live updates, code injection, and request redirection.",
          image: dataLayerViewer,
          technologies: ["WXT", "WebExtensions API", "React", "TypeScript"],
          primaryText: "For Chrome",
          primaryLink:
            "https://chromewebstore.google.com/detail/simple-data-layer-viewer/mkdjegdakgimmckobdnfiimhgmabbido",
          secondaryText: "For Firefox",
          secondaryLink:
            "https://addons.mozilla.org/en-GB/firefox/addon/simple-data-layer-viewer/",
        },
        {
          title: "Simple In-Page Analytics Viewer",
          description:
            "The extension displays the most important Adobe Analytics data for the current page with a single click – for today, yesterday, or the last 7 days.",
          image: analyticsViewer,
          technologies: ["WXT", "WebExtensions API", "React", "Adobe APIs"],
          primaryText: "For Chrome",
          primaryLink:
            "https://chromewebstore.google.com/detail/simple-page-analytics-vie/caiplbcpfpcafighmdbijbdfafjffipn",
        },
        {
          title: "SardinienHunde.org",
          description:
            "The website for the animal welfare association was built entirely by myself – including the cookie banner and Google Analytics tracking. Its core feature is the filter for adoptable dogs.",
          image: sardinienhunde,
          technologies: ["Next.js", "Contentful", "AWS", "Google Tag Manager"],
          primaryText: "Visit website",
          primaryLink: "https://www.sardinienhunde.org/",
        },
        {
          title: "Brotrechner.de",
          description:
            "The calculator was built entirely by myself and is designed to make bread baking as easy as possible. In the background, a self-hosted server-side tracking system is running.",
          image: brotrechner,
          technologies: ["Next.js", "TypeScript", "Server", "Linux", "Docker"],
          primaryText: "Visit website",
          primaryLink: "https://www.brotrechner.de",
        },
      ],
    },
    testimonials: {
      eyebrow: "Testimonials",
      heading: "What clients say",
      items: [
        {
          name: "Manfred Carsten",
          designation: "CEO",
          company: "Musterklick Marketing GmbH",
          link: "https://www.northdata.de/Musterklick+Marketing+GmbH%2C+L%C3%B6rrach",
          quote:
            "Mr. Jaeckle made sure our conversion tracking is accurate – a true success factor for our campaigns.",
        },
        {
          name: "Dr. Tobias Werner",
          designation: "MOB",
          company: "SardinienHunde e.V.",
          link: "https://www.sardinienhunde.org",
          quote:
            "Thanks to Mr. Jaeckle, we now have a modern website with a convenient filter feature; he reliably takes care of everything – from hosting to tracking.",
        },
        {
          name: "Adrien Guenther",
          designation: "CEO",
          company: "Digital Synergies GmbH",
          link: "https://digital-synergies.de",
          quote:
            "Thanks to Mr. Jaeckle's advice, our server setup runs smoothly – and our digital processes are noticeably more efficient today.",
        },
      ],
    },
    about: {
      eyebrow: "About me",
      heading: "Understanding technology, ensuring quality, using data",
      body: [
        "I have been working in Digital Analytics for over ten years – with a focus on tracking, consent, and data quality. My goal is to create clean and privacy-compliant setups that work reliably and deliver real value.",
        "Experience in agency, technology, and corporate environments enables me to support companies with technically sound and practical solutions – from analysis to implementation.",
      ],
      tableLabel: "Career",
      columns: { role: "Role", company: "Company", period: "Period" },
      roles: [
        {
          title: "Web Analytics Specialist",
          company: "Versicherungskammer Bayern",
          period: "2025 – today",
          description:
            "Advancing the cross-brand digital analytics setup with a focus on quality assurance and continuous data-driven optimisation.",
          technologies: ["Adobe Analytics", "Adobe Target", "Adobe Tags"],
        },
        {
          title: "Project Lead Digital Analytics",
          company: "AUDI AG",
          period: "2023 – 2025",
          description:
            "Responsible for the international digital analytics setup and for ensuring legal compliance.",
          technologies: ["Adobe Analytics", "Adobe Target", "CHEQ"],
        },
        {
          title: "Technical Digital Analyst",
          company: "Audi Business Innovation GmbH",
          period: "2019 – 2023",
          description:
            "Implementation and development of the international digital analytics and consent management setup.",
          technologies: ["Adobe Analytics", "Adobe Target", "CHEQ", "AWS"],
        },
        {
          title: "Digital Analytics Consultant",
          company: "Piano (formerly AT Internet)",
          period: "2015 – 2019",
          description:
            "Delivered digital analytics projects for a range of clients, plus KPI workshops and pre-sales consulting.",
          technologies: ["Piano Analytics", "Google Tag Manager", "Tealium", "CommandersAct"],
        },
        {
          title: "Account Manager Performance Marketing",
          company: "plan.net (Serviceplan Group)",
          period: "2014 – 2015",
          description:
            "Planning, execution and optimisation of performance campaigns, plus automation with Google Ads Scripts.",
          technologies: ["Google Ads", "Google Tag Manager", "Google Analytics"],
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      heading:
        "Tracking broken or privacy not ensured? Consent setup incomplete? Data layer faulty?",
      lede: "Get in touch for a free initial assessment — together we will identify the root cause and fix it accurately, in full compliance with GDPR and TDDDG.",
      cta: "Get a free diagnosis",
      email: "info@datapip.de",
    },
  },
};
