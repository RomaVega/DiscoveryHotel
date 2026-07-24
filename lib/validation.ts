/**
 * Zod schemas for content/*.json. Loaders in lib/content.ts run these at
 * module-load — invalid JSON fails the build with a clear path to the offender.
 *
 * Schemas are kept in lockstep with lib/types.ts manually; the loader signatures
 * declare both the schema-inferred return type AND the matching TypeScript
 * interface, so any drift trips a compile error.
 */

import { z } from "zod";

const localizedString = z.union([
  z.string(),
  z.object({ en: z.string(), ru: z.string() }),
]);

const roomSlide = z.object({
  src: z.string(),
  alt: localizedString,
});

const bookingCtaData = z.object({
  heading: localizedString,
  subtext: localizedString,
  bookingUrl: z.string(),
  fallbackCta: localizedString,
});

const heroData = z.object({
  titleLine1: z.string(),
  titleLine2: z.string(),
  titleLine3: z.string(),
  titleLine4: z.string().optional(),
  subtitle: localizedString,
  cta: localizedString,
  ctaHref: z.string(),
  image: z.string(),
  imageMobile: z.string().optional(),
  imagePoster: z.string().optional(),
  imageAlt: z.string(),
  video: z.string().optional(),
  videoMobile: z.string().optional(),
});

const welcomeData = z.object({
  label: localizedString,
  heading: localizedString,
  description: localizedString,
  image: z.string(),
  imageAlt: z.string(),
});

const roomCard = z.object({
  title: localizedString,
  description: localizedString,
  image: z.string(),
  imageMobile: z.string().optional(),
  imageAlt: z.string(),
  images: z.array(roomSlide).optional(),
  href: z.string(),
});

const roomsPreviewData = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  rooms: z.array(roomCard),
});

const amenity = z.object({
  icon: z.string(),
  title: localizedString,
  description: localizedString,
  hideMobile: z.boolean().optional(),
  hideDesktop: z.boolean().optional(),
});

const amenitiesData = z.object({
  label: localizedString,
  heading: localizedString,
  items: z.array(amenity),
});

const experienceCard = z.object({
  title: localizedString,
  description: localizedString,
  image: z.string(),
  imageAlt: localizedString,
  href: z.string(),
  external: z.boolean().optional(),
  cta: localizedString.optional(),
});

const experiencesData = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  items: z.array(experienceCard),
});

const offer = z.object({
  title: localizedString,
  description: localizedString,
  price: localizedString,
  image: z.string(),
  imageAlt: z.string(),
  active: z.boolean(),
});

const offersData = z.object({
  label: localizedString,
  heading: localizedString,
  offers: z.array(offer),
});

const galleryImage = z.object({
  src: z.string(),
  alt: z.string(),
});

const galleryPreviewData = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString.optional(),
  images: z.array(galleryImage),
});

export const homePageSchema = z.object({
  hero: heroData,
  welcome: welcomeData,
  roomsPreview: roomsPreviewData,
  amenities: amenitiesData,
  experiences: experiencesData,
  offers: offersData,
  galleryPreview: galleryPreviewData,
  bookingCta: bookingCtaData,
});

const socialLink = z.object({
  platform: z.string(),
  url: z.string(),
  icon: z.string(),
});

const coordinates = z.object({
  lat: z.number(),
  lng: z.number(),
});

const whatsAppContact = z.object({
  label: z.string(),
  number: z.string(),
  greeting: z.string(),
  locale: z.enum(["ru", "en", "all"]),
});

export const contactSchema = z.object({
  hotelName: z.string(),
  stars: z.number(),
  address: z.array(z.string()),
  coordinates,
  whatsapp: z.string(),
  whatsappGreeting: z.string(),
  whatsappContacts: z.array(whatsAppContact),
  email: z.string(),
  socials: z.array(socialLink),
  googleMapsUrl: z.string(),
});

const review = z.object({
  author: localizedString,
  country: z.string().optional(),
  date: z.string(),
  rating: z.number(),
  text: localizedString,
  source: z.enum(["booking", "google"]),
});

const ratingAggregate = z.object({
  platform: z.string(),
  score: z.number().positive(),
  scale: z.union([z.literal(5), z.literal(10)]),
  count: z.number().int().positive(),
  url: z.string().url(),
  verifiedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "verifiedOn must be YYYY-MM-DD"),
}).refine((a) => a.score <= a.scale, {
  message: "score cannot exceed its scale",
});

export const reviewsSchema = z.object({
  aggregates: z.array(ratingAggregate),
  reviews: z.array(review),
});

const roomDetail = z.object({
  title: localizedString,
  description: localizedString,
  size: z.string(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  image: z.string(),
  imageAlt: localizedString,
  images: z.array(roomSlide).optional(),
  href: z.string(),
  keyFeatures: z.array(localizedString).optional(),
  amenities: z.array(localizedString),
  amenityGroups: z.array(z.object({ label: localizedString, items: z.array(localizedString) })).optional(),
  highlights: z.array(localizedString).optional(),
});

export const roomsPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  rooms: z.array(roomDetail),
  bookingCta: bookingCtaData,
});

const diningFeature = z.object({
  icon: z.string(),
  title: localizedString,
  description: localizedString,
});

export const diningPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  hours: z.string(),
  capacity: z.string(),
  features: z.array(diningFeature),
  menuHighlights: z.array(z.object({ title: localizedString, items: z.array(localizedString) })).optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  bookingCta: bookingCtaData,
});

const spaTreatment = z.object({
  name: localizedString,
  description: localizedString,
  duration: z.string(),
  price: z.string(),
});

const spaProgram = z.object({
  name: localizedString,
  description: localizedString,
  duration: z.string(),
  price: z.string(),
});

export const spaPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  hours: z.string(),
  capacityPerHour: z.number().optional(),
  discount: localizedString.optional(),
  note: localizedString,
  programs: z.array(spaProgram),
  ayurvedicTreatments: z.array(spaTreatment),
  balineseTreatments: z.array(spaTreatment),
  image: z.string(),
  imageAlt: z.string(),
  bookingCta: bookingCtaData,
});

const transferRoute = z.object({
  destination: localizedString,
  oneWay: z.string().nullable(),
  roundTrip: z.string().nullable(),
  maxPassengers: z.number().nullable().optional(),
  note: localizedString.optional(),
});

const localRoute = z.object({
  destination: localizedString,
  price: z.string(),
  type: localizedString.optional(),
});

const transferFeature = z.object({
  title: localizedString,
  description: localizedString,
  icon: z.string().optional(),
});

export const transferPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  features: z.array(transferFeature),
  routes: z.array(transferRoute),
  localRoutes: z.array(localRoute),
  otherDestinations: z.array(localizedString).optional(),
  image: z.string(),
  imageAlt: z.string(),
  bookingCta: bookingCtaData,
});

const excursionItem = z.object({
  name: localizedString,
  description: localizedString,
  duration: localizedString.optional(),
  price: localizedString.optional(),
});

const excursionSection = z.object({
  title: localizedString,
  description: localizedString.optional(),
  items: z.array(excursionItem).optional(),
  highlights: z.array(excursionItem).optional(),
});

export const excursionsPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  sightseeing: excursionSection.optional(),
  waterActivities: excursionSection.optional(),
  trekking: excursionSection.optional(),
  cycling: excursionSection.optional(),
  organizedTours: excursionSection.optional(),
  bookingCta: bookingCtaData,
});

const diveSite = z.object({
  name: localizedString,
  description: localizedString,
  image: z.string().optional(),
});

const diveProgram = z.object({
  name: localizedString,
  description: localizedString,
  duration: z.string().optional(),
  price: z.string().optional(),
  level: localizedString,
});

export const divingPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  features: z.array(z.object({ title: localizedString, description: localizedString, icon: z.string().optional() })).optional(),
  programs: z.array(diveProgram),
  diveSites: z.array(diveSite),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  bookingCta: bookingCtaData,
});

const eventService = z.object({
  title: localizedString,
  description: localizedString,
  image: z.string(),
  imageAlt: localizedString,
});

const eventVenue = z.object({
  description: localizedString,
  capacity: z.union([
    z.object({ min: z.number(), max: z.number() }),
    localizedString,
  ]),
});

export const eventsPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  venue: eventVenue.optional(),
  services: z.array(eventService),
  venueFeatures: z.array(localizedString).optional(),
  bookingCta: bookingCtaData,
});

const rentalVehicle = z.object({
  title: localizedString,
  description: localizedString,
  price: localizedString,
  image: z.string().optional(),
  imageAlt: localizedString.optional(),
});

export const carRentalPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  vehicles: z.array(rentalVehicle),
  terms: z.array(localizedString).optional(),
  bookingCta: bookingCtaData,
});

const aboutSection = z.object({
  title: localizedString,
  description: localizedString,
  image: z.string().optional(),
  imageAlt: localizedString.optional(),
});

const aboutStat = z.object({
  value: z.string(),
  label: localizedString,
});

export const aboutPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  intro: localizedString.optional(),
  stats: z.array(aboutStat).optional(),
  sections: z.array(aboutSection),
});

export const experiencesHubSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  categories: z.array(experienceCard),
});

// FAQ items are strict {en,ru} (not localizedString) — they feed FAQPage
// JSON-LD which emits both locales. See FaqItem in lib/types.ts.
const enRu = z.object({ en: z.string(), ru: z.string() });

export const faqPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString.optional(),
  items: z.array(z.object({ question: enRu, answer: enRu })),
});

export const locationPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  nearbyAttractions: z.array(z.object({
    name: localizedString,
    description: localizedString,
    distance: localizedString,
  })),
  gettingHere: z.array(z.object({
    from: localizedString,
    description: localizedString,
    duration: z.string().optional(),
  })),
});

export const legalPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  lastUpdated: z.string(),
  sections: z.array(z.object({ title: localizedString, content: localizedString })),
});

export const weddingsPageSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtext: localizedString,
  packages: z.array(z.object({
    title: localizedString,
    description: localizedString,
    features: z.array(localizedString).optional(),
    image: z.string(),
    imageAlt: localizedString,
  })),
  bookingCta: bookingCtaData,
});
