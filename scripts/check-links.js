#!/usr/bin/env node
// Validates every <a href>, <link href>, <area href>, and <iframe src> in the
// built out/ directory:
//   - internal page link  → must resolve to an HTML file in out/
//   - internal asset link → must exist in out/
//   - WhatsApp link       → number must match NEXT_PUBLIC_WHATSAPP_NUMBER and
//                           ?text= pre-message must be non-empty
//   - external link       → only HTTP-checked when run with --external
//
// Exits 1 on any error. Run after `npm run build`.

const fs = require("fs");
const path = require("path");

const args = new Set(process.argv.slice(2));
const CHECK_EXTERNAL = args.has("--external");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "out");

if (!fs.existsSync(outDir)) {
  console.error("❌ out/ doesn't exist — run `npm run build` first.");
  process.exit(1);
}

function readEnvFile(file) {
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*["']?([^"'#\n]*?)["']?\s*$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

const env = { ...readEnvFile(path.join(root, ".env")), ...readEnvFile(path.join(root, ".env.local")), ...process.env };
const expectedWaNumber = env.NEXT_PUBLIC_WHATSAPP_NUMBER || null;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

const htmlFiles = walk(outDir);

const LINK_RE = /<(?:a|link|area|iframe)\b[^>]*?\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;

const NAMED_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeHtmlEntities(s) {
  return s.replace(/&(?:#x([0-9a-f]+)|#(\d+)|([a-z]+));/gi, (_, hex, dec, name) => {
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    if (dec) return String.fromCodePoint(parseInt(dec, 10));
    return NAMED_ENTITIES[name.toLowerCase()] ?? _;
  });
}

function extractLinks(html) {
  const links = [];
  let m;
  while ((m = LINK_RE.exec(html)) !== null) links.push(decodeHtmlEntities(m[1]));
  return links;
}

function htmlToRoute(htmlAbs) {
  const rel = path.relative(outDir, htmlAbs).replace(/\\/g, "/");
  return "/" + rel.replace(/\.html$/, "").replace(/\/index$/, "");
}

const errors = [];
const warnings = [];
// link → first source route where it appeared
const links = new Map();

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, "utf8");
  const route = htmlToRoute(htmlFile);
  for (const link of extractLinks(html)) {
    if (!links.has(link)) links.set(link, route);
  }
}

function checkInternalPath(link) {
  const [clean] = link.split(/[?#]/);
  if (!clean || clean === "/") return fs.existsSync(path.join(outDir, "index.html"));
  const cleanRel = clean.replace(/^\/+/, "");
  const direct = path.join(outDir, cleanRel);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return true;
  if (fs.existsSync(path.join(outDir, cleanRel + ".html"))) return true;
  if (fs.existsSync(path.join(outDir, cleanRel, "index.html"))) return true;
  return false;
}

function checkWhatsApp(link, source) {
  let url;
  try { url = new URL(link); }
  catch { errors.push(`  [${source}] Malformed WhatsApp URL: ${link}`); return; }

  const number = url.pathname.replace(/^\/+/, "");
  if (!/^\d{8,16}$/.test(number)) {
    errors.push(`  [${source}] WhatsApp link has invalid number "${number}": ${link}`);
    return;
  }
  if (expectedWaNumber && number !== expectedWaNumber) {
    errors.push(`  [${source}] WhatsApp number mismatch — expected ${expectedWaNumber}, got ${number}`);
    return;
  }
  const text = url.searchParams.get("text");
  if (!text || !text.trim()) {
    errors.push(`  [${source}] WhatsApp link missing pre-message (?text=): ${link}`);
    return;
  }
  if (text.trim().length < 10) {
    warnings.push(`  [${source}] WhatsApp pre-message suspiciously short (${text.length} chars): "${text}"`);
  }
}

const externalLinks = [];
let internal = 0, whatsapp = 0, external = 0;

for (const [link, source] of links) {
  if (!link) continue;
  if (link.startsWith("#") || link.startsWith("mailto:") || link.startsWith("tel:") || link.startsWith("javascript:") || link.startsWith("data:")) continue;

  if (/^https?:\/\/(?:www\.|api\.)?wa(?:tsapp)?\.(?:me|com)/i.test(link) || /wa\.me/i.test(link)) {
    whatsapp++;
    checkWhatsApp(link, source);
    continue;
  }
  if (/^https?:\/\//i.test(link)) {
    external++;
    externalLinks.push({ link, source });
    continue;
  }
  if (link.startsWith("/")) {
    internal++;
    if (!checkInternalPath(link)) errors.push(`  [${source}] Broken internal link: ${link}`);
    continue;
  }
  // Anything else (relative path, oddly shaped) — flag for inspection
  warnings.push(`  [${source}] Unclassified link: ${link}`);
}

async function checkExternalLinks() {
  if (!CHECK_EXTERNAL || externalLinks.length === 0) return;
  console.log(`\nChecking ${externalLinks.length} unique external link(s) over HTTP...`);
  const CONCURRENCY = 8;
  const TIMEOUT_MS = 10000;
  let i = 0;
  async function worker() {
    while (i < externalLinks.length) {
      const { link, source } = externalLinks[i++];
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
        let res;
        try {
          res = await fetch(link, { method: "HEAD", signal: ctrl.signal, redirect: "follow" });
          if (res.status === 405 || res.status === 403) {
            res = await fetch(link, { method: "GET", signal: ctrl.signal, redirect: "follow" });
          }
        } finally { clearTimeout(timer); }
        if (res.status >= 400) errors.push(`  [${source}] External link returned ${res.status}: ${link}`);
      } catch (e) {
        errors.push(`  [${source}] External link unreachable (${e.code || e.name || e.message}): ${link}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}

(async () => {
  await checkExternalLinks();

  console.log(`\nChecked ${links.size} unique link(s) across ${htmlFiles.length} HTML file(s).`);
  console.log(`  internal: ${internal}, whatsapp: ${whatsapp}, external: ${external}${CHECK_EXTERNAL ? " (HTTP-checked)" : " (skipped — pass --external to check)"}`);
  if (expectedWaNumber) console.log(`  WhatsApp number expected: ${expectedWaNumber}`);

  if (warnings.length > 0) {
    console.warn(`\n⚠️  ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.warn(w));
  }

  if (errors.length > 0) {
    console.error(`\n❌ Found ${errors.length} broken link(s):\n`);
    errors.forEach((e) => console.error(e));
    process.exit(1);
  } else {
    console.log(`\n✅ All links are valid.`);
  }
})();
