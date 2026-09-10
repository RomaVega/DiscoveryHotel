import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Every public route is duplicated under `app/ru/`, so a component added to one
 * copy and not the other silently ships a page that is missing it in one
 * language. That is not hypothetical: `BookingBar` was added to `app/page.tsx`
 * and not `app/ru/page.tsx`, and the persistent Book Now button was absent from
 * the whole Russian home page until someone scrolled it and noticed.
 *
 * Pages built on `InnerPageLayout` cannot drift — they share the layout — so
 * this checks the ones that compose the chrome themselves.
 */
const APP = join(process.cwd(), "app");

/** Layout-level components a page composes directly rather than via InnerPageLayout. */
const CHROME = ["Navbar", "Footer", "WhatsAppButton", "BookingBar"];

function enPageDirs(): string[] {
  const out: string[] = [];
  const walk = (dir: string, rel: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (rel === "" && entry.name === "ru") continue; // the mirror itself
      const next = join(dir, entry.name);
      const nextRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (existsSync(join(next, "page.tsx"))) out.push(nextRel);
      walk(next, nextRel);
    }
  };
  if (existsSync(join(APP, "page.tsx"))) out.push("");
  walk(APP, "");
  return out;
}

const usesInnerPageLayout = (src: string) => src.includes("InnerPageLayout");
const chromeIn = (src: string) => CHROME.filter((c) => new RegExp(`<${c}[\\s/>]`).test(src));

describe("EN/RU route parity", () => {
  const routes = enPageDirs();

  it("finds the routes to compare", () => {
    expect(routes.length).toBeGreaterThan(5);
  });

  it.each(routes)("/%s has a Russian mirror", (route) => {
    const ru = join(APP, "ru", route, "page.tsx");
    expect(existsSync(ru), `missing app/ru/${route}/page.tsx`).toBe(true);
  });

  it.each(routes)("/%s composes the same chrome as its Russian mirror", (route) => {
    const en = readFileSync(join(APP, route, "page.tsx"), "utf8");
    const ruPath = join(APP, "ru", route, "page.tsx");
    if (!existsSync(ruPath)) return; // reported by the test above
    const ru = readFileSync(ruPath, "utf8");

    // A page on InnerPageLayout inherits the chrome, so there is nothing to drift.
    if (usesInnerPageLayout(en) && usesInnerPageLayout(ru)) return;

    expect(chromeIn(ru).sort(), `app/ru/${route}/page.tsx composes different chrome`)
      .toEqual(chromeIn(en).sort());
  });
});
