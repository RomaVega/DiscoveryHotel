import { SITE_URL, SITE_NAME, OG_IMAGE } from "./site";
import type { Locale, RatingAggregate } from "./types";

export const HOTEL_ID = `${SITE_URL}/#hotel`;
const HOTEL_REF = { "@id": HOTEL_ID };

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Jalan Pantai Indah 06",
  addressLocality: "Candidasa",
  addressRegion: "Karangasem",
  postalCode: "80851",
  addressCountry: "ID",
};

const GEO = {
  "@type": "GeoCoordinates",
  latitude: -8.511625718417616,
  longitude: 115.57505012094016,
};

export type { Locale };
export type Crumb = { name: string; path: string };

/**
 * AggregateRating for the Hotel entity, taken from whichever third-party
 * platform rates us *lowest* once scores are normalised across their differing
 * scales — currently Google at 4.4/5 from 225 reviews.
 *
 * Publishing the least flattering verified figure is deliberate. Platforms are
 * within two points of each other, so any of them would be defensible, and
 * picking the best one is the kind of quiet curation this section exists to
 * avoid. Deriving it keeps that true if the numbers move, rather than pinning a
 * choice that was only conservative on the day it was written. The visible
 * RatingSummary band shows all four, so nothing here is hidden.
 *
 * Note: Google treats ratings a business publishes about itself as
 * "self-serving" and won't render review stars for LocalBusiness subtypes from
 * this. Its value is semantic clarity and AI assistants reading the page.
 */
export function aggregateRating(sources: readonly RatingAggregate[]) {
  if (sources.length === 0) return undefined;

  const lowest = sources.reduce((min, s) =>
    s.score / s.scale < min.score / min.scale ? s : min
  );

  return {
    "@type": "AggregateRating",
    ratingValue: lowest.score,
    bestRating: lowest.scale,
    worstRating: 1,
    ratingCount: lowest.count,
  };
}

export function breadcrumbs(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

type FaqItem = { question: { en: string; ru: string }; answer: { en: string; ru: string } };

export function faqPage(items: FaqItem[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question[locale],
      acceptedAnswer: { "@type": "Answer", text: item.answer[locale] },
    })),
  };
}

type RestaurantOpts = {
  path: string;
  name: string;
  description: string;
  image: string;
  servesCuisine: string[];
  openingHours: string;
  locale: Locale;
};

export function restaurant(opts: RestaurantOpts) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: opts.name,
    description: opts.description,
    image: opts.image,
    url: `${SITE_URL}${opts.path}`,
    inLanguage: opts.locale,
    address: ADDRESS,
    geo: GEO,
    telephone: "+6282236655582",
    servesCuisine: opts.servesCuisine,
    openingHours: opts.openingHours,
    priceRange: "$$",
    isPartOf: HOTEL_REF,
  };
}

type ServiceOpts = {
  path: string;
  name: string;
  description: string;
  image?: string;
  serviceType: string;
  locale: Locale;
  category?: string;
};

export function service(opts: ServiceOpts) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    image: opts.image,
    url: `${SITE_URL}${opts.path}`,
    inLanguage: opts.locale,
    serviceType: opts.serviceType,
    category: opts.category,
    areaServed: { "@type": "Place", name: "Candidasa, East Bali, Indonesia" },
    provider: { "@type": "Hotel", "@id": HOTEL_ID, name: SITE_NAME },
  };
}

type PageOpts = {
  path: string;
  name: string;
  description: string;
  image?: string;
  locale: Locale;
  type?: "WebPage" | "ContactPage" | "AboutPage" | "CollectionPage";
};

export function webPage(opts: PageOpts) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    name: opts.name,
    description: opts.description,
    image: opts.image ?? OG_IMAGE,
    url: `${SITE_URL}${opts.path}`,
    inLanguage: opts.locale,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    about: HOTEL_REF,
  };
}

type PlaceOpts = {
  path: string;
  name: string;
  description: string;
  image?: string;
  locale: Locale;
};

export function place(opts: PlaceOpts) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: opts.name,
    description: opts.description,
    image: opts.image,
    url: `${SITE_URL}${opts.path}`,
    inLanguage: opts.locale,
    geo: GEO,
    address: ADDRESS,
    includesAttraction: HOTEL_REF,
  };
}

type LodgingOpts = {
  path: string;
  name: string;
  description: string;
  image: string;
  numberOfRooms: number;
  locale: Locale;
};

export function lodgingBusiness(opts: LodgingOpts) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: opts.name,
    description: opts.description,
    image: opts.image,
    url: `${SITE_URL}${opts.path}`,
    inLanguage: opts.locale,
    address: ADDRESS,
    geo: GEO,
    telephone: "+6282236655582",
    priceRange: "$$",
    numberOfRooms: opts.numberOfRooms,
    isPartOf: HOTEL_REF,
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
