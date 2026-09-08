#!/usr/bin/env node
// Stamps lang="ru" onto the <html> tag of every exported Russian page.
//
// `output: "export"` means the root layout owns <html> for all 38 routes, so
// Next bakes lang="en" into the Russian pages too. That matters beyond tidiness:
// Edge and Chrome weigh the lang attribute when deciding whether to offer to
// translate, and a Russian page claiming to be English is asking for the offer
// that breaks React (see lib/lang-redirect.ts). Screen readers pick the wrong
// voice from it, and Google reads it as a language signal.
//
// Runs as the `postbuild` npm script, after `next build` has written out/.
// Client-side navigation between locales is handled separately, by the effect
// in lib/language-context.tsx — this only fixes the served HTML.
const fs = require("fs");
const path = require("path");

// Defaults to out/; an explicit path is what the tests point at a fixture.
const outDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, "../out");

/** Collect out/ru.html plus everything under out/ru/. */
function ruPages(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) ruPages(full, found);
    else if (entry.name.endsWith(".html")) found.push(full);
  }
  return found;
}

if (!fs.existsSync(outDir)) {
  console.error("❌ out/ not found — run `npm run build` first.");
  process.exit(1);
}

const pages = [];
const ruHome = path.join(outDir, "ru.html");
if (fs.existsSync(ruHome)) pages.push(ruHome);
const ruDir = path.join(outDir, "ru");
if (fs.existsSync(ruDir)) pages.push(...ruPages(ruDir));

if (pages.length === 0) {
  console.error("❌ No Russian pages found in out/ — did the /ru routes stop building?");
  process.exit(1);
}

// Only the opening <html> tag, never the hreflang links or JSON-LD further down,
// both of which legitimately contain "en".
const HTML_TAG = /<html\b[^>]*>/i;

const failures = [];
let patched = 0;

for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const tag = HTML_TAG.exec(html);
  const rel = path.relative(outDir, file);

  if (!tag) {
    failures.push(`  [${rel}] no <html> tag found`);
    continue;
  }
  if (/\blang="ru"/i.test(tag[0])) {
    patched++; // already correct — nothing to do
    continue;
  }
  if (!/\blang="en"/i.test(tag[0])) {
    failures.push(`  [${rel}] <html> tag has no lang="en" to replace: ${tag[0].slice(0, 80)}`);
    continue;
  }

  const fixed = html.replace(HTML_TAG, (m) => m.replace(/\blang="en"/i, 'lang="ru"'));
  fs.writeFileSync(file, fixed);
  patched++;
}

if (failures.length > 0) {
  // Loud rather than silent: this runs unattended in CI, and a Next release that
  // changes the exported markup must not quietly ship lang="en" on every RU page.
  console.error(`\n❌ Could not set lang="ru" on ${failures.length} page(s):\n`);
  failures.forEach((f) => console.error(f));
  process.exit(1);
}

console.log(`✅ lang="ru" set on ${patched} Russian page(s).`);
