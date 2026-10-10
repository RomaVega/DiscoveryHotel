"use client"; // Uses IntersectionObserver

import { useState, useEffect } from "react";

/**
 * Put this attribute on the wrapper of a section's own booking button. While
 * any marked element is on screen, the floating mobile Book Now button steps
 * aside — the page's own CTA is already in reach, and the floating pill would
 * otherwise sit directly on top of it.
 *
 * Give it the value `"and-below"` to keep the button hidden after the element
 * scrolls off the top as well — used on the footer's "Book a stay" link, so
 * the pill does not flash back between that link and the legal bar.
 */
export const HIDES_BOOKING_BAR = "data-hides-booking-bar";

/**
 * True while any element marked with `HIDES_BOOKING_BAR` is in the viewport.
 *
 * Watching the button rather than the whole band: the home band now carries
 * the six book-direct perks above its button, and hiding the floating CTA for
 * the whole band would take it away while the guest is still reading the
 * reasons to book. It goes the moment the band's own button arrives, which is
 * exactly when the two would overlap.
 *
 * `key` re-collects the targets on a client-side route change.
 */
export function useOwnCtaInView(key: string): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll(`[${HIDES_BOOKING_BAR}]`);
    if (targets.length === 0) return;

    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const scrolledPast =
          entry.target.getAttribute(HIDES_BOOKING_BAR) === "and-below" &&
          entry.boundingClientRect.bottom < 0;
        if (entry.isIntersecting || scrolledPast) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setInView(visible.size > 0);
    });
    targets.forEach((target) => io.observe(target));
    return () => {
      io.disconnect();
      setInView(false);
    };
  }, [key]);

  return inView;
}
