/**
 * The wire contract for `POST /api/scan`.
 *
 * These live here rather than in the route because three places need them and
 * only one of those can import the route: `src/pages/api/scan.ts` imports
 * Playwright, so a value import from a client script would drag the whole
 * browser automation stack into the bundle.
 *
 * They were previously hand-copied into both panels' client scripts — about
 * thirty fields, maintained in triplicate, with nothing checking that the
 * copies agreed. Adding one field to `ConsentPhase` meant editing three files
 * and a miss compiled cleanly.
 */

export interface ScanCookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expiry: string;
  /** v1 called this `source: "http" | "js"`. */
  httpOnly: boolean;
  thirdParty: boolean;
}

export interface ScanStorageItem {
  name: string;
  value: string;
  storage: "local" | "session";
  frameUrl: string;
}

export interface ScanRequest {
  url: string;
  host: string;
  thirdParty: boolean;
}

/** What the second, post-click pass saw, and what consent actually changed. */
export interface ConsentPhase {
  /** False when the click did not happen — the numbers are then unchanged. */
  clicked: boolean;
  /** Why not, so the UI can tell a typo apart from a covered button. */
  reason: "clicked" | "not-found" | "not-clickable";
  cookieCount: number;
  thirdPartyCount: number;
  storageCount: number;
  requestCount: number;
  /** Cookies present after consent that were not there before. */
  addedCookies: ScanCookie[];
}

export interface ScanResult {
  url: string;
  durationMs: number;
  /** Every count below describes the PRE-consent pass. */
  cookieCount: number;
  thirdPartyCount: number;
  storageCount: number;
  requestCount: number;
  thirdPartyHostCount: number;
  cookies: ScanCookie[];
  storage: ScanStorageItem[];
  requests: ScanRequest[];
  truncated: { requests: boolean; storage: boolean };
  consent?: ConsentPhase;
}

/**
 * What the hero panel receives — counts plus the first few cookies. Named so
 * `brief()` can be annotated with it, which is what ties the endpoint's
 * narrowed response to the hero that consumes it.
 */
export interface ScanBrief {
  url: string;
  durationMs: number;
  cookieCount: number;
  thirdPartyCount: number;
  storageCount: number;
  cookies: ScanCookie[];
}
