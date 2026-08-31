# datapip.de

Bilingual (DE/EN) portfolio site for Philipp Jäckle — freelance digital analyst, privacy-focused tracking and data layer implementation.

Rebuild of the previous Next.js 15 site on **Astro 7**. Both homepages are statically prerendered and ship no JavaScript apart from a ~3 KB module for the hero cookie scanner.

## Stack

| | |
|---|---|
| Framework | Astro 7 — `output: 'static'` + `@astrojs/node` (standalone) for on-demand routes |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite`; design tokens in `@theme` (no `tailwind.config`) |
| Fonts | Astro `fonts` pipeline, Fontsource provider — self-hosted, no third-party requests |
| Images | `astro:assets` — AVIF with responsive `srcset` |
| Mail | Nodemailer (contact form) |
| Automation | Playwright / Chromium (hero cookie scanner) |

## Getting started

```sh
npm install
npx playwright install --with-deps chromium   # required by the cookie scanner
cp .env.example .env                          # optional: SMTP for the contact form
npm run dev
```

| Script | |
|---|---|
| `npm run dev` | dev server on :4321 (`npx astro dev --background` also works) |
| `npm run build` | production build into `dist/` |
| `npm run preview` | serve the built output |
| `npm run check` | `astro check` — must report 0 errors |

## Deployment

`npm run build` emits a standalone Node server:

```sh
HOST=0.0.0.0 PORT=4321 node dist/server/entry.mjs
```

The host needs Chromium (`npx playwright install --with-deps chromium`) and the SMTP variables from `.env.example`. Without SMTP the site still builds and runs; the contact form reports a configuration error instead of sending.

Most routes are prerendered. On-demand: `/` (Accept-Language redirect), `/404`, the contact pages, and `/api/scan`.

## Routes

| | |
|---|---|
| `/` | 302 to `/de/` or `/en/` based on `Accept-Language` |
| `/de/`, `/en/` | homepage |
| `/de/kontakt/`, `/en/contact/` | contact form (handles its own POST) |
| `/api/scan` | cookie scanner endpoint |

## Notes for contributors

`CLAUDE.md` holds the working notes: design tokens and the contrast constraint, the Astro 7 gotchas that will bite you, how the scanner is guarded, and what has not yet been ported from v1. Read it before changing anything visual or touching `/api/scan`.

## Licence

All rights reserved. The source is published for reference; the content, imagery, client testimonials and visual design are not licensed for reuse.
