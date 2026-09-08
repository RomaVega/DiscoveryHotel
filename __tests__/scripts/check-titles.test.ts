import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SCRIPT = path.join(__dirname, "../../scripts/check-titles.js");

let dir: string;

function write(rel: string, title: string) {
  const full = path.join(dir, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, `<!DOCTYPE html><html><head><title>${title}</title></head><body></body></html>`);
}

function run(): { ok: boolean; output: string } {
  try {
    return { ok: true, output: execFileSync("node", [SCRIPT, dir], { encoding: "utf8" }) };
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string };
    return { ok: false, output: `${err.stdout ?? ""}${err.stderr ?? ""}` };
  }
}

describe("check-titles", () => {
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "odh-titles-"));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("passes titles that name the hotel once", () => {
    write("index.html", "Orlowsky Discovery Hotel | Candidasa, Bali");
    write("rooms.html", "Rooms &amp; Villas in Candidasa, Bali — Orlowsky Discovery Hotel");

    expect(run().ok).toBe(true);
  });

  it("catches the doubling a title template produces", () => {
    write("rooms.html", "Rooms — Orlowsky Discovery Hotel | Orlowsky Discovery Hotel");

    const result = run();

    expect(result.ok).toBe(false);
    expect(result.output).toContain("rooms.html");
  });

  it("catches the short-form doubling the full name would miss", () => {
    // "| Orlowsky Discovery | Orlowsky Discovery Hotel" contains the full site
    // name only once, which is why the guard counts the brand word instead.
    write("spa.html", "Ayurvedic Spa — Bali | Orlowsky Discovery | Orlowsky Discovery Hotel");

    expect(run().ok).toBe(false);
  });

  it("accepts a title that does not name the hotel at all", () => {
    // Not this guard's business — it only rejects repetition.
    write("diving.html", "Diving &amp; Snorkeling East Bali");

    expect(run().ok).toBe(true);
  });

  it("checks Russian pages in nested directories too", () => {
    write("ru/rooms.html", "Номера — Orlowsky Discovery Hotel | Orlowsky Discovery Hotel");

    const result = run();

    expect(result.ok).toBe(false);
    expect(result.output).toContain("ru/rooms.html");
  });

  it("ignores the _next asset directory", () => {
    write("_next/static/chunk.html", "Orlowsky Orlowsky");

    expect(run().ok).toBe(true);
  });
});
