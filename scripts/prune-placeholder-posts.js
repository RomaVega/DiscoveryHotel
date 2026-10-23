#!/usr/bin/env node
// Deletes the placeholder post pages a build makes when a locale has no posts
// to publish (NO_POSTS_SLUG in lib/blog.ts). Static export refuses a dynamic
// route with no params, so production builds one stand-in page while every
// post is a draft; this removes it so the URL never goes live.
// Runs first in `postbuild`: fix-ru-lang.js would otherwise fail on the RU
// stand-in, which is an error page with no lang="en" to replace.
const fs = require("fs");
const path = require("path");

const SLUG = "_none";
const outDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, "../out");

let removed = 0;
for (const dir of ["blog", "ru/blog"]) {
  for (const ext of [".html", ".txt"]) {
    const file = path.join(outDir, dir, SLUG + ext);
    if (fs.existsSync(file)) {
      fs.rmSync(file);
      removed++;
    }
  }
  const asDir = path.join(outDir, dir, SLUG);
  if (fs.existsSync(asDir)) {
    fs.rmSync(asDir, { recursive: true });
    removed++;
  }
}
if (removed > 0) console.log(`✅ Removed ${removed} placeholder blog file(s) — no published posts in at least one language.`);
