/**
 * The one place that talks to PocketBase.
 *
 * Two callers write to the same collection — the contact form and the
 * extensions' feedback endpoint — and v1 had the authenticate-then-create
 * dance copied into both, with two different ideas of what "configured"
 * meant. One module, one definition, one place to change if the collection
 * ever moves.
 */
import { PB_ENDPOINT, PB_USER, PB_PASSWORD } from "astro:env/server";

/**
 * v1 wrote contact enquiries and extension feedback into the same collection,
 * telling them apart by `source`. Keeping that means the existing rows and
 * the new ones stay one uniform history rather than two half-histories.
 */
export const FEEDBACK_COLLECTION = "feedback";

/**
 * A write that hangs must not hang the page waiting on it.
 *
 * The contact form now awaits this alongside the mail, so an unreachable
 * PocketBase would otherwise hold the visitor's POST open until the socket
 * gave up — turning a background durability copy into a broken form. The
 * request may still land after this fires; the caller simply stops waiting,
 * and treats it as failed, which is the safe direction.
 */
const WRITE_TIMEOUT_MS = 5_000;

/** Every variable, not just the endpoint: a partial config cannot write. */
export function isPocketBaseConfigured(): boolean {
  return Boolean(PB_ENDPOINT && PB_USER && PB_PASSWORD);
}

export async function createRecord(
  collection: string,
  data: Record<string, unknown>,
): Promise<void> {
  // Copied to locals, not read straight from the import: narrowing an
  // imported binding does not survive into the closure below, so the checked
  // values have to be the ones it captures.
  const endpoint = PB_ENDPOINT;
  const user = PB_USER;
  const password = PB_PASSWORD;

  if (!endpoint || !user || !password) {
    throw new Error("PocketBase is not configured");
  }

  const write = async () => {
    // Imported lazily, like the mail transport: the SDK stays out of the
    // build until a route that writes is actually hit.
    const { default: PocketBase } = await import("pocketbase");
    const pb = new PocketBase(endpoint);

    await pb.collection("users").authWithPassword(user, password);
    await pb.collection(collection).create(data);
  };

  let timer: NodeJS.Timeout | undefined;
  try {
    await Promise.race([
      write(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`PocketBase did not answer within ${WRITE_TIMEOUT_MS}ms`)),
          WRITE_TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    // Otherwise a pending timer keeps the event loop alive after a fast write.
    clearTimeout(timer);
  }
}
