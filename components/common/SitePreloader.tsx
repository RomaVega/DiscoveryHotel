"use client"; // Background-prefetches every image and route so navigation is instant

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ALL_IMAGES, ALL_ROUTES } from "@/lib/image-manifest";

// Above-the-fold images on the home page — loaded first so the landing view is ready fast.
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
  const router = useRouter();

  useEffect(() => {
    if (!shouldPreload()) return;

    // 1. Priority home images first.
    scheduleIdle(() => prefetchImages(PRIORITY), 1500);

    // 2. All route payloads (page JS/RSC) so navigating anywhere is instant.
    scheduleIdle(() => {
      for (const route of ALL_ROUTES) router.prefetch(route);
    }, 4000);

    // 3. Every remaining image across the whole site.
    const rest = ALL_IMAGES.filter((u) => !PRIORITY.includes(u));
    scheduleIdle(() => prefetchImages(rest), 8000);
  }, [router]);

  return null;
}
