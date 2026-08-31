import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * SSRF guard, ported from v1. Every caller-supplied crawl target must pass
 * through this before it reaches Playwright.
 *
 * Known gap (inherited from v1): the check is pre-flight only, so a target
 * that redirects into a private range is not caught. Do not treat it as
 * complete.
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
