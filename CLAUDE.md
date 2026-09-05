# Project Intelligence: datapip.de v2

> **Context:** Rebuild of the bilingual (German/English) portfolio site for Philipp Jäckle, a freelance digital analyst specialising in privacy-focused tracking and data layer implementation. v1 lives at `../datapip.de` (Next.js 15) and is the reference for content and behaviour. v2 is Astro, and follows the **"Instrument"** visual direction: the site looks like a diagnostic tool, because the work being sold is diagnosis.

## Tech Stack

- **Framework:** Astro 7 (`output: 'static'` with `@astrojs/node` in `standalone` mode, so individual routes opt out via `export const prerender = false`)
- **Language:** TypeScript (strict, via `astro/tsconfigs/strict`)
- **Styling:** Tailwind CSS 4 through `@tailwindcss/vite` — there is no `tailwind.config`; tokens live in `@theme` inside `src/styles/global.css`
- **Fonts:** Astro's built-in `fonts` pipeline with the **fontsource** provider (IBM Plex Sans + JetBrains Mono), subset to `latin` + `latin-ext`. `<Font />` in `Base.astro` emits the `@font-face` CSS and the `rel="preload"` links. **Never** switch to a font CDN — a privacy-positioned site must make no third-party request.
- **Images:** `astro:assets`. Source files live in `src/assets/`, **not** `public/`, so they get AVIF + responsive `srcset`.
- **Mail:** Nodemailer, imported lazily inside `src/lib/contact.ts`
- **Browser automation:** Playwright (Chromium) for the hero cookie scanner
- **Analytics:** self-hosted Umami, **client-side only** — cookieless, no consent gate, no middleware, no per-route allowlist (see Analytics)
- **Sitemap:** `@astrojs/sitemap`, locale-aware

The homepage ships a single inlined ~3KB module for the scanner and nothing else; every page also loads the Umami script from the site's own subdomain. Every other page is otherwise zero-JS. Keep it that way: reach for a framework island only if a feature genuinely cannot be done in that budget.

## Commands

- **Install:** `npm install` — then `npx playwright install --with-deps chromium`
- **Dev:** `npm run dev` — or `npx astro dev --background`, then `astro dev stop` / `status` / `logs`
- **Build:** `npm run build`
- **Typecheck:** `npm run check` (`astro check`)
- **Preview built output:** `npm run preview`

## Deployment

`npm run build` produces `dist/client/` (static assets) and a standalone server:

```sh
HOST=0.0.0.0 PORT=4321 node dist/server/entry.mjs
```

Prerendered: both homepages, all four legal pages and all four product pages. On demand: `/` (Accept-Language redirect), `/404`, both contact pages, and `/api/scan`. The host needs Chromium and, for the contact form, the SMTP variables — both are optional to *build*, but the scanner 502s and the form reports a config error without them.

## Documentation files

`CLAUDE.md` is the single source of truth. `AGENTS.md` is a short pointer to it, deliberately not a copy — the two were byte-identical duplicates at one point and would have drifted. `README.md` is the outward-facing description for the GitHub repo. Update this file for anything about *how the project works*; update the README only for setup and stack facts.

## Astro 7 gotchas

- The Rust compiler is mandatory and strict — **unclosed tags fail the build** rather than being silently corrected.
- `compressHTML` defaults to `'jsx'`, so whitespace between inline elements is stripped; use an explicit `{" "}` where a space matters.
- **Use `{/* … */}` for template comments, never `<!-- … -->`.** HTML comments are shipped to the browser; JSX-style ones are compiled away.
- Markdown is processed by Sätteri, not remark/rehype. `src/fetch.ts` is a reserved filename.
- **CSRF protection is on by default.** A cross-origin `POST` (or one with no `Origin` header, e.g. plain `curl`) gets a **403**. When testing the contact form from the shell, pass `-H "Origin: http://localhost:4321"`. A 403 there is the guard working, not a bug.

## Project Structure

```
src/
  i18n/
    ui.ts          Locales, localised route slugs, section anchors, chrome copy,
                   contact-form and 404 copy, switchLocalePath()
    portfolio.ts   Projects (with typed image imports), testimonials, CV, contact
    legal.ts       Operator data (verbatim from v1) + imprint and privacy copy
    products.ts    Both product pages: copy, metadata and JSON-LD source
  lib/
    contact.ts       Validation, honeypot and SMTP send for the contact form
    is-public-url.ts SSRF guard — every crawl target must pass through it
    guards.ts        TTL cache, Playwright concurrency slots, per-IP rate limit
  layouts/
    Base.astro     <html>, head (canonical, hreflang, OG, <Font preload />),
                   nav, footer, skip link. Takes an optional `noindex` prop.
  components/
    Section.astro     Shared section shell: top rule, mono eyebrow, h2, lede
    ContactForm.astro Progressively-enhanced form (works with JS disabled)
    layout/           Nav.astro, Footer.astro
    legal/            LegalPage, LegalSection, LegalContactCard, LegalResponsible
    product/          ProductPage.astro — the whole product page, both products
    home/             Hero, ScanPanel, Services, Testimonials, Projects,
                      About, Contact
  pages/
    index.astro      prerender=false; Accept-Language negotiation, 302 to a locale
    404.astro        prerender=false; picks its locale from the requested path
    api/scan.ts      prerender=false; the hero cookie scanner endpoint
    de/index.astro   de/kontakt.astro   (kontakt is prerender=false, handles POST)
    de/impressum.astro   de/datenschutz.astro
    en/index.astro   en/contact.astro
    en/imprint.astro     en/privacy.astro
    de/products/  en/products/   braze-sgtm-proxy.astro, shopify-gtm-setup.astro
  assets/projects/   Project screenshots — optimised by astro:assets
  styles/global.css  Tailwind import, @theme tokens, @utility, base layer
public/
  favicon.svg  robots.txt  static/og/   (OG image + apple-touch-icon)
tools/
  og-card.html   Source for the OG image. To regenerate: copy into public/,
                 render at 1200x630, save to public/static/og/datapip-og.png.
```

## Design system — "Instrument"

Defined entirely in `src/styles/global.css`. Components read tokens; **no component ever hard-codes a colour.** (v1's bug was exactly this: a hard-coded `text-black/60` plus a `.dark` block that turned the brand teal white.)

- **Ground ramp:** `ground` → `ground-deep` → `raised` → `rule` → `rule-strong`
- **Ink:** `fg` → `fg-muted` → `fg-faint`
- **State — the only colours in the system:** `signal` (teal: pass + interactive), `warn`, `crit`. `warn` and `crit` appear *only* inside tool output and form errors. Nothing is coloured decoratively.
- **Type:** IBM Plex Sans for prose; JetBrains Mono is **structural** — every eyebrow, label, metric, table header and status chip. Use the `label` utility. Digits that line up get `tabular-nums`.
- **Scale:** fluid `--text-display / h2 / h3 / lede / label / data`. Display type is spent once per screen; everything else stays small and dense.
- **Grid:** the `grid-rules` utility draws the visible column grid. Keep it at the edge of perception — order, not pattern.
- **Theme:** dark-committed, `color-scheme: dark`. A light theme would be a second token block, not a refactor.

### Contrast is a hard constraint, not a preference

All three ink tiers carry small text (labels, table headers, tag chips), so **every one of them must clear WCAG AA 4.5:1 against `ground`, `ground-deep` AND `raised`** — `raised` is the lightest ground and therefore the worst case. Current worst-case ratios: `fg` 14.6:1, `fg-muted` 7.4:1, `fg-faint` 4.6:1. **Lowering any lightness value breaks AA.** Verify with a real OKLCH→sRGB contrast calculation, not by eye.

### Project screenshots

`src/assets/projects/` holds two kinds of image, and they are not shot the same way:

- **Live sites** (`brotrechner.de`, `sardinienhunde.org`) — clean viewport captures at **1280×720**, no browser chrome. They were originally full Edge-window screenshots including the tab and address bar; that was dropped deliberately, so do not reintroduce chrome on one card only.
- **Product mockups** (the Braze, Shopify and viewer shots) — designed cards, not screenshots. Not reproducible from a URL.

`Projects.astro` renders these at `aspect-video` with `object-cover`, so anything that is not 16:9 gets cropped top and bottom. Shoot at 1280×720 and nothing is lost.

To re-shoot a live site after a redesign: load it at a 1280×720 viewport, dismiss any consent banner **without accepting analytics** (SardinienHunde runs Klaro — use *Auswahl speichern*, not *Alle akzeptieren*), scroll to top, capture the viewport, then

```sh
node -e "require('sharp')('shot.png').resize(1280,720,{fit:'cover'}).webp({quality:82}).toFile('src/assets/projects/<name>.webp')"
```

Filenames are imported by name in `src/i18n/portfolio.ts`, so keeping the name means no code change.

### Layout rule that bites

Grid and flex items default to `min-width: auto`, so any wide child (the scan table, the CV table) will push its track past the viewport and give the whole page a horizontal scrollbar. **Every grid track holding a wide element needs `min-w-0`**, with `overflow-x-auto` on the wide element's own wrapper — and that wrapper needs `tabindex="0"` + `role="region"` + an `aria-label` so it can be scrolled by keyboard (WCAG 2.1.1).

## The hero cookie scanner

`ScanPanel.astro` + `POST /api/scan`. The visitor enters a URL, Playwright loads it once **without touching the consent banner**, and the panel reports what was set — so everything it finds is pre-consent by definition. It deliberately does not try to click a CMP: guessing selectors gives unreliable results, and "what happens if I just visit" is the honest question anyway.

This is the most reachable endpoint on the site, so it is guarded on four axes, all in `src/lib/guards.ts` and `is-public-url.ts`:

| Guard | Value | Failure |
|---|---|---|
| SSRF (`isPublicUrl`) | rejects non-http(s), loopback, RFC1918, link-local, unique-local | 400 `private` |
| Concurrency | max 2 Playwright jobs | 503 `busy` |
| Rate limit | 5 scans / 10 min / IP | 429 `limit` |
| Cache | 5 min TTL per URL, checked *before* the rate limit | — |

**Do not remove or loosen any of these.** Rate limiting keys off Astro's `clientAddress` (the real socket address), never a forgeable proxy header and never a shared fallback constant — a shared key turns the per-IP limit into a site-wide one.

All guard state is per-process. If this is ever scaled past one Node process, the cache, slots and limits become per-instance — revisit before adding a replica.

**Deployment requires Chromium on the host:**

```
npx playwright install --with-deps chromium
```

The Playwright npm version and the installed browser build must match. Upgrading `playwright` without re-running this gives an instant `Executable doesn't exist` failure that surfaces as a 502.

## Analytics

Self-hosted Umami, **client-side only**, served from `measure.datapip.de` — the site's own subdomain, so the "no third-party requests" property still holds, for the same reason the fonts are self-hosted. Moving analytics to a vendor-hosted domain would break that claim and would mean updating the privacy page.

**There is no consent gate, deliberately.** The tracker is cookieless and writes nothing to the visitor's device, so there is no storage or access to obtain consent for. The script loads unconditionally in production. This is a decision, not an oversight — do not add a banner or a gate without a specific reason.

Implementation is one block in `Base.astro`, guarded by `import.meta.env.PROD` so development never writes into the dataset, with `data-domains` as a second guard so a staging host cannot either.

**Deliberately not ported from v1.** All of it existed to serve the server-side pageview:

| v1 file | what it did |
|---|---|
| `middleware.ts` | fired the server-side pageview |
| `lib/track.ts` (133 lines) | server-side Umami call, IP anonymisation, `allowedPaths` |
| `app/api/verify/route.ts` | fired that event and set the `verified` cookie |
| `public/static/verify.js` | triggered it on load |

The `allowedPaths` exact-match whitelist goes with them — and with it v1's trap that every new route had to be added to that list by hand or it went silently untracked. **v2 has no per-route tracking list to keep in sync.**

One note if you ever go back to v1 for reference: its documentation describes the `verified` cookie as a consent gate, but the code sets it unconditionally on first paint and there is no consent prompt anywhere in that repository. In practice it was a JS-capability and bot filter.

## Internationalisation

- **Locales:** `de` (default), `en`. Both are prefixed (`prefixDefaultLocale: true`) so v1's `/de` and `/en` URLs keep working — do not switch German to bare `/` without setting up 301s.
- `redirectToDefaultLocale` is `false`; `src/pages/index.astro` handles `/` itself so it can honour `Accept-Language` the way v1's middleware did.
- Copy lives in `src/i18n/`, keyed by locale. No i18n library.
- Route slugs differ per locale (`cookie-scanner` vs `cookie-crawler`) — always resolve through `routes[lang]`, never hard-code a path.
- `switchLocalePath()` preserves the trailing slash so `hreflang` alternates and `canonical` agree.
- **`switchLocalePath()` also translates the slug**, through a reverse `slug → route key` lookup over `routes`. It has to: the English alternate of `/de/impressum/` is `/en/imprint/`, and emitting `/en/impressum/` points both the `hreflang` alternate and the nav language switcher at a 404. It previously swapped only the locale segment, so every non-homepage advertised a broken alternate — the homepages hid it because they have no slug. A slug with no `routes` entry passes through unchanged. **When adding a route, adding it to `routes` is what makes the switcher work** — there is no second place to register it.

## Legal pages

Four pages, one shape: `de/impressum`, `de/datenschutz`, `en/imprint`, `en/privacy`.

- Copy and operator data live in `src/i18n/legal.ts`. `legalContact` is the verbatim port of v1's `lib/const.ts`; the Impressum text is verbatim from v1. **Binding content — copy it, never reword or re-translate it.**
- Rendered by `components/legal/`: `LegalPage.astro` (shell + metadata), `LegalSection.astro` (one numbered clause), `LegalContactCard.astro` (the imprint spec table), `LegalResponsible.astro` (the privacy address clause).
- A clause is `{ heading, paragraphs?, items?, outro? }`. `outro` exists so the rights clause keeps v1's order — list first, closing sentence last.
- Clause numbering is positional: the privacy page renders `intro` as 01, `responsible` as 02, then `sections` from 03. **Inserting a clause renumbers everything below it**, so never cite a clause by number in copy or in an external document.

### The privacy text is not a verbatim port, deliberately

v2's data flows are not v1's, and the policy describes v2. If any of this changes, the policy changes with it:

| Clause | Why it differs from v1 |
|---|---|
| Contact form | No PocketBase in v2 — the enquiry is emailed and nothing else. v1 claimed storage. |
| Cookie scanner | New in v2. Declares server-side fetch, the 5-min result cache and the 10-min per-IP rate-limit hold — the retention numbers come straight from `src/lib/guards.ts`. |
| Web analytics | Client-side cookieless Umami on the site's own subdomain; no consent gate, no § 25 TDDDG consent needed. v1 described its server-side tracking. |
| Cookies | **v2 sets none at all.** v1's `verified` and `browserLanguage` cookies are both gone — server-side tracking was not ported, and `pages/index.astro` negotiates the locale from `Accept-Language` without writing anything. |

**Unverified from the repo:** the Hosting (Hetzner) and Cloudflare clauses are carried over from v1 and describe infrastructure, not code. Confirm they still hold before launch.

## Product pages

Two products, four URLs, one component. Copy and metadata live in `src/i18n/products.ts`; `components/product/ProductPage.astro` renders all of it, and the four page files under `pages/{lang}/products/` do nothing but pick a locale, a product and an image.

- **The URLs are indexed — never change a `slug`.** `/{lang}/products/braze-sgtm-proxy/` and `/{lang}/products/shopify-gtm-setup/`, identical in both locales.
- Copy is a verbatim port of v1's `(shared)/(products)` components. It is commercial copy already ranking on these URLs; port it, do not rewrite it.
- The two products describe themselves differently — Braze has one prose block (`whatIs.body`), Shopify has an intro plus two named parts (`whatIs.intro` / `points` / `closing`). Both shapes are supported rather than forced into one.
- **Not ported:** v1's lucide icons on the feature cards. Instrument colours nothing decoratively, so the hairline grid does the structural work. Also not ported: the Shadcn accordion — the FAQ is native `<details>`/`<summary>`, which keeps the page at zero JS.
- Both CTAs carry v1's `data-umami-event` attributes, distinguished by `data-umami-event-type` (`product-hero-cta` / `product-bottom-cta`). Keep them — that is how CTA position is attributed.

### JSON-LD

Each page emits one `application/ld+json` graph: `SoftwareApplication` + `BreadcrumbList` + `FAQPage`, built in `ProductPage.astro` from the `schema` block. It reaches `<head>` through Base's `head` slot.

**v1's middle "Products" breadcrumb was dropped, not missed.** It pointed at `/{lang}/products`, which has never existed in either version. The crumb trail is now Home → product.

### Base.astro gained three props

`keywords`, `ogImage` and a `head` slot, all optional and all used by these pages. `ogImage` matters: the share image is rendered as **JPEG** via `getImage()`, because social scrapers handle WebP unreliably. The on-page `<Image>` stays AVIF like everywhere else.

## Environment

Copy `.env.example` to `.env`. All vars are declared in `astro.config.mjs` under `env.schema` and read through `astro:env/server`, so they are typed and never reach the client. All are **optional**: without them the contact form still renders and validates, but reports a configuration error instead of sending.

```
SMTP_HOST  SMTP_PORT  SMTP_USER  SMTP_PASS  FROM_EMAIL  TO_EMAIL
```

## Adding a page — checklist

1. Create it under **both** `src/pages/de/` and `src/pages/en/`.
2. Add the slug to `routes` in `src/i18n/ui.ts` (both locales).
3. Add copy to `src/i18n/`.
4. Confirm it appears in `dist/client/sitemap-0.xml` after a build.

## Content integrity

- Project descriptions, testimonials and CV entries are **real** and were ported from v1. Do not invent, embellish or translate them loosely.
- **The hero shows only real measurements.** It previously displayed invented cookies on `example.de`; that was replaced precisely because fabricated evidence undermines a page whose argument is "I find real problems". Never reintroduce sample data there — if the scanner cannot run, show its empty or error state.
- Do not ship a scan of a *named third party* as marketing copy. Publishing "example-gmbh.de sets cookies before consent" on a commercial homepage is a UWG risk in Germany. Visitor-initiated scans are fine; the result belongs to the visitor, not the page.
- Contact address is `info@datapip.de` (from v1 `lib/const.ts`).

## The v1 repository — use it as the lookup

v1 lives beside this project at **`../datapip.de`** (`D:\Development\datapip.de`), a Next.js 15 App Router site. It is the **source of truth for content and business logic**, and the reference for every route that still has to be rebuilt.

How to use it:

- **Copy content verbatim.** Legal text, product copy, testimonials and CV entries are real and, in the legal case, binding. Never paraphrase, re-translate or "improve" them while porting.
- **Copy logic, not patterns.** The guards, parsing and API behaviour port across almost unchanged. React components, Shadcn UI, `next/image`, Server Actions and `middleware.ts` do **not** — rebuild the UI with the Instrument tokens and Astro components.
- **Check `app/sitemap.ts` and `lib/track.ts`** for the canonical list of v1 URLs before adding a route, so slugs match and nothing 404s after the cutover.

Where things live in v1:

| What | v1 path |
|---|---|
| Legal contact data (address, VAT ID) | `lib/const.ts` |
| Legal pages | `app/[lang]/(de)/impressum/`, `(de)/datenschutz/`, `(en)/imprint/`, `(en)/privacy/` |
| Product pages | `app/[lang]/products/*`, content in `app/[lang]/(shared)/(products)/*.tsx` |
| Cookie crawler UI | `app/[lang]/(shared)/(crawler)/*.tsx` |
| Data layer checker UI | `app/[lang]/(shared)/(checker)/*.tsx` |
| De-coder UI | `app/[lang]/(shared)/(de-coder)/decoder.tsx` |
| Crawler API | `app/api/crawl/route.ts` |
| Checker API | `app/api/check/route.ts` |
| Feedback → PocketBase | `app/api/feedback/route.tsx` |
| Umami client snippet | `app/[lang]/layout.tsx` (already ported — see Analytics) |
| Umami server-side tracking | `lib/track.ts`, `middleware.ts`, `app/api/verify/route.ts`, `public/static/verify.js` — **deliberately not ported** |
| Bot/referer guard | `lib/is-trusted.ts` |
| URL inventory | `app/sitemap.ts` |

## Roadmap

Ordered by dependency and by damage-if-missing, not by fun. Each step is independently shippable. **Every step must end with `npm run check` at 0 errors, a passing build, and both locales verified.**

### Done

- Astro 7 scaffold, Instrument design system, bilingual homepage (hero, services, testimonials, projects, about, contact)
- Contact form with SMTP send, honeypot, progressive enhancement
- Localised 404, robots.txt, sitemap, OG image, favicon
- Hero cookie scanner + `POST /api/scan` with SSRF, concurrency, rate-limit and cache guards
- Client-side Umami analytics, no consent gate (see Analytics)
- Legal pages — Impressum, Datenschutz, Imprint, Privacy (see **Legal pages** below)
- Product pages — Braze sGTM proxy and Shopify GTM setup, both locales (see **Product pages** below)

### Step 3 — De-coder ⟵ do this first

**Why now:** the cheapest of the three tools — 461 lines, pure client-side, no API, no Playwright.

- Port `app/[lang]/(shared)/(de-coder)/decoder.tsx`. Needs the `json5` dependency for lenient parsing.
- This is genuinely interactive. Either write it as a vanilla island like `ScanPanel.astro`, or add `@astrojs/react` and reuse the v1 component. **Prefer vanilla** — one React island pulls ~45 KB onto that page. Decide deliberately and record the decision here.
- Routes: `de/de-kodierer.astro`, `en/de-coder.astro`.

**Done when:** decoding matches v1 for the same inputs, including malformed-JSON handling, and the page ships no framework runtime unless the decision above says otherwise.

### Step 4 — Cookie scanner page + full report

**Why now:** the API already exists; this unlocks the "full report" link the hero deliberately does not yet have.

- Extend `POST /api/scan` to return the full result, not just the first three cookies — v1's `app/api/crawl/route.ts` also collects observed requests and local/session storage; add those back.
- Keep the hero's truncated view; the page shows everything.
- The v1 crawler accepts an optional `cssSelector` to click a consent banner and re-scan. That is what makes a *before/after consent* comparison possible — the strongest version of this tool. Port it.
- Add the "full report" link to `ScanPanel.astro` **only once this page exists**.
- Routes: `de/cookie-scanner.astro`, `en/cookie-crawler.astro`.

**Done when:** the page renders a full scan, the hero links to it, and the SSRF/concurrency/rate-limit guards still hold on the extended endpoint.

### Step 5 — Data layer checker

**Why now:** the heaviest tool, and the only one still needing a new API route.

- Port `app/api/check/route.ts` (292 lines) to `src/pages/api/check.ts`, `prerender = false`.
- **Concurrency here is max 1, not 2** — it batches up to 50 URLs per request. Add a second slot pool to `src/lib/guards.ts`; do not reuse the scanner's.
- Every URL in the batch must pass `isPublicUrl()`, not just the first.
- Apply a rate limit at least as strict as the scanner's.
- UI from `app/[lang]/(shared)/(checker)/*.tsx` (~500 lines).
- Routes: `de/data-layer-checker.astro`, `en/data-layer-crawler.astro`.

**Done when:** a 50-URL batch completes, a 51st is rejected, a private URL anywhere in the batch is rejected, and two concurrent batches give the second a busy response.

### Backlog — not scheduled

- **PocketBase feedback storage.** v1's contact form dual-wrote: `components/contact/action.ts` (95 lines) called `sendMail()` and `storeDatabase()` in parallel and returned `success: mailSuccess || storeSuccess` — either channel landing counted as success. (`app/api/feedback/route.tsx` is a *different* endpoint, marked `// needed for browser extensions`, with `source`/`publish` fields the form never sent. Read `action.ts` for the dual-write logic, not that route.) v2 only emails, so a failed SMTP send loses the enquiry. But v1's version was dishonest under partial failure: with SMTP down the visitor saw "sent" while the enquiry sat unread in PocketBase. v2 returns a visible error instead, so the visitor knows to retry or mail directly. **If this is revived, keep the honest failure report** — the point would be durability, not hiding the failure.
- **Light theme.** The token layer is ready; it is a second block in `global.css` plus a toggle. Only if asked for.
- **Redis or similar for guard state.** Required before running more than one Node process — see the scanner section.
- **Tests.** There are none. The highest-value first test is a contrast assertion over the `@theme` tokens, since that constraint is easy to break silently and `astro check` cannot catch it.

## URL parity — check before cutover

Every v1 URL must resolve in v2 or 301 somewhere sensible. v1's inventory (from its `app/sitemap.ts`):

| v1 URL | v2 status |
|---|---|
| `/de`, `/en` | done (now `/de/`, `/en/`) |
| `/de/impressum`, `/de/datenschutz` | done |
| `/en/imprint`, `/en/privacy` | done |
| `/de/products/braze-sgtm-proxy`, `/en/products/braze-sgtm-proxy` | done |
| `/de/products/shopify-gtm-setup`, `/en/products/shopify-gtm-setup` | done |
| `/de/de-kodierer`, `/en/de-coder` | step 3 |
| `/de/cookie-scanner`, `/en/cookie-crawler` | step 4 |
| `/de/data-layer-checker`, `/en/data-layer-crawler` | step 5 |

Note the **trailing slash**: v2 emits `/de/` where v1 used `/de`. Confirm the host redirects one to the other consistently rather than serving both.

## Launch checklist

1. All 16 v1 URLs resolve or redirect (table above).
2. `npm run check` 0 errors; `npm run build` clean.
3. `npx playwright install --with-deps chromium` on the host; scan a real site end to end in production.
4. SMTP configured; send a real test enquiry and confirm it arrives.
5. `sitemap-index.xml` reachable, `robots.txt` points at it, no bare `/` in the sitemap.
6. Both locales spot-checked at 390 px and 1440 px; no horizontal scroll.
7. OG image renders correctly in a link-preview debugger.
8. Resubmit the sitemap in Search Console and watch for 404 spikes for two weeks.

## Verification

- `npm run check` — 0 errors before shipping.
- `npm run build` — must prerender `/de/` and `/en/` and emit a sitemap that does **not** contain the bare `/` redirect.
- Check **both** locales for any content change.
- Test at 390px wide: `document.documentElement.scrollWidth` must equal `clientWidth`.
- Any new colour must come from a token in `@theme`, and must pass the contrast rule above.
- Template comments must be `{/* … */}`; grep the built HTML for `<!--` — it should return nothing.
