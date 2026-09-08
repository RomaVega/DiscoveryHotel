#!/usr/bin/env node
// Fails the build if an exported page's <title> repeats the hotel's name.
//
// The metadata `title` field accepts a { default, template } pair, and a
// template of `%s | <site name>` silently appends the brand to every page that
// sets a title of its own. Since this project's convention is that each page
// writes a complete title with the brand already placed in it (see the
// canonical page pattern in CLAUDE.md), that produced "… — Orlowsky Discovery
// Hotel | Orlowsky Discovery Hotel" on 37 of 39 pages, unnoticed until someone
// read a browser tab. The failure is invisible in the source — the doubling
// only exists in the rendered output — so the guard has to run over out/.
const fs = require("fs");
const path = require("path");

const SITE_NAME = "Orlowsky Discovery Hotel";
// Match on the distinctive first word rather than the whole name: several pages
// use the short "Orlowsky Discovery" form, so counting the full string would
// miss "… | Orlowsky Discovery | Orlowsky Discovery Hotel" — a doubling too.
const BRAND_WORD = SITE_NAME.split(" ")[0];
const outDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, "../out");

function htmlFiles(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "_next") htmlFiles(full, found);
    } else if (entry.name.endsWith(".html")) {
      found.push(full);
    }
  }
  return found;
}

if (!fs.existsSync(outDir)) {
  console.error("❌ out/ not found — run `npm run build` first.");
  process.exit(1);
}

/** Count non-overlapping occurrences of the brand word, case-insensitively. */
function brandCount(title) {
  return title.toLowerCase().split(BRAND_WORD.toLowerCase()).length - 1;
}

const problems = [];
let checked = 0;

for (const file of htmlFiles(outDir)) {
  const html = fs.readFileSync(file, "utf8");
  const match = /<title>([^<]*)<\/title>/i.exec(html);
  const rel = path.relative(outDir, file);

  // Next's built-in 404 has no metadata of ours; nothing to assert about it.
  if (!match) continue;
  checked++;

  const title = match[1];
  if (brandCount(title) > 1) {
    problems.push(`  [${rel}] "${BRAND_WORD}" appears ${brandCount(title)}×: ${title}`);
  }
}

if (problems.length > 0) {
  console.error(`\n❌ ${problems.length} page title(s) repeat the hotel's name:\n`);
  problems.forEach((p) => console.error(p));
  console.error("\nEach page writes its own complete title — check for a `template` in app/layout.tsx.\n");
  process.exit(1);
}

console.log(`✅ Title guard: ${checked} page titles, no repeated brand name.`);
