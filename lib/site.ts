import { ASSET_VERSIONS } from "@/lib/image-manifest";

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

/**
 * Appends the file's content hash to a public asset path: `/video/hero.mp4` →
 * `/video/hero.mp4?v=1a2b3c4d`.
 *
 * For assets that do NOT go through lib/image-loader.ts — chiefly the hero
 * <video><source> tags, which are plain URLs. netlify.toml serves /video/*
 * `immutable` for a year under a filename that never changes, so without this a
 * re-cut hero clip would keep showing the old footage to returning visitors for
 * up to a year, with no way to force a refresh. The static host ignores the
 * query when serving, so the file still resolves.
 *
 * Falls back to ASSET_VERSION when the manifest has no entry — e.g. a path
 * assembled at runtime, which the build-time scanner cannot see.
 */
export function versionedAsset(src: string): string {
  const version = ASSET_VERSIONS[src] ?? ASSET_VERSION;
  return version ? `${src}?v=${version}` : src;
}
