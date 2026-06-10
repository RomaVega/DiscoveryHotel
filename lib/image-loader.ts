/**
 * Custom next/image loader that proxies through Netlify Image CDN in production.
 *
 * Why: `output: "export"` disables Next's built-in optimizer, so without this every
 * <Image> would ship the source file at full resolution. Netlify Image CDN
 * (/.netlify/images) resizes on demand at the edge and negotiates AVIF/WebP via
 * Accept header — no build-time variant generation, no extra dependencies.
 *
 * In dev, the /.netlify/images endpoint isn't available, so we pass paths through.
 */
import { ASSET_VERSION } from "@/lib/site";

type ImageLoaderProps = { src: string; width: number; quality?: number };

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//")) {
    return src;
  }

  const fullPath = `${BASE_PATH}${src}`;

  if (process.env.NODE_ENV !== "production") {
    return fullPath;
  }

  // Embed the version in the source `url` (not as a separate param) so it is
  // part of the Netlify Image CDN cache key — busting the edge cache and the
  // browser cache together. The static host ignores the query when serving.
  const versionedPath = ASSET_VERSION ? `${fullPath}?v=${ASSET_VERSION}` : fullPath;
  const params = new URLSearchParams({
    url: versionedPath,
    w: String(width),
    q: String(quality ?? 75),
  });
  return `${BASE_PATH}/.netlify/images?${params.toString()}`;
}
