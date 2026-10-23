import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Pixel size of a WebP under `public/`, read from its header at build time.
 *
 * Blog posts reference photos from Markdown, which has nowhere to put a width
 * and height, and `next/image` needs both to reserve the box before the image
 * arrives (CLS < 0.1 — see Performance in CLAUDE.md). Reading them off the file
 * keeps authors from having to type numbers that then go stale when a photo is
 * re-exported. WebP only: every photo on the site is one, and the three header
 * layouts below are the whole format.
 *
 * Throws on a missing or unreadable file, so a typo in a post fails the build
 * instead of shipping a broken image.
 */
export function webpSize(publicPath: string): { width: number; height: number } {
  if (!publicPath.startsWith("/images/") || !publicPath.endsWith(".webp")) {
    throw new Error(`Blog images must be .webp files under /images/: ${publicPath}`);
  }
  const file = join(process.cwd(), "public", publicPath);
  let buf: Buffer;
  try {
    buf = readFileSync(file);
  } catch {
    throw new Error(`Image not found: ${publicPath} (looked for ${file})`);
  }

  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error(`Not a WebP file: ${publicPath}`);
  }
  const chunk = buf.toString("ascii", 12, 16);

  if (chunk === "VP8X") {
    // Extended: 24-bit canvas width-1 and height-1 at offsets 24 and 27.
    return {
      width: 1 + buf.readUIntLE(24, 3),
      height: 1 + buf.readUIntLE(27, 3),
    };
  }
  if (chunk === "VP8 ") {
    // Lossy: 14-bit width and height after the frame tag and start code.
    return {
      width: buf.readUInt16LE(26) & 0x3fff,
      height: buf.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    // Lossless: 14-bit width-1 and height-1 packed after the 0x2f signature.
    const bits = buf.readUInt32LE(21);
    return {
      width: 1 + (bits & 0x3fff),
      height: 1 + ((bits >> 14) & 0x3fff),
    };
  }
  throw new Error(`Unrecognised WebP header (${chunk}) in ${publicPath}`);
}
