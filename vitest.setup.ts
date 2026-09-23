import "@testing-library/jest-dom";
import { JSDOM } from "jsdom";

// Node 26 defines `localStorage` and `sessionStorage` on globalThis itself, and
// both read as `undefined` unless the process was started with
// `--localstorage-file`. Vitest's jsdom environment only copies window keys that
// are *not* already on the global, so jsdom's own Storage silently loses to
// Node's, and every test touching localStorage dies on "Cannot read properties
// of undefined" — 29 of them, across lang-redirect and LanguageSuggestion.
// Install a real pair explicitly, borrowed from a throwaway jsdom window.
// Remove once Vitest's jsdom environment overrides these itself.
const { window: storageWindow } = new JSDOM("", { url: "http://localhost" });

for (const key of ["localStorage", "sessionStorage"] as const) {
  Object.defineProperty(globalThis, key, {
    value: storageWindow[key],
    configurable: true,
    writable: true,
  });
}
