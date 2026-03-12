/* Single source of truth for all data shapes */

export interface NavLink {
  label: string;
  href: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  video?: string;
}

export interface WelcomeData {
  label: string;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface RoomCard {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
}

export interface RoomsPreviewData {
  label: string;
  heading: string;
  subtext: string;
  rooms: RoomCard[];
}

export interface Amenity {
  icon: string;
  title: string;
  description: string;
}

export interface AmenitiesData {
  label: string;
  heading: string;
  items: Amenity[];
}

export interface ExperienceCard {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
}

export interface ExperiencesData {
  label: string;
  heading: string;
  subtext: string;
  items: ExperienceCard[];
}

export interface Offer {
  title: string;
  description: string;
  price: string;
  image: string;
  imageAlt: string;
  active: boolean;
}

export interface OffersData {
  label: string;
  heading: string;
  offers: Offer[];
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryPreviewData {
  label: string;
  heading: string;
  images: GalleryImage[];
}

export interface BookingCtaData {
  heading: string;
  subtext: string;
  bookingUrl: string;
  fallbackCta: string;
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

export interface ContactData {
  hotelName: string;
  stars: number;
  address: string[];
  coordinates: Coordinates;
  whatsapp: string;
  whatsappGreeting: string;
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
