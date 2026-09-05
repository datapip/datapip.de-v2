// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://datapip.de';

// https://astro.build/config
export default defineConfig({
  site: SITE,

  // Both locales stay prefixed so the v1 URLs (/de, /en) keep working.
  // `/` is handled by src/pages/index.astro, which sniffs Accept-Language
  // the way the v1 middleware did.
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  // Astro's built-in font pipeline: self-hosted, subset to the scripts this
  // site actually uses, and emitted with <link rel="preload"> by <Font />.
  // No third-party request is made at any point.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-ibm-plex-sans',
      weights: ['400 600'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
  ],

  // SMTP for the contact form. All optional so the site builds and runs
  // without them; the form reports a configuration error rather than
  // failing silently.
  env: {
    schema: {
      SMTP_HOST: envField.string({ context: 'server', access: 'secret', optional: true }),
      SMTP_PORT: envField.number({ context: 'server', access: 'secret', optional: true }),
      SMTP_USER: envField.string({ context: 'server', access: 'secret', optional: true }),
      SMTP_PASS: envField.string({ context: 'server', access: 'secret', optional: true }),
      FROM_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),

      // PocketBase, for the browser extensions' feedback endpoint. Optional
      // like the SMTP vars: without them the mail still goes out and only the
      // database write is skipped.
      PB_ENDPOINT: envField.string({ context: 'server', access: 'secret', optional: true }),
      PB_USER: envField.string({ context: 'server', access: 'secret', optional: true }),
      PB_PASSWORD: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  // The data layer checker was never rebuilt (see CLAUDE.md — it was barely
  // used in v1), but its two URLs are indexed, so they must not 404. The
  // cookie scanner is the closest surviving tool and the same audience.
  // These four entries are the ONLY record of those slugs now; they were
  // removed from `routes` because nothing renders at them any more.
  redirects: {
    '/de/data-layer-checker': { status: 301, destination: '/de/cookie-scanner/' },
    '/de/data-layer-checker/': { status: 301, destination: '/de/cookie-scanner/' },
    '/en/data-layer-crawler': { status: 301, destination: '/en/cookie-crawler/' },
    '/en/data-layer-crawler/': { status: 301, destination: '/en/cookie-crawler/' },
  },

  // Default `output: 'static'`. The adapter exists so the language redirect,
  // the contact form and the 404 can opt out with `prerender = false`.
  adapter: node({ mode: 'standalone' }),

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'de',
        locales: { de: 'de-DE', en: 'en-US' },
      },
      // `/` is a 302 to a locale, not a page. Listing it would also emit a
      // second de-DE alternate, so two URLs would claim the same language.
      filter: (page) => page !== `${SITE}/`,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
