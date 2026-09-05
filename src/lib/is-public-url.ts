import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * SSRF guard, ported from v1. Every caller-supplied crawl target must pass
 * through this before it reaches Playwright.
 *
 * This is a PRE-FLIGHT check: it validates a URL before it is fetched and
 * knows nothing about where that URL later redirects to. v1 stopped there,
 * which left a public URL redirecting to 127.0.0.1 unguarded. Callers must
 * therefore re-check the URL they actually landed on — `api/scan.ts` does
 * this after navigation and again after a consent click.
 *
 * Remaining gap, accepted: the window between the DNS lookup here and the
 * browser's own lookup (DNS rebinding). Closing it means resolving once and
 * pinning the IP, which is disproportionate for this site.
 */
const PRIVATE_RANGES = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^169\.254\./, // cloud metadata
  /^0\./,
  /^::1$/,
  /^f[cd]/i,
  /^fe80:/i,
];

export async function isPublicUrl(raw: string): Promise<boolean> {
  try {
    const { hostname, protocol } = new URL(raw);

    if (protocol !== "http:" && protocol !== "https:") return false;
    if (!hostname) return false;

    const ip = isIP(hostname) ? hostname : (await lookup(hostname)).address;

    return !PRIVATE_RANGES.some((range) => range.test(ip));
  } catch {
    return false;
  }
}
