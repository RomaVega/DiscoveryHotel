#!/usr/bin/env node
/**
 * Batch-optimize all images in public/images/ to WebP.
 * - Resizes to max 1920px on longest edge (preserves aspect ratio)
 * - Converts JPG/JPEG/PNG to WebP at quality 80
 * - Skips SVGs and already-optimized WebP files
 * - Creates .webp next to originals, then deletes originals
 * - Prints before/after summary
 *
 * Usage:  node scripts/optimize-images.js [--dry-run]
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const IMG_DIR = path.join(__dirname, "..", "public", "images");
const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 80;
const DRY_RUN = process.argv.includes("--dry-run");

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"]);

function walkDir(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(full));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

async function optimizeImage(filePath) {
  const stat = fs.statSync(filePath);
  const beforeKB = stat.size / 1024;

  const ext = path.extname(filePath);
  const webpPath = filePath.slice(0, -ext.length) + ".webp";

  if (DRY_RUN) {
    return { filePath, beforeKB, afterKB: null, webpPath, skipped: false };
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = image;
    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
      pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    await pipeline
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);

    const afterStat = fs.statSync(webpPath);
    const afterKB = afterStat.size / 1024;

    // Delete original
    fs.unlinkSync(filePath);

    return { filePath, beforeKB, afterKB, webpPath, skipped: false };
  } catch (err) {
    console.error(`  ERROR processing ${filePath}: ${err.message}`);
    return { filePath, beforeKB, afterKB: null, skipped: true };
  }
}

async function main() {
  const files = walkDir(IMG_DIR);
  console.log(`\nFound ${files.length} images to optimize${DRY_RUN ? " (DRY RUN)" : ""}\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let converted = 0;
  let errors = 0;

  for (const file of files) {
    const result = await optimizeImage(file);
    totalBefore += result.beforeKB;

    if (result.skipped) {
      errors++;
      continue;
    }

    if (DRY_RUN) {
      const rel = path.relative(IMG_DIR, file);
      console.log(`  ${rel} (${result.beforeKB.toFixed(0)} KB)`);
      converted++;
      continue;
    }

    totalAfter += result.afterKB;
    converted++;

    const rel = path.relative(IMG_DIR, result.webpPath);
    const savings = ((1 - result.afterKB / result.beforeKB) * 100).toFixed(0);
    console.log(`  ${rel}: ${result.beforeKB.toFixed(0)} KB → ${result.afterKB.toFixed(0)} KB (${savings}% smaller)`);
  }

  console.log(`\n--- Summary ---`);
  console.log(`  Converted: ${converted} files`);
  console.log(`  Errors: ${errors}`);
  if (!DRY_RUN) {
    console.log(`  Before: ${(totalBefore / 1024).toFixed(1)} MB`);
    console.log(`  After:  ${(totalAfter / 1024).toFixed(1)} MB`);
    console.log(`  Saved:  ${((totalBefore - totalAfter) / 1024).toFixed(1)} MB (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);
  }
}

main().catch(console.error);
