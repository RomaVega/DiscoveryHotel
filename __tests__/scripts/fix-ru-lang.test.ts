import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SCRIPT = path.join(__dirname, "../../scripts/fix-ru-lang.js");

let dir: string;

/** A page shaped like the real export: hreflang links and JSON-LD both say "en". */
function page(lang: string): string {
  return (
    `<!DOCTYPE html><html lang="${lang}" class="__variable_37ef13"><head>` +
    `<link rel="alternate" hrefLang="en" href="https://orlowsky.id/rooms"/>` +
    `<link rel="alternate" hrefLang="ru" href="https://orlowsky.id/ru/rooms"/>` +
    `<script type="application/ld+json">{"inLanguage":"en"}</script>` +
    `</head><body>content</body></html>`
  );
}

function write(rel: string, html: string) {
  const full = path.join(dir, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
}

function read(rel: string): string {
  return fs.readFileSync(path.join(dir, rel), "utf8");
}

function run(): { ok: boolean; output: string } {
  try {
    return { ok: true, output: execFileSync("node", [SCRIPT, dir], { encoding: "utf8" }) };
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string };
    return { ok: false, output: `${err.stdout ?? ""}${err.stderr ?? ""}` };
  }
}

describe("fix-ru-lang", () => {
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "odh-out-"));
    write("index.html", page("en"));
    write("rooms.html", page("en"));
    write("ru.html", page("en"));
    write("ru/rooms.html", page("en"));
    write("ru/experiences/diving.html", page("en"));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("sets lang=ru on the Russian home page and every nested route", () => {
    expect(run().ok).toBe(true);

    expect(read("ru.html")).toContain('<html lang="ru"');
    expect(read("ru/rooms.html")).toContain('<html lang="ru"');
    expect(read("ru/experiences/diving.html")).toContain('<html lang="ru"');
  });

  it("leaves the English pages alone", () => {
    run();

    expect(read("index.html")).toContain('<html lang="en"');
    expect(read("rooms.html")).toContain('<html lang="en"');
  });

  it("touches only the <html> tag, not hreflang links or JSON-LD", () => {
    run();
    const html = read("ru/rooms.html");

    expect(html).toContain('hrefLang="en" href="https://orlowsky.id/rooms"');
    expect(html).toContain('{"inLanguage":"en"}');
  });

  it("is idempotent, so a re-run over a patched export is a no-op", () => {
    run();
    const first = read("ru/rooms.html");

    const second = run();

    expect(second.ok).toBe(true);
    expect(read("ru/rooms.html")).toBe(first);
  });

  it("fails loudly when a page has no lang to replace", () => {
    // Stands in for a Next release that changes the exported markup: silently
    // shipping lang="en" on every Russian page is the outcome to prevent.
    write("ru/rooms.html", '<!DOCTYPE html><html class="x"><head></head><body></body></html>');

    const result = run();

    expect(result.ok).toBe(false);
    expect(result.output).toContain("ru/rooms.html");
  });

  it("fails when the Russian routes are missing entirely", () => {
    fs.rmSync(path.join(dir, "ru"), { recursive: true, force: true });
    fs.rmSync(path.join(dir, "ru.html"), { force: true });

    expect(run().ok).toBe(false);
  });
});
