/**
 * Hero cookie scanner.
 *
 * Loads the target once and reports what it set WITHOUT any interaction with
 * a consent banner — so everything it finds is by definition pre-consent.
 * It deliberately does not try to click a CMP: guessing selectors produces
 * unreliable results, and "what happens if I just visit" is the honest,
 * legally interesting question anyway.
 *
 * Deployment note: the host needs Chromium —
 *   npx playwright install --with-deps chromium
 */
export const prerender = false;

import type { APIRoute } from "astro";
import { chromium } from "playwright";

import { isPublicUrl } from "../../lib/is-public-url";
import {
  clientIp,
  getFromCache,
  releaseSlot,
  setInCache,
  tryAcquireSlot,
  withinRateLimit,
} from "../../lib/guards";

const PAGE_TIMEOUT_MS = 25_000;
const SETTLE_TIMEOUT_MS = 6_000;

const CHROMIUM_ARGS = [
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--disable-blink-features=AutomationControlled",
];

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

export interface ScanCookie {
  name: string;
  domain: string;
  expiry: string;
  thirdParty: boolean;
}

export interface ScanResult {
  url: string;
  durationMs: number;
  cookieCount: number;
  thirdPartyCount: number;
  storageCount: number;
  cookies: ScanCookie[];
}

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

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return fail("invalid", 400);
  }

  const target = typeof body.url === "string" ? normalise(body.url) : null;
  if (!target) return fail("invalid", 400);

  const cached = getFromCache<ScanResult>(target);
  if (cached) {
    return new Response(JSON.stringify(cached), {
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
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: USER_AGENT,
      });

      try {
        const page = await context.newPage();

        let storageCount = 0;

        await page.goto(target, { waitUntil: "load", timeout: PAGE_TIMEOUT_MS });

        // Let late tags fire, but never hang on a page that never idles.
        await Promise.race([
          page.waitForLoadState("networkidle", { timeout: SETTLE_TIMEOUT_MS }),
          page.waitForTimeout(SETTLE_TIMEOUT_MS),
        ]);

        try {
          storageCount = await page.evaluate(
            () => localStorage.length + sessionStorage.length,
          );
        } catch {
          // Storage can be blocked; the cookie count is the headline anyway.
        }

        const targetHost = registrable(new URL(target).hostname);
        const raw = await context.cookies();

        const cookies: ScanCookie[] = raw
          .map((cookie) => ({
            name: cookie.name,
            domain: cookie.domain,
            expiry: formatExpiry(cookie.expires),
            thirdParty: registrable(cookie.domain) !== targetHost,
          }))
          // Longest-lived and third-party first: the ones that matter legally.
          .sort((a, b) => Number(b.thirdParty) - Number(a.thirdParty));

        const result: ScanResult = {
          url: target,
          durationMs: Date.now() - startedAt,
          cookieCount: cookies.length,
          thirdPartyCount: cookies.filter((c) => c.thirdParty).length,
          storageCount,
          cookies: cookies.slice(0, 3),
        };

        setInCache(target, result);

        return new Response(JSON.stringify(result), {
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
