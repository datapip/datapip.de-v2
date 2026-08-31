/**
 * In-memory TTL cache, concurrency slots and a per-IP rate limit.
 *
 * All state is per-process and deliberately so: the scanner is a courtesy
 * tool, not a product surface, and a restart losing its cache is fine.
 * If the site is ever scaled past one Node process, these become per-instance
 * — revisit before adding a second replica.
 */

/* ------------------------------ TTL cache ------------------------------ */

const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

export function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setInCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiry: Date.now() + CACHE_TTL_MS });
}

/* --------------------------- Concurrency ------------------------------ */

/** Playwright is expensive. v1 capped the crawler at 2; keep it there. */
const MAX_CONCURRENT_JOBS = 2;
let activeJobs = 0;

export function tryAcquireSlot(): boolean {
  if (activeJobs >= MAX_CONCURRENT_JOBS) return false;
  activeJobs++;
  return true;
}

export function releaseSlot(): void {
  activeJobs = Math.max(0, activeJobs - 1);
}

/* --------------------------- Rate limiting ----------------------------- */

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const hits = new Map<string, number[]>();

/**
 * The scanner sits in the hero, so it is the most reachable endpoint on the
 * site. Without this one visitor could hold both Playwright slots forever.
 */
export function withinRateLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return false;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(key);
    }
  }

  return true;
}

/**
 * `clientAddress` is the socket address the node adapter actually saw. Prefer
 * it over proxy headers, which a caller can forge — and never fall back to a
 * shared constant, or every visitor lands in one rate-limit bucket and the
 * limit becomes site-wide.
 */
export function clientIp(request: Request, clientAddress?: string): string {
  if (clientAddress) return clientAddress;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return request.headers.get("x-real-ip") ?? "unknown";
}
