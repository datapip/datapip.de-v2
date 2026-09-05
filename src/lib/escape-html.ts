/**
 * Escape a string for interpolation into HTML.
 *
 * Both tool panels build their output with `innerHTML` over data that comes
 * from a scanned third-party site — cookie names, storage keys, request URLs
 * — so this is the XSS boundary for the whole site. It lives in one place
 * because two copies under two names (`escape` and `esc`) hid the fact that
 * they were the same safety-critical function.
 */
export function escapeHtml(value: string): string {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]!,
  );
}
