/** Canonical site URL */
export const SITE_URL = "https://orlowsky.id";

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
export const ASSET_VERSION = "20260610c";
