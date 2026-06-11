/** Canonical site URL */
export const SITE_URL = "https://orlowsky.id";

/**
 * Hotel phone in international format with leading + (e.g. "+62822…").
 * Single source of truth is NEXT_PUBLIC_WHATSAPP_NUMBER; the throw fails the
 * SSG build loudly instead of baking "+undefined" into JSON-LD. Lazy (not a
 * module-level const) so importing this file never throws in tools that don't
 * load Next's .env files (vitest, scripts).
 */
export function getPhoneIntl(): string {
  const n = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!n) throw new Error("NEXT_PUBLIC_WHATSAPP_NUMBER is not set — required for WhatsApp links and JSON-LD telephone.");
  return `+${n}`;
}

export const SITE_NAME = "Orlowsky Discovery Hotel";

export const OG_IMAGE = `${SITE_URL}/images/hero/hero-og.jpg`;

/**
 * Cache-busting token appended to image URLs by lib/image-loader.ts.
 *
 * Image files are served `immutable` for a year (netlify.toml) but their
 * filenames are NOT content-hashed, so editing a photo in place (same name)
 * would otherwise leave returning visitors stuck on the cached old version.
 * Bumping this token changes every image URL at once, forcing a fresh fetch.
 *
 * ⚠️ Bump this (e.g. to the date) whenever you replace an image in place.
 */
export const ASSET_VERSION = "20260610d";
