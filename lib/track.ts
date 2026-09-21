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
 * The channel and its guard rails are `report-error.ts`'s, for the same
 * reasons: `output: "export"` leaves no backend to POST to, `connect-src` in
 * netlify.toml already allows google-analytics.com, and this never *creates*
 * `dataLayer` — on a build with no tag (dev, deploy previews) an orphan queue
 * would grow unbounded and nothing would ever drain it.
 *
 * NOTE: `cta_location` and `cta_destination` are custom parameters. GA4 starts
 * collecting them on the first hit but shows them in reports only once each is
 * registered under Admin → Custom definitions. On a GTM-only build the event
 * also needs a Custom Event trigger named `book_now_click` in the container,
 * wired to a GA4 event tag — the push alone reaches the dataLayer, not GA4.
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
  | "hero";

/** Where it sent them. Classified rather than logged raw: a WhatsApp href
    carries a URL-encoded sentence, which blows past GA4's 100-character
    parameter limit and lands in reports as a few hundred unique values. */
export type CtaDestination = "engine" | "menu" | "whatsapp" | "other";

/** GA4 truncates event parameter values at 100 characters. */
const GA4_PARAM_MAX = 100;

type Gtag = (
  command: "event",
  name: string,
  params: Record<string, unknown>
) => void;

type TaggedWindow = Window & {
  gtag?: Gtag;
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
    const hasGtag = typeof w.gtag === "function";
    const hasDataLayer = Array.isArray(w.dataLayer);
    if (!hasGtag && !hasDataLayer) return; // no tag on this build — stay silent

    const payload: Record<string, unknown> = {
      ...params,
      page_path: clip(window.location.pathname),
      page_locale: clip(document.documentElement.lang),
    };

    if (hasGtag) {
      w.gtag?.("event", name, payload);
    } else {
      // GTM-only build: surfaces as a Custom Event trigger of the same name.
      w.dataLayer?.push({ event: name, ...payload });
    }
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
