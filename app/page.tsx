import { getHomePageData, getContactData, getReviews, getRatingAggregates } from "@/lib/content";
import { RatingSummary } from "@/components/sections/RatingSummary";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { HeroImage } from "@/components/sections/HeroImage";
import { Welcome } from "@/components/sections/Welcome";
import { RoomsPreview } from "@/components/sections/RoomsPreview";
import { Amenities } from "@/components/sections/Amenities";
import { DiningPreview } from "@/components/sections/DiningPreview";
import { Experiences } from "@/components/sections/Experiences";
import { SpecialOffers } from "@/components/sections/SpecialOffers";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { ReviewScroller } from "@/components/sections/ReviewScroller";
import { BookingCta } from "@/components/sections/BookingCta";
import { MapLocation } from "@/components/sections/MapLocation";
import { ScrollDivider } from "@/components/common/ScrollDivider";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: {
      "en": `${SITE_URL}/`,
      "ru": `${SITE_URL}/ru`,
      "x-default": `${SITE_URL}/`,
    },
  },
};

// Design token colors (mirrors globals.css @theme)
const C = {
  sand:     "#f5f0e8",
  ivory:    "#faf8f4",
  deepTeal: "#2a6b74",
};

export default function HomePage() {
  const data = getHomePageData();
  const contact = getContactData();
  const reviews = getReviews("en");
  const aggregates = getRatingAggregates();

  return (
    <>
      <Navbar hideBrand />
      <main id="main-content">
        <HeroImage hero={data.hero} />
        <ScrollDivider above={C.sand}     below={C.sand}     />
        <Welcome data={data.welcome} />
        <ScrollDivider above={C.sand}     below={C.ivory}    />
        <RoomsPreview data={data.roomsPreview} />
        <ScrollDivider above={C.ivory}    below={C.sand}     />
        <DiningPreview />
        <ScrollDivider above={C.sand}     below={C.ivory}    />
        <Amenities data={data.amenities} />
        <ScrollDivider above={C.ivory}    below={C.sand}     />
        <Experiences data={data.experiences} compactMobile />
        <ScrollDivider above={C.sand}     below={C.ivory}    />
        <SpecialOffers data={data.offers} />
        <ScrollDivider above={C.ivory}    below={C.sand}     />
        <GalleryPreview data={data.galleryPreview} hideDesktopThumbnails />
        <ScrollDivider above={C.sand}     below={C.ivory}    />
        <ReviewScroller reviews={reviews}>
          <RatingSummary aggregates={aggregates} locale="en" />
        </ReviewScroller>
        <MapLocation contact={contact} />
        <BookingCta data={data.bookingCta} />
      </main>
      <Footer contact={contact} />
      <WhatsAppButton
        phone={contact.whatsapp}
        greeting={contact.whatsappGreeting}
        contacts={contact.whatsappContacts}
      />
    </>
  );
}
