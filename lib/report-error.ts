/**
 * Crash reporting for the two error boundaries (app/error.tsx, app/global-error.tsx).
 *
 * Dependency-free and wrapped in try/catch throughout, for the same reason
 * ErrorFallback avoids next/image and framer-motion: this code runs only once
 * something has already gone wrong, and a reporter that throws turns a caught
 * error into a blank page.
 *
 * The channel is the GA4 / GTM tag that app/layout.tsx already mounts —
 * `output: "export"` leaves no backend to POST to, and `connect-src` in
 * netlify.toml already allows google-analytics.com, so no CSP change is needed.
 * Nothing is sent when neither tag is present (dev, deploy previews): this
 * never *creates* `dataLayer`, because an orphan queue would grow unbounded.
 *
 * NOTE: `translator`, `browser_lang`, `page_locale` and `error_digest` are
 * custom parameters. GA4 collects them immediately but only shows them in
 * reports once each is registered under Admin → Custom definitions.
 */

/** Which page translator, if any, had rewritten the DOM when we crashed. */
export type TranslatorKind = "none" | "edge" | "google" | "unknown";

/** GA4 truncates event parameter values at 100 characters. */
const GA4_PARAM_MAX = 100;

/** A crash loop must not flood the property with identical hits. */
const MAX_REPORTS = 3;

let reportCount = 0;

type Gtag = (
  command: "event",
  name: string,
  params: Record<string, unknown>
) => void;

type TaggedWindow = Window & {
  gtag?: Gtag;
  dataLayer?: unknown[];
};

/**
 * Detect a page translator by the traces it leaves in the DOM.
 *
 * Both major translators replace our text nodes with their own elements, which
 * is what breaks React's reconciler — it still holds references to the nodes
 * that were swapped out, so the next removeChild/insertBefore throws. Knowing
 * whether one was active at crash time is the difference between guessing at
 * that cause and measuring it.
 */
export function detectTranslator(): TranslatorKind {
  try {
    // Microsoft Translator (Edge's built-in) stamps each element it rewrites.
    if (document.querySelector("[_msttexthash]")) return "edge";

    // Google Translate flags the root element and wraps text in <font>.
    if (/(^|\s)translated-(ltr|rtl)(\s|$)/.test(document.documentElement.className)) {
      return "google";
    }

    // Some other translator or extension has reparented our text nodes: the
    // site itself never renders <font>, so any occurrence is foreign.
    if (document.getElementsByTagName("font").length > 0) return "unknown";
  } catch {
    /* fall through — an undetectable translator is still worth a report */
  }

  return "none";
}

function clip(value: unknown): string {
  return typeof value === "string" ? value.slice(0, GA4_PARAM_MAX) : "";
}

/**
 * Report a caught boundary error.
 *
 * @param error  The error handed to the boundary, including Next's `digest`.
 * @param fatal  True from global-error.tsx (the root layout itself failed),
 *               false from error.tsx (the layout survived). Maps to GA4's
 *               reserved `fatal` parameter on the `exception` event.
 */
export function reportBoundaryError(
  error: (Error & { digest?: string }) | undefined,
  fatal: boolean
): void {
  try {
    if (reportCount >= MAX_REPORTS) return;
    if (typeof window === "undefined") return;

    const w = window as TaggedWindow;
    const hasGtag = typeof w.gtag === "function";
    const hasDataLayer = Array.isArray(w.dataLayer);
    if (!hasGtag && !hasDataLayer) return; // no tag on this build — stay silent

    reportCount += 1;

    const params: Record<string, unknown> = {
      description: clip(error?.message) || "unknown",
      fatal,
      error_name: clip(error?.name),
      error_digest: clip(error?.digest),
      translator: detectTranslator(),
      browser_lang: clip(navigator.language),
      page_locale: clip(document.documentElement.lang),
      page_path: clip(window.location.pathname),
    };

    if (hasGtag) {
      // GA4's recommended event for this; gtag routes it straight to the property.
      w.gtag?.("event", "exception", params);
    } else {
      // GTM-only build: surfaces as a Custom Event trigger named boundary_error.
      w.dataLayer?.push({ event: "boundary_error", ...params });
    }
  } catch {
    /* a failed report must never mask the error it describes */
  }
}

/** Test seam — resets the crash-loop guard between cases. */
export function resetReportCountForTests(): void {
  reportCount = 0;
}
