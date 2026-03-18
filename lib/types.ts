/* Single source of truth for all data shapes */

export type LocalizedString = string | { en: string; ru: string };

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
  imageAlt: string;
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
  imageAlt: string;
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
