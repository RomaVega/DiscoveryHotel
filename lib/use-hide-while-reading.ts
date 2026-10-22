"use client"; // Scroll listener + matchMedia

import { useEffect, useState } from "react";

/** Below this width the floating buttons sit over the text column. */
const NARROW = "(max-width: 1023px)";
/** Ignore smaller movements: finger jitter and iOS rubber-banding. */
const THRESHOLD = 8;
/** Near the top there is nothing to read under the buttons yet. */
const TOP_ZONE = 200;

/**
 * True while the reader is scrolling *down* a long text page on a phone or
 * tablet, so the floating Book Now and WhatsApp buttons can step out of the
 * way of the lines being read; any upward scroll brings them back.
 *
 * Deliberately not "show again after a pause": a pause is when someone is
 * reading, which is exactly when the buttons would cover the text again.
 * Desktop is untouched — from `lg` the buttons sit outside the text column.
 *
 * Opt-in per page (`enabled`), via InnerPageLayout's
 * `hideFloatingWhileScrollingDown`; blog posts use it. Each floating button
 * runs its own copy, with identical inputs, so they always agree.
 */
export function useHideWhileReading(enabled: boolean): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const narrow = window.matchMedia(NARROW);
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      if (Math.abs(dy) < THRESHOLD) return;
      setHidden(narrow.matches && dy > 0 && y > TOP_ZONE);
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return enabled && hidden;
}
