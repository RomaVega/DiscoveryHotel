"use client"; // Warms the home page's first below-the-fold images after load (idle, low priority)

import { useEffect } from "react";

// The first images below the hero on the home page. Warmed at idle after load so the very
// next thing a visitor scrolls to is already decoded — without competing with the hero/LCP.
const PRIORITY = [
  "/images/welcome/welcome-garden-path-ocean-candidasa.webp",
  "/images/rooms/pool-villa.webp",
  "/images/rooms/deluxe-cottage.webp",
  "/images/restaurant-bar/orlowsky-hotel-oceanfront-dining-candidasa.webp",
  "/images/experiences/experiences-ayurvedic-spa.webp",
  "/images/experiences/experiences-diving.webp",
  "/images/offers/early-bird.webp",
];

function prefetchImages(urls: readonly string[]) {
  for (const url of urls) {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  }
}

function scheduleIdle(fn: () => void, delay: number) {
  setTimeout(() => {
    if ("requestIdleCallback" in window) requestIdleCallback(fn);
    else fn();
  }, delay);
}

function shouldPreload(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") return false;
  return true;
}

export function SitePreloader() {
  useEffect(() => {
    if (!shouldPreload()) return;

    // Warm just the home page's first below-the-fold images, well after load so they never
    // contend with the hero/LCP. Route payloads are intentionally left to Next's <Link>,
    // which prefetches on hover/viewport in prod — a blanket prefetch of all 43 routes plus
    // every image on the site was saturating mobile connections for little real benefit.
    scheduleIdle(() => prefetchImages(PRIORITY), 2500);
  }, []);

  return null;
}
