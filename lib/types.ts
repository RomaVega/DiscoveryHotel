/* Single source of truth for all data shapes */

export type Locale = "en" | "ru";

export type LocalizedString = string | { en: string; ru: string };

export interface RoomSlide {
  src: string;
  alt: LocalizedString;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface HeroData {
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  titleLine4?: string;
  subtitle: LocalizedString;
  cta: LocalizedString;
  ctaHref: string;
  image: string;
  imageMobile?: string;
  imagePoster?: string;
  imageAlt: string;
  video?: string;
  videoMobile?: string;
}

export interface WelcomeData {
  label: LocalizedString;
  heading: LocalizedString;
  description: LocalizedString;
  image: string;
  imageAlt: string;
}

export interface RoomCard {
  title: LocalizedString;
  description: LocalizedString;
  image: string;
  imageMobile?: string;
  imageAlt: string;
  images?: RoomSlide[];
  href: string;
}

export interface RoomsPreviewData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  rooms: RoomCard[];
}

export interface Amenity {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
  hideMobile?: boolean;
  hideDesktop?: boolean;
}

export interface AmenitiesData {
  label: LocalizedString;
  heading: LocalizedString;
  items: Amenity[];
}

export interface ExperienceCard {
  title: LocalizedString;
  description: LocalizedString;
  image: string;
  imageAlt: LocalizedString;
  href: string;
  external?: boolean;
  cta?: LocalizedString;
}

export interface ExperiencesData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  items: ExperienceCard[];
}

export interface Offer {
  title: LocalizedString;
  description: LocalizedString;
  price: LocalizedString;
  image: string;
  imageAlt: string;
  active: boolean;
  /** Short badge/tag shown over the image, e.g. "Save 20%", "For Couples". */
  badge?: LocalizedString;
  /** Bulleted "what's included" list. */
  inclusions?: LocalizedString[];
  /** Honest booking/stay condition or deadline, e.g. "Book 30+ days ahead". */
  validity?: LocalizedString;
  /** Fine print (min stay, blackout dates, cancellation). */
  terms?: LocalizedString;
}

export interface OffersData {
  label: LocalizedString;
  heading: LocalizedString;
  offers: Offer[];
}

export type GalleryCategory =
  | "villas-rooms"
  | "dining-bar"
  | "grounds-pool"
  | "beach-sea";

export interface GalleryImage {
  src: string;
  alt: string;
  /** Grouping for the gallery-page filter pills. Omit to show only under "All". */
  category?: GalleryCategory;
  /** Intrinsic pixel dimensions — lets the masonry reserve aspect-ratio space (no CLS). */
  width?: number;
  height?: number;
}

export interface GalleryPreviewData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext?: LocalizedString;
  images: GalleryImage[];
}

export interface BookingCtaData {
  heading: LocalizedString;
  subtext: LocalizedString;
  bookingUrl: string;
  fallbackCta: LocalizedString;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface WhatsAppContact {
  label: string;
  number: string;
  greeting: string;
  locale: "ru" | "en" | "all";
}

export interface ContactData {
  hotelName: string;
  stars: number;
  address: string[];
  coordinates: Coordinates;
  whatsapp: string;
  whatsappGreeting: string;
  whatsappContacts: WhatsAppContact[];
  email: string;
  socials: SocialLink[];
  googleMapsUrl: string;
}

export interface Review {
  author: LocalizedString;
  country?: string;
  date: string;
  rating: number; // 1–5
  text: LocalizedString;
  source: "booking" | "google";
}

/**
 * A hotel rating as published by a third-party booking or review platform.
 * Displayed verbatim and linked back to the source so any visitor can check it —
 * these are the section's trust anchor, unlike the hand-picked review quotes.
 */
export interface RatingAggregate {
  platform: string;
  score: number;
  /** Platforms use different scales: Booking/Agoda are out of 10, Google/Tripadvisor out of 5. */
  scale: 5 | 10;
  count: number;
  url: string;
  /** ISO date the score was last checked against the platform. Surfaced in the UI
   *  so a stale figure is visible rather than quietly misleading. */
  verifiedOn: string;
}

export interface ReviewsData {
  aggregates: RatingAggregate[];
  reviews: Review[];
}

/**
 * A Review with its LocalizedStrings already flattened to one locale.
 * Reviews cross into a client component, so resolving them on the server keeps
 * the other locale's text out of the RSC payload. Safe because locale is
 * route-determined (`/ru/*` vs everything else) and never changes in place —
 * revisit if an in-page language toggle is ever added.
 */
export interface ResolvedReview extends Omit<Review, "author" | "text"> {
  author: string;
  text: string;
}

export interface HomePageData {
  hero: HeroData;
  welcome: WelcomeData;
  roomsPreview: RoomsPreviewData;
  amenities: AmenitiesData;
  experiences: ExperiencesData;
  offers: OffersData;
  galleryPreview: GalleryPreviewData;
  bookingCta: BookingCtaData;
}

/* ─── Rooms Page ─── */
export interface RoomDetail {
  title: LocalizedString;
  description: LocalizedString;
  size: string;
  bedrooms?: number;
  bathrooms?: number;
  image: string;
  imageAlt: LocalizedString;
  images?: RoomSlide[];
  href: string;
  keyFeatures?: LocalizedString[];
  amenities: LocalizedString[];
  amenityGroups?: { label: LocalizedString; items: LocalizedString[] }[];
  highlights?: LocalizedString[];
}

export interface RoomsPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  rooms: RoomDetail[];
  bookingCta: BookingCtaData;
}

/* ─── Dining Page ─── */
export interface DiningFeature {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface DiningPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  hours: string;
  capacity: string;
  features: DiningFeature[];
  menuHighlights?: {
    title: LocalizedString;
    items: LocalizedString[];
  }[];
  image?: string;
  imageAlt?: string;
  bookingCta: BookingCtaData;
}

/* ─── Spa Page ─── */
export interface SpaTreatment {
  name: LocalizedString;
  description: LocalizedString;
  duration: string;
  price: string;
}

export interface SpaProgram {
  name: LocalizedString;
  description: LocalizedString;
  duration: string;
  price: string;
  /** Short action label for the booking button, e.g. "Book Rejuvenation". Falls back to the shared treatment label. */
  bookLabel?: LocalizedString;
}

export interface SpaPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  hours: string;
  capacityPerHour?: number;
  discount?: LocalizedString;
  note: LocalizedString;
  programs: SpaProgram[];
  ayurvedicTreatments: SpaTreatment[];
  balineseTreatments: SpaTreatment[];
  image: string;
  imageAlt: string;
  bookingCta: BookingCtaData;
  /** "Not sure which treatment?" consultative CTA at the bottom. */
  helpCta?: HelpCta;
}

/* ─── Transfer Page ─── */
export interface TransferRoute {
  destination: LocalizedString;
  oneWay: string | null;
  roundTrip: string | null;
  maxPassengers?: number | null;
  note?: LocalizedString;
}

export interface LocalRoute {
  destination: LocalizedString;
  price: string;
  type?: LocalizedString;
}

export interface TransferFeature {
  title: LocalizedString;
  description: LocalizedString;
  icon?: string;
}

export interface TransferPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  features: TransferFeature[];
  routes: TransferRoute[];
  localRoutes: LocalRoute[];
  otherDestinations?: LocalizedString[];
  image: string;
  imageAlt: string;
  bookingCta: BookingCtaData;
}

/* ─── Excursions Page ─── */
export interface ExcursionItem {
  name: LocalizedString;
  description: LocalizedString;
  duration?: LocalizedString;
  price?: LocalizedString;
}

export interface ExcursionSection {
  title: LocalizedString;
  description?: LocalizedString;
  items?: ExcursionItem[];
  highlights?: ExcursionItem[];
}

export interface HelpCta {
  heading: LocalizedString;
  text: LocalizedString;
  button: LocalizedString;
}

export interface ExcursionsPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  /** Poetic lead-in shown between the hero and the tour list. */
  intro?: LocalizedString;
  sightseeing?: ExcursionSection;
  waterActivities?: ExcursionSection;
  trekking?: ExcursionSection;
  cycling?: ExcursionSection;
  organizedTours?: ExcursionSection;
  bookingCta: BookingCtaData;
  /** "Not sure what to pick?" consultative CTA at the bottom. */
  helpCta?: HelpCta;
}

/* ─── Diving Page ─── */
export interface DiveSite {
  name: LocalizedString;
  description: LocalizedString;
  image?: string;
}

export interface DiveProgram {
  name: LocalizedString;
  description: LocalizedString;
  duration?: string;
  price?: string;
  level: LocalizedString;
}

export interface DivingPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  /** Poetic lead-in shown between the hero and the dive programs. */
  intro?: LocalizedString;
  features?: { title: LocalizedString; description: LocalizedString; icon?: string }[];
  programs: DiveProgram[];
  diveSites: DiveSite[];
  image?: string;
  imageAlt?: string;
  bookingCta: BookingCtaData;
  helpCta?: HelpCta;
}

/* ─── Events Page ─── */
export interface EventService {
  title: LocalizedString;
  description: LocalizedString;
  image: string;
  imageAlt: LocalizedString;
}

export interface EventVenue {
  description: LocalizedString;
  capacity: { min: number; max: number } | LocalizedString;
}

export interface EventsPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  venue?: EventVenue;
  services: EventService[];
  venueFeatures?: LocalizedString[];
  bookingCta: BookingCtaData;
}

/* ─── Car Rental Page ─── */
export interface RentalVehicle {
  title: LocalizedString;
  description: LocalizedString;
  price: LocalizedString;
  image?: string;
  imageAlt?: LocalizedString;
}

export interface CarRentalPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  /** Motivational lead-in shown between the hero and the vehicle list. */
  intro?: LocalizedString;
  vehicles: RentalVehicle[];
  terms?: LocalizedString[];
  bookingCta: BookingCtaData;
}

/* ─── About Page ─── */
export interface AboutSection {
  title: LocalizedString;
  description: LocalizedString;
  image?: string;
  imageAlt?: LocalizedString;
}

export interface AboutStat {
  value: string;
  label: LocalizedString;
}

export interface AboutPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  intro?: LocalizedString;
  stats?: AboutStat[];
  sections: AboutSection[];
}

/* ─── Location Page ─── */
export interface NearbyAttraction {
  name: LocalizedString;
  description: LocalizedString;
  distance: LocalizedString;
}

export interface GettingHere {
  from: LocalizedString;
  description: LocalizedString;
  duration?: string;
}

export interface LocationPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  nearbyAttractions: NearbyAttraction[];
  gettingHere: GettingHere[];
}

/* ─── Weddings Page ─── */
export interface WeddingPackage {
  title: LocalizedString;
  description: LocalizedString;
  features?: LocalizedString[];
  image: string;
  imageAlt: LocalizedString;
}

export interface WeddingsPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  packages: WeddingPackage[];
  bookingCta: BookingCtaData;
}

/* ─── FAQ Page ─── */
// Strict {en,ru} (not LocalizedString): FAQ entries feed the FAQPage JSON-LD,
// which must emit both locales, so single-language strings are not allowed.
export interface FaqItem {
  question: { en: string; ru: string };
  answer: { en: string; ru: string };
}

export interface FaqPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext?: LocalizedString;
  items: FaqItem[];
}

/* ─── Legal Pages ─── */
export interface LegalSection {
  title: LocalizedString;
  content: LocalizedString;
}

export interface LegalPageData {
  label: LocalizedString;
  heading: LocalizedString;
  lastUpdated: string;
  sections: LegalSection[];
}

/* ─── Experiences Hub Page ─── */
export interface ExperiencesHubData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  categories: ExperienceCard[];
}
