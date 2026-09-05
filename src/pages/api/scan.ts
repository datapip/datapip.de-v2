/**
 * Cookie scanner endpoint. Serves both the hero panel and the full report
 * page.
 *
 * The default pass loads the target once and reports what it set WITHOUT any
 * interaction with a consent banner — so everything it finds is by definition
 * pre-consent. That is the honest, legally interesting question, and it stays
 * the headline.
 *
 * A caller may additionally supply `selector`, a CSS selector for the banner's
 * accept button. The scan then runs a SECOND phase: click it, let the page
 * settle again, and snapshot once more. Reporting both phases is what turns
 * "here is what leaks" into "here is what consent actually changed" — the
 * comparison is the point, so the pre-consent phase is never skipped.
 *
 * One scan always produces the full result and caches it; `full: false`
 * callers get a narrowed view of the same cached object. That way a hero scan
 * warms the cache for the report page and vice versa, and there is never a
 * second Playwright run for a URL already scanned.
 *
 * Deployment note: the host needs Chromium —
 *   npx playwright install --with-deps chromium
 */
export const prerender = false;

import type { APIRoute } from "astro";
import { chromium, type Frame, type Page } from "playwright";

import { isPublicUrl } from "../../lib/is-public-url";
import type {
  ConsentPhase,
  ScanBrief,
  ScanCookie,
  ScanRequest,
  ScanResult,
  ScanStorageItem,
} from "../../lib/scan-types";
import {
  clientIp,
  getFromCache,
  releaseSlot,
  setInCache,
  tryAcquireSlot,
  withinRateLimit,
} from "../../lib/guards";

const PAGE_TIMEOUT_MS = 25_000;

/* Settling is a floor THEN a ceiling, never a race — see settle(). The
   post-consent floor is the longer of the two because the whole point of that
   phase is to catch a tag chain that has not started yet. */
const LOAD_SETTLE_MIN_MS = 1_500;
const LOAD_SETTLE_MAX_MS = 6_000;
const CONSENT_SETTLE_MIN_MS = 2_500;
const CONSENT_SETTLE_MAX_MS = 8_000;

/* The consent phase is bounded on purpose: a selector that never matches must
   not hold a Playwright slot for a minute. Worst case here is ~7s. */
const CLICK_ATTEMPTS = 2;
const CLICK_TIMEOUT_MS = 3_000;
const CLICK_RETRY_WAIT_MS = 700;

/** Payload caps. Counts stay truthful; the lists say when they were cut. */
const MAX_REQUESTS = 250;
const MAX_STORAGE = 150;
const MAX_VALUE_CHARS = 200;
const MAX_SELECTOR_CHARS = 200;

const CHROMIUM_ARGS = [
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--disable-blink-features=AutomationControlled",
];

/**
 * The scan has to see what a real visitor sees, so the browser must not
 * announce itself as automation. Nothing here is about evading a site's
 * wishes: a tag suppressed because the client looked like a bot would make
 * the report understate the tracking, which is the one error this tool
 * cannot afford.
 *
 * The version is taken from the ACTUAL browser build rather than hard-coded.
 * A pinned "Chrome/122" string alongside a Chrome 151 binary is itself a
 * mismatch, because client hints keep reporting the real version.
 */
function chromeUserAgent(version: string): string {
  return (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    `(KHTML, like Gecko) Chrome/${version} Safari/537.36`
  );
}

/**
 * `navigator.userAgentData` is JS-visible and, left alone, tells every tag on
 * the page "HeadlessChrome" no matter what the UA header says. Setting the UA
 * without this leaves the two contradicting each other, which is a stronger
 * bot signal than either alone.
 */
const MASK_AUTOMATION = (major: string) => {
  const brands = [
    { brand: "Chromium", version: major },
    { brand: "Google Chrome", version: major },
    { brand: "Not?A_Brand", version: "24" },
  ];

  const define = (prop: string, value: unknown) => {
    try {
      Object.defineProperty(navigator, prop, { configurable: true, get: () => value });
    } catch {
      // A locked-down property is not worth failing the scan over.
    }
  };

  define("userAgentData", {
    brands,
    mobile: false,
    platform: "Windows",
    toJSON: () => ({ brands, mobile: false, platform: "Windows" }),
    getHighEntropyValues: async () => ({
      brands,
      mobile: false,
      platform: "Windows",
      platformVersion: "15.0.0",
      architecture: "x86",
      bitness: "64",
      model: "",
      uaFullVersion: `${major}.0.0.0`,
    }),
  });

  // The UA claims Windows; on a Linux host navigator.platform would disagree.
  define("platform", "Win32");

  // Keep navigator.languages in step with the Accept-Language header.
  define("languages", ["de-DE", "de", "en-US", "en"]);
};

type ErrorCode = "invalid" | "private" | "busy" | "limit" | "failed";

function fail(code: ErrorCode, status: number): Response {
  return new Response(JSON.stringify({ error: code }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** Approximate registrable domain. Good enough to split first vs third party. */
function registrable(hostname: string): string {
  const parts = hostname.replace(/^\./, "").toLowerCase().split(".");
  return parts.slice(-2).join(".");
}

function formatExpiry(expires: number): string {
  if (!expires || expires < 0) return "Session";
  const days = Math.round((expires * 1000 - Date.now()) / 86_400_000);
  return days <= 0 ? "Session" : `${days} d`;
}

/**
 * Wait for the page to go quiet — but wait a MINIMUM first.
 *
 * This used to be `Promise.race([waitForLoadState("networkidle"), timeout])`,
 * which is wrong in the one place it matters most. "networkidle" resolves as
 * soon as there have been no connections for 500ms, and the moment just after
 * a consent click is exactly such a lull: the banner has closed and the tag
 * manager has not made its first request yet. The race therefore returned in
 * ~500ms and the scan reported that consent set nothing, on a site where it
 * set 21 cookies. Measured on vkb.de: whole scan 1.4s, ADDED=0 — versus
 * ADDED=21 with the floor in place.
 *
 * So: sleep `min` unconditionally, then allow up to `max` total for the
 * network to settle. A page that never idles is still capped at `max`.
 */
async function settle(page: Page, min: number, max: number): Promise<void> {
  const startedAt = Date.now();
  await page.waitForTimeout(min);

  const remaining = max - (Date.now() - startedAt);
  if (remaining <= 0) return;

  // Rejects on timeout; that is the cap doing its job, not a failure.
  await page.waitForLoadState("networkidle", { timeout: remaining }).catch(() => {});
}

function clip(value: string): string {
  return value.length > MAX_VALUE_CHARS
    ? value.slice(0, MAX_VALUE_CHARS) + "…"
    : value;
}

function normalise(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * The hero only ever renders counts and the first three cookies, so it is
 * served a narrowed copy rather than the whole report. Same cached scan,
 * far smaller response on the page that gets the most traffic.
 */
function brief(result: ScanResult): ScanBrief {
  return {
    url: result.url,
    durationMs: result.durationMs,
    cookieCount: result.cookieCount,
    thirdPartyCount: result.thirdPartyCount,
    storageCount: result.storageCount,
    cookies: result.cookies.slice(0, 3),
  };
}

/* --------------------------- Consent click ---------------------------- */

/**
 * Playwright's CSS engine already pierces OPEN shadow roots, so the ordinary
 * web-component banner needs nothing special. CLOSED roots are invisible to
 * it — and to the visitor's own DevTools, which is where they got the
 * selector, so nobody can even write one for a closed root. Forcing every
 * root open before a single page script runs makes those reachable too.
 *
 * This runs before the document, so a component never observes a mode other
 * than the one it keeps for its lifetime.
 */
const FORCE_OPEN_SHADOW_ROOTS = () => {
  const attach = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init: ShadowRootInit) {
    return attach.call(this, { ...init, mode: "open" });
  };
};

/**
 * Why the click did or did not happen. `not-found` and `not-clickable` need
 * completely different fixes from whoever wrote the selector, so collapsing
 * them into one boolean sends people looking in the wrong place.
 */
type ClickOutcome = "clicked" | "not-found" | "not-clickable";

async function clickInFrame(frame: Frame, selector: string): Promise<ClickOutcome> {
  let element;
  try {
    element = await frame.$(selector);
  } catch {
    // Malformed selector — the frame cannot match it, so treat it as a miss.
    return "not-found";
  }

  if (!element) return "not-found";

  try {
    await element.click({ timeout: CLICK_TIMEOUT_MS });
    return "clicked";
  } catch {
    // Matched, but covered, hidden, disabled or detached.
    return "not-clickable";
  }
}

/** Banners often live in an iframe, so every frame is tried, not just the main one. */
async function clickConsent(page: Page, selector: string): Promise<ClickOutcome> {
  let outcome: ClickOutcome = "not-found";

  for (let attempt = 0; attempt < CLICK_ATTEMPTS; attempt++) {
    for (const frame of page.frames()) {
      const result = await clickInFrame(frame, selector);
      if (result === "clicked") return "clicked";
      // "matched but unclickable" is the more useful of the two failures,
      // so one frame reporting it outranks every other frame's plain miss.
      if (result === "not-clickable") outcome = "not-clickable";
    }
    await page.waitForTimeout(CLICK_RETRY_WAIT_MS);
  }

  return outcome;
}

/* ------------------------------ Snapshots ------------------------------ */

async function readStorage(page: Page): Promise<ScanStorageItem[]> {
  const perFrame = await Promise.allSettled(
    page.frames().map(async (frame) => {
      const frameUrl = frame.url();
      if (!frameUrl.startsWith("http")) return [];

      const items = await frame.evaluate(() => {
        const read = (type: "local" | "session") => {
          try {
            const store = type === "local" ? localStorage : sessionStorage;
            return Object.keys(store).map((key) => ({
              name: key,
              value: store.getItem(key) ?? "",
              storage: type,
            }));
          } catch {
            // Storage is blocked in some contexts; that is not an error here.
            return [];
          }
        };
        return [...read("local"), ...read("session")];
      });

      return items.map((item) => ({ ...item, frameUrl }));
    }),
  );

  return perFrame.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

async function readCookies(page: Page, targetHost: string): Promise<ScanCookie[]> {
  const raw = await page.context().cookies();

  return raw
    .map((cookie) => ({
      name: cookie.name,
      value: clip(cookie.value),
      domain: cookie.domain,
      path: cookie.path,
      expiry: formatExpiry(cookie.expires),
      httpOnly: cookie.httpOnly,
      thirdParty: registrable(cookie.domain) !== targetHost,
    }))
    // Third-party first: the ones that matter legally.
    .sort((a, b) => Number(b.thirdParty) - Number(a.thirdParty));
}

/* -------------------------------- Handler ------------------------------- */

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: { url?: unknown; selector?: unknown; full?: unknown };
  try {
    body = await request.json();
  } catch {
    return fail("invalid", 400);
  }

  const target = typeof body.url === "string" ? normalise(body.url) : null;
  if (!target) return fail("invalid", 400);

  const wantsFull = body.full === true;

  const selector =
    typeof body.selector === "string" && body.selector.trim()
      ? body.selector.trim().slice(0, MAX_SELECTOR_CHARS)
      : undefined;

  // Cache key includes the selector: a scan that clicked consent is a
  // different observation from one that did not.
  const cacheKey = `${target}|${selector ?? ""}`;

  const cached = getFromCache<ScanResult>(cacheKey);
  if (cached) {
    return new Response(JSON.stringify(wantsFull ? cached : brief(cached)), {
      headers: { "content-type": "application/json", "x-cache": "hit" },
    });
  }

  if (!withinRateLimit(clientIp(request, clientAddress))) return fail("limit", 429);
  if (!(await isPublicUrl(target))) return fail("private", 400);

  if (!tryAcquireSlot()) return fail("busy", 503);

  const startedAt = Date.now();

  try {
    const browser = await chromium.launch({ headless: true, args: CHROMIUM_ARGS });

    try {
      /* Client hints are sent as headers and are NOT derived from the
         userAgent option, so they have to be set alongside it or they keep
         announcing HeadlessChrome to every third party. */
      const version = browser.version();
      const major = version.split(".")[0] ?? "";

      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: chromeUserAgent(version),
        // A German visitor is the frame of reference for German privacy law,
        // and some CMPs pick their banner from exactly these two values.
        locale: "de-DE",
        timezoneId: "Europe/Berlin",
        extraHTTPHeaders: {
          "sec-ch-ua": `"Chromium";v="${major}", "Google Chrome";v="${major}", "Not?A_Brand";v="24"`,
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          // Playwright's `locale` sends a bare "de-DE"; a real browser always
          // sends a weighted list, and the difference is visible to the site.
          "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        },
      });

      try {
        await context.addInitScript(MASK_AUTOMATION, major);
        await context.addInitScript(FORCE_OPEN_SHADOW_ROOTS);

        const page = await context.newPage();
        const targetHost = registrable(new URL(target).hostname);

        // Deduplicated by URL; a page that requests the same asset twice is
        // one observation, not two.
        const requests = new Map<string, ScanRequest>();
        page.on("request", (req) => {
          const url = req.url();
          if (requests.has(url) || !url.startsWith("http")) return;
          try {
            const host = new URL(url).hostname;
            requests.set(url, {
              url,
              host,
              thirdParty: registrable(host) !== targetHost,
            });
          } catch {
            // Not a URL we can attribute; skip it rather than fail the scan.
          }
        });

        await page.goto(target, { waitUntil: "load", timeout: PAGE_TIMEOUT_MS });

        /* isPublicUrl only ever saw the URL that was submitted. A public URL
           that redirects to http://127.0.0.1:8090 lands the browser on an
           internal service, and the report would then describe it — an
           existence oracle for whatever else runs on this host. So re-check
           where we actually ended up, not just where we were asked to go. */
        if (!(await isPublicUrl(page.url()))) return fail("private", 400);

        // Let late tags fire, but never hang on a page that never idles.
        await settle(page, LOAD_SETTLE_MIN_MS, LOAD_SETTLE_MAX_MS);

        /* ---- Phase A: pre-consent. Always taken, always the headline. ---- */

        const cookies = await readCookies(page, targetHost);
        const storage = await readStorage(page);
        const preConsentRequestCount = requests.size;

        /* ---- Phase B: post-consent, only when a selector was supplied. ---- */

        let consent: ConsentPhase | undefined;

        if (selector) {
          const outcome = await clickConsent(page, selector);

          await settle(page, CONSENT_SETTLE_MIN_MS, CONSENT_SETTLE_MAX_MS);

          // Accepting a banner can navigate; the same check has to hold after.
          if (!(await isPublicUrl(page.url()))) return fail("private", 400);

          const after = await readCookies(page, targetHost);
          const afterStorage = await readStorage(page);
          const before = new Set(cookies.map((c) => `${c.name}|${c.domain}`));

          consent = {
            clicked: outcome === "clicked",
            reason: outcome,
            cookieCount: after.length,
            thirdPartyCount: after.filter((c) => c.thirdParty).length,
            storageCount: afterStorage.length,
            requestCount: requests.size,
            addedCookies: after.filter(
              (c) => !before.has(`${c.name}|${c.domain}`),
            ),
          };
        }

        const allRequests = [...requests.values()];
        const thirdPartyHosts = new Set(
          allRequests.filter((r) => r.thirdParty).map((r) => r.host),
        );

        const result: ScanResult = {
          url: target,
          durationMs: Date.now() - startedAt,
          cookieCount: cookies.length,
          thirdPartyCount: cookies.filter((c) => c.thirdParty).length,
          storageCount: storage.length,
          requestCount: preConsentRequestCount,
          thirdPartyHostCount: thirdPartyHosts.size,
          cookies,
          storage: storage.slice(0, MAX_STORAGE),
          requests: allRequests.slice(0, MAX_REQUESTS),
          truncated: {
            requests: allRequests.length > MAX_REQUESTS,
            storage: storage.length > MAX_STORAGE,
          },
          consent,
        };

        setInCache(cacheKey, result);

        return new Response(JSON.stringify(wantsFull ? result : brief(result)), {
          headers: { "content-type": "application/json", "x-cache": "miss" },
        });
      } finally {
        await context.close();
      }
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("[scan]", error instanceof Error ? error.message : error);
    return fail("failed", 502);
  } finally {
    releaseSlot();
  }
};
