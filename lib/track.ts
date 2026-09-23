/**
 * CTA click tracking.
 *
 * The site already loads a tag on every page — GTM's container, and GA4's
 * gtag.js when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set — but nothing was ever
 * *sent* to it beyond automatic page views and the boundary crash reports. A
 * tag that loads is not a tag that measures: until this existed, the floating
 * Book Now button could be tapped all day and the property would show only the
 * page view it happened on.
 *
 * The guard rails are `report-error.ts`'s, for the same reasons: `output:
 * "export"` leaves no backend to POST to, `connect-src` in netlify.toml already
 * allows google-analytics.com, and this never *creates* `dataLayer` — on a
 * build with no container (dev, deploy previews) an orphan queue would grow
 * unbounded and nothing would ever drain it.
 *
 * **Always `dataLayer`, never `gtag`.** An earlier version preferred
 * `window.gtag` when it existed. That is a trap here: our container holds a
 * Google tag, and GTM loads gtag.js on its behalf, so `window.gtag` *does*
 * exist in production. Calling it pushes a gtag-style `arguments` object that
 * a GTM Custom Event trigger does not match — the event would reach GA4 while
 * every GTM trigger keyed on its name stayed silent, taking the Google Ads
 * conversion tag with it. Pushing `{event: name, ...}` is the only form GTM
 * triggers match, and it is deterministic rather than dependent on whether
 * gtag.js happens to have loaded yet.
 *
 * NOTE: the event reaches the container, not GA4. It needs a Custom Event
 * trigger of the same name wired to a GA4 event tag. `cta_location` and
 * `cta_destination` are custom parameters — GA4 collects them from the first
 * hit but shows them in reports only once registered under Admin → Custom
 * definitions.
 */

import { BOOKING_URL, MENU_URL } from "@/lib/booking";

/** Which surface the CTA was tapped on. */
export type CtaLocation =
  /** The persistent button pinned to the bottom of the viewport on mobile. */
  | "floating"
  /** The desktop navbar's pill. */
  | "navbar"
  /** The mobile menu drawer. */
  | "drawer"
  /** The home page hero's ghost button. */
  | "hero"
  /**
   * A per-offer CTA in `SpecialOffers` (home section and `/offers`).
   *
   * These do not render `BookNowButton` and push no `book_now_click` — they
   * are plain links, and the only thing that sees them is GTM's Link Click
   * trigger. They are in this union because the container reads one attribute
   * for every surface, so the vocabulary cannot be allowed two homes.
   */
  | "offer_card";

/** Where it sent them. Classified rather than logged raw: a WhatsApp href
    carries a URL-encoded sentence, which blows past GA4's 100-character
    parameter limit and lands in reports as a few hundred unique values. */
export type CtaDestination = "engine" | "menu" | "whatsapp" | "other";

/** GA4 truncates event parameter values at 100 characters. */
const GA4_PARAM_MAX = 100;

type TaggedWindow = Window & {
  dataLayer?: unknown[];
};

function clip(value: unknown): string {
  return typeof value === "string" ? value.slice(0, GA4_PARAM_MAX) : "";
}

/**
 * Bucket a CTA href into a low-cardinality destination.
 *
 * MENU_URL is tested before BOOKING_URL because it is a path *under* it —
 * `.../odch/concierge/room-dining` starts with `.../odch`, so the engine test
 * first would swallow every dining tap.
 */
export function classifyDestination(href: string): CtaDestination {
  if (href.startsWith(MENU_URL)) return "menu";
  if (href.startsWith(BOOKING_URL)) return "engine";
  if (href.startsWith("https://wa.me/")) return "whatsapp";
  return "other";
}

/**
 * Send an event to whichever tag this build carries.
 *
 * Silent and total: a click handler that throws would take the navigation with
 * it, and no measurement is worth a CTA that does not open.
 *
 * @param name   GA4 event name (snake_case, ≤40 chars).
 * @param params Event parameters. `page_path` and `page_locale` are added here
 *               so no call site has to remember them.
 */
export function trackEvent(
  name: string,
  params: Record<string, unknown> = {}
): void {
  try {
    if (typeof window === "undefined") return;

    const w = window as TaggedWindow;
    if (!Array.isArray(w.dataLayer)) return; // no container on this build — stay silent

    w.dataLayer.push({
      event: name,
      ...params,
      page_path: clip(window.location.pathname),
      page_locale: clip(document.documentElement.lang),
    });
  } catch {
    /* analytics must never break the thing it measures */
  }
}

/**
 * The booking CTA was clicked.
 *
 * One event name across all four surfaces, separated by `cta_location`, rather
 * than four event names: GA4 reports compare parameter values within an event
 * far more easily than they compare events, and "which surface books" is the
 * question this was added to answer.
 */
export function trackBookNowClick(
  location: CtaLocation,
  href: string
): void {
  trackEvent("book_now_click", {
    cta_location: location,
    cta_destination: classifyDestination(href),
  });
}
