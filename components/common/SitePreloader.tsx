"use client"; // Uses useEffect + requestIdleCallback for background prefetching

import { useEffect } from "react";

const HERO_IMAGES = [
  "/images/rooms/pool-villa.webp",
  "/images/rooms/Deluxe Cottage.webp",
  "/images/restaurant-bar/orlowsky-hotel-oceanfront-dining-candidasa.webp",
  "/images/experiences/experiences-ayurvedic-spa.webp",
  "/images/experiences/experiences-diving.webp",
  "/images/experiences/experiences-events.webp",
  "/images/experiences/experiences-excursions.webp",
  "/images/experiences/experiences-tours-activities-bali.webp",
  "/images/welcome/Image.webp",
  "/images/offers/early-bird.webp",
  "/images/about/about-seafront-candidasa.webp",
  "/images/spa/ayurvedic-spa.webp",
  "/images/rental/rental.webp",
];

const SECTION_IMAGES = [
  "/images/about/about-tropical-garden.webp",
  "/images/about/about-pool-gardens.webp",
  "/images/dining/seaside-dining.webp",
  "/images/dining/buffet.webp",
  "/images/dining/chef-specials.webp",
  "/images/dining/bar-drinks-and-coctails.webp",
  "/images/dining/room-service.webp",
  "/images/dining/celebration-menu.webp",
  "/images/dining/international-cuisine.webp",
  "/images/dining/cultural-performance.webp",
  "/images/events/european-style-wedding.webp",
  "/images/events/balinese-style-wedding.webp",
  "/images/events/corporate-event-team-building.webp",
  "/images/events/catering.webp",
  "/images/events/entertainment-balinese-dance.webp",
  "/images/restaurant-bar/orlowsky-hotel-restaurant-bar-dining-candidasa.webp",
  "/images/restaurant-bar/orlowsky-hotel-bar-tropical-drinks-candidasa.webp",
  "/images/restaurant-bar/orlowsky-hotel-seaside-dining-candidasa.webp",
  "/images/restaurant-bar/orlowsky-hotel-restaurant-bar-courtyard-candidasa.webp",
  "/images/restaurant-bar/orlowsky-hotel-international-cuisine-bali.webp",
  "/images/restaurant-bar/orlowsky-hotel-fresh-seafood-appetizer-candidasa.webp",
  "/images/restaurant-bar/orlowsky-hotel-restaurant-bar-candidasa-bali.webp",
  "/images/restaurant-bar/orlowsky-hotel-restaurant-interior-candidasa.webp",
  "/images/restaurant-bar/orlowsky-hotel-beach-gazebo-ocean-view-candidasa.webp",
  "/images/restaurant-bar/orlowsky-hotel-restaurant-dining-setup-candidasa.webp",
  "/images/restaurant-bar/orlowsky-hotel-seaside-dining-oceanfront-candidasa.webp",
  "/images/honeymoon/honeymoon.webp",
  "/images/welcome/mobile.webp",
  "/images/diving/diving-hawksbill-turtle-scuba-diver-candidasa-bali.webp",
];

const GALLERY_IMAGES = [
  "/images/gallery/orlowsky-hotel-pool-beach-panorama.webp",
  "/images/gallery/orlowsky-hotel-infinity-pool-beachfront-candidasa.webp",
  "/images/gallery/orlowsky-hotel-seafront-candidasa-bay.webp",
  "/images/gallery/orlowsky-hotel-beach-gazebo-turquoise-sea.webp",
  "/images/gallery/orlowsky-hotel-garden-pathway-lanterns.webp",
  "/images/gallery/orlowsky-hotel-pool-terrace-ocean.webp",
  "/images/gallery/orlowsky-hotel-oceanfront-terrace-deck.webp",
  "/images/gallery/orlowsky-hotel-diving-boat-turquoise-bay.webp",
  "/images/gallery/orlowsky-hotel-cottage-bedroom-panoramic.webp",
  "/images/gallery/orlowsky-hotel-luxury-bedroom-garden-doors.webp",
  "/images/gallery/orlowsky-hotel-yoga-platform-ocean.webp",
  "/images/gallery/orlowsky-hotel-restaurant-bar-candidasa.webp",
  "/images/gallery/orlowsky-hotel-restaurant-dining-interior.webp",
  "/images/gallery/orlowsky-hotel-romantic-heart-arch.webp",
  "/images/gallery/orlowsky-hotel-two-story-villa-private-pool.webp",
  "/images/gallery/orlowsky-hotel-villa-pool-exterior-garden.webp",
  "/images/gallery/orlowsky-hotel-private-villa-pool-east-bali.webp",
  "/images/gallery/orlowsky-hotel-beach-pavilion-ocean-view.webp",
  "/images/gallery/orlowsky-hotel-terrace-view-candidasa-islands.webp",
  "/images/gallery/orlowsky-hotel-garden-villa-tropical-landscape.webp",
];

function prefetchBatch(urls: string[]) {
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
    if ("requestIdleCallback" in window) {
      requestIdleCallback(fn);
    } else {
      fn();
    }
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

    scheduleIdle(() => prefetchBatch(HERO_IMAGES), 2000);
    scheduleIdle(() => prefetchBatch(SECTION_IMAGES), 10000);
    scheduleIdle(() => prefetchBatch(GALLERY_IMAGES), 25000);
  }, []);

  return null;
}
