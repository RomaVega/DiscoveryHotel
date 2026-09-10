"use client"; // Uses IntersectionObserver

import { useState, useEffect } from "react";

/**
 * True once the footer's legal bar has come into view.
 *
 * The floating Book Now and WhatsApp buttons both sit in the bottom-right
 * corner region, which is exactly where the privacy and terms links end up at
 * the end of the page — so both buttons watch this and step aside together.
 * Sharing one hook rather than duplicating a scroll listener in each keeps
 * them from disagreeing about when the bottom has been reached and flickering
 * against each other.
 *
 * Watching the legal bar itself rather than comparing scrollY against
 * scrollHeight: the page height changes as images below the fold settle, and a
 * measured threshold drifts with it, while the element is where it is.
 */
export function useAtPageBottom(): boolean {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const target = document.querySelector("#footer-legal");
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => setAtBottom(entry.isIntersecting),
      // A little early, so the buttons are gone by the time the links are
      // readable rather than uncovering them only once they are fully past.
      { rootMargin: "0px 0px 32px 0px" }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return atBottom;
}
