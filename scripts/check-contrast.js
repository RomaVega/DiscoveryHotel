#!/usr/bin/env node
/**
 * check-contrast.js — catches the WCAG AA text-contrast mistakes that are
 * decidable from the source, and stays quiet about the ones that are not.
 *
 * Contrast is a property of a foreground/background PAIR. A className usually
 * names only the foreground, and nothing in it says which ancestor painted the
 * background — `text-brand-teal` is a bug on sand (2.13:1) and correct on
 * espresso (6.66:1). So this script does not attempt a general audit. It runs
 * two narrow rules:
 *
 *   RULE A — unverified ground.
 *     A banned token used as text, alongside a font-size utility. Icons and
 *     borders carry no font size, so they never trip it.
 *
 *   RULE B — resolvable pair.
 *     One className names BOTH a background and a text colour. That pair is
 *     fully determined, so the ratio is computed and checked outright.
 *
 * Colour values are read from app/globals.css — there are no hex literals here
 * to drift out of sync with the theme.
 *
 * Escape hatch: when a usage is genuinely correct (text on a dark ground),
 * measure it and record the number in a `contrast-ok` comment on the line or
 * the line above.
 */

const fs = require("fs");
const path = require("path");

const ROOTS = ["components", "app"];
const THEME = "app/globals.css";

/** Tokens whose contrast we cannot infer without knowing the ground. */
const BANNED_AS_TEXT = ["brand-teal"];

// ── colour maths (WCAG 2.1 relative luminance) ──────────────────────────────

function luminance(hex) {
  const h = hex.replace("#", "");
  const ch = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// ── theme tokens ────────────────────────────────────────────────────────────

/** Parse `--color-x: #hex` and `--color-x: var(--color-y)` out of the theme. */
function readTokens() {
  const css = fs.readFileSync(THEME, "utf8");
  const raw = {};
  for (const m of css.matchAll(/--color-([\w-]+):\s*([^;]+);/g)) {
    raw[m[1]] = m[2].trim();
  }
  const resolved = {};
  const resolve = (name, seen = new Set()) => {
    if (resolved[name]) return resolved[name];
    const val = raw[name];
    if (!val || seen.has(name)) return null;
    seen.add(name);
    const ref = val.match(/var\(--color-([\w-]+)\)/);
    const out = ref ? resolve(ref[1], seen) : (val.match(/^#[0-9a-fA-F]{6}$/) ? val : null);
    if (out) resolved[name] = out;
    return out;
  };
  for (const name of Object.keys(raw)) resolve(name);
  resolved.white = "#ffffff";
  resolved.black = "#000000";
  return resolved;
}

// ── size classification ─────────────────────────────────────────────────────

const NAMED_PX = {
  xs: 12, sm: 14, base: 16, lg: 18, xl: 20,
  "2xl": 24, "3xl": 30, "4xl": 36, "5xl": 48, "6xl": 60, "7xl": 72,
};

const SIZE_RE = /(?:^|[\s"'`:])text-(xs|sm|base|lg|[2-7]?xl|\[([0-9.]+)(px|rem|em)\])(?:[\s"'`]|$)/g;

/** Largest font size named in the string, in px, or null if none. */
function largestSize(str) {
  let max = null;
  for (const m of str.matchAll(SIZE_RE)) {
    let px;
    if (m[2]) px = m[3] === "px" ? parseFloat(m[2]) : parseFloat(m[2]) * 16;
    else px = NAMED_PX[m[1]];
    if (px != null) max = max == null ? px : Math.max(max, px);
  }
  return max;
}

/** WCAG "large text" is 24px, or 18.66px when bold. */
function threshold(str, px) {
  const bold = /font-(bold|extrabold|black)/.test(str) || /font-semibold/.test(str);
  return px >= 24 || (bold && px >= 18.66) ? 3.0 : 4.5;
}

// ── source scanning ─────────────────────────────────────────────────────────

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(e.name)) out.push(full);
  }
  return out;
}

/**
 * Collapse a className that is spread over several source lines into the one
 * string it becomes at runtime. Two forms matter here:
 *
 *   - `+`-continued concatenation (SecondaryButton keeps its colour and its
 *     font size on different lines of one concatenated constant), and
 *   - a multi-line `cn(...)` / `clsx(...)` / `cva(...)` call, where each
 *     argument is its own line (PrimaryButton names `bg-brand-teal` in one
 *     argument and `text-sm` in the next).
 *
 * Judging those line by line would miss exactly the pairs worth catching.
 */
function logicalLines(lines) {
  const out = [];
  let buf = null;
  let depth = 0;

  const netParens = (s) => (s.match(/\(/g) || []).length - (s.match(/\)/g) || []).length;

  lines.forEach((line, i) => {
    if (buf) buf.text += " " + line.trim();
    else buf = { start: i + 1, text: line.trim() };

    if (depth > 0) depth += netParens(line);
    else if (/\b(?:cn|clsx|cva|twMerge)\s*\(/.test(line)) depth = netParens(line);

    const continues = /\+\s*$/.test(line) || depth > 0;
    if (!continues) {
      out.push(buf);
      buf = null;
      depth = 0;
    }
  });
  if (buf) out.push(buf);
  return out;
}

const tokens = readTokens();
const tokenNames = Object.keys(tokens).sort((a, b) => b.length - a.length);
const tokenAlt = tokenNames.join("|");
// Unprefixed only: a `hover:`/`md:` variant does not necessarily co-occur with
// the base colour it would pair against, and guessing would produce noise.
const BG_RE = new RegExp(`(?:^|[\\s"'\`])bg-(${tokenAlt})(?![\\w-])`);
const TEXT_RE = new RegExp(`(?:^|[\\s"'\`])text-(${tokenAlt})(?![\\w-/])`);
const BANNED_RE = new RegExp(`(?:^|[\\s"'\`:])text-(${BANNED_AS_TEXT.join("|")})(?![\\w-])`);

const violations = [];

for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const lines = fs.readFileSync(file, "utf8").split("\n");
    for (const { start, text } of logicalLines(lines)) {
      // A pragma may sit a few lines up: the justification is usually a
      // multi-line comment, so only its last line abuts the code.
      const above = lines.slice(Math.max(0, start - 5), start - 1).join("\n");
      if (/contrast-ok/.test(text) || /contrast-ok/.test(above)) continue;

      const px = largestSize(text);
      if (px == null) continue; // no text here — icon, border or fill

      const bg = text.match(BG_RE);
      const fg = text.match(TEXT_RE);
      const need = threshold(text, px);

      // RULE B — both ends named, so the pair is decidable.
      if (bg && fg) {
        const got = ratio(tokens[fg[1]], tokens[bg[1]]);
        if (got < need) {
          violations.push({
            file, line: start, rule: "B",
            detail: `text-${fg[1]} on bg-${bg[1]} is ${got.toFixed(2)}:1, needs ${need}:1 at ${px}px`,
            text,
          });
        }
        continue;
      }

      // RULE A — a banned token as text, ground unknown.
      if (BANNED_RE.test(text)) {
        violations.push({
          file, line: start, rule: "A",
          detail: `text-brand-teal at ${px}px on an unverified ground (2.13:1 on sand, 2.27:1 on ivory, 1.88:1 on parchment)`,
          text,
        });
      }
    }
  }
}

if (violations.length === 0) {
  console.log("✅ Contrast guard: no unverified or failing text colours.");
  process.exit(0);
}

console.error(`\n❌ Found ${violations.length} contrast problem(s):\n`);
for (const v of violations) {
  console.error(`  [${v.rule}] ${v.file}:${v.line}`);
  console.error(`      ${v.detail}`);
  console.error(`      ${v.text.length > 92 ? v.text.slice(0, 92) + "…" : v.text}`);
}
console.error(`
Use text-accent-text for teal text on light grounds (4.74–5.73:1).

If a usage is correct as-is — text on a dark ground, where brand-teal reaches
6.66:1 on espresso — measure it and record the number in a "contrast-ok"
comment on the line or the line above.
`);
process.exit(1);
