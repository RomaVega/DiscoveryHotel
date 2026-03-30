/* Single source of truth for all data shapes */

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
}

export interface OffersData {
  label: LocalizedString;
  heading: LocalizedString;
  offers: Offer[];
}

export interface GalleryImage {
  src: string;
  alt: string;
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

export interface ReviewsData {
  reviews: Review[];
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
  includes: LocalizedString[];
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
}

/* ─── Transfer Page ─── */
export interface TransferRoute {
  destination: LocalizedString;
  oneWay: string;
  roundTrip: string;
}

export interface LocalRoute {
  destination: LocalizedString;
  price: string;
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

export interface ExcursionsPageData {
  label: LocalizedString;
  heading: LocalizedString;
  subtext: LocalizedString;
  sightseeing?: ExcursionSection;
  waterActivities?: ExcursionSection;
  trekking?: ExcursionSection;
  cycling?: ExcursionSection;
  organizedTours?: ExcursionSection;
  bookingCta: BookingCtaData;
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
  features?: { title: LocalizedString; description: LocalizedString; icon?: string }[];
  programs: DiveProgram[];
  diveSites: DiveSite[];
  image?: string;
  imageAlt?: string;
  bookingCta: BookingCtaData;
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
  duration: string;
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
export interface FaqItem {
  question: LocalizedString;
  answer: LocalizedString;
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
