/**
 * The date the statutes were last genuinely re-read against their primary
 * sources. This is an EDITORIAL date, not "today" — only bump it when the law
 * has actually been re-reviewed (the daily law-sync routine does this).
 *
 * Single source of truth on purpose. It used to be typed by hand into the
 * footer while public/sitemap.xml carried its own <lastmod>, and the two drifted
 * a month apart. scripts/prerender.mjs now stamps the sitemap from this value at
 * build time, and site-consistency.test.ts fails if they ever disagree again.
 */
export const LAST_REVIEWED = '2026-08-31'

/** "August 31, 2026" — the footer's display form. Parsed as UTC so the
 *  rendered date never shifts by a day depending on the reader's timezone. */
export function formatLastReviewed(iso: string = LAST_REVIEWED): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
