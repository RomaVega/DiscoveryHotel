/** Canonical site URL */
export const SITE_URL = "https://orlowsky.id";

export const SITE_NAME = "Orlowsky Discovery Hotel";

export const OG_IMAGE = `${SITE_URL}/images/hero/hero-og.jpg`;

/**
 * Fallback cache-busting token for lib/image-loader.ts.
 *
 * Images are served `immutable` for a year (netlify.toml) with filenames that
 * are NOT content-hashed, so replacing a photo in place needs something to
 * bust the cache. lib/image-manifest.ts now hashes every image's actual bytes
 * at build time and the loader prefers that automatically — no manual step.
 *
 * This constant only matters for a path that manifest doesn't cover (one built
 * at runtime rather than appearing as a literal for the scanner to find).
 * Bumping it busts every such path at once.
 */
export const ASSET_VERSION = "20260723a";
