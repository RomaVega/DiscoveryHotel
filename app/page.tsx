import { getHomePageData, getContactData, getReviewsData } from "@/lib/content";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { HeroImage } from "@/components/sections/HeroImage";
import { Welcome } from "@/components/sections/Welcome";
import { RoomsPreview } from "@/components/sections/RoomsPreview";
import { Amenities } from "@/components/sections/Amenities";
import { Experiences } from "@/components/sections/Experiences";
import { SpecialOffers } from "@/components/sections/SpecialOffers";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { ReviewScroller } from "@/components/sections/ReviewScroller";
import { BookingCta } from "@/components/sections/BookingCta";
import { MapLocation } from "@/components/sections/MapLocation";
import { ScrollDivider } from "@/components/common/ScrollDivider";

// Design token colors (mirrors globals.css @theme)
const C = {
  sand:     "#f5f0e8",
  ivory:    "#faf8f4",
  deepTeal: "#2a6b74",
};

export default function HomePage() {
  const data = getHomePageData();
  const contact = getContactData();
  const { reviews } = getReviewsData();

  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroImage hero={data.hero} />
        <ScrollDivider above={C.sand}     below={C.sand}     />
        <Welcome data={data.welcome} />
        <ScrollDivider above={C.sand}     below={C.ivory}    />
        <RoomsPreview data={data.roomsPreview} />
        <ScrollDivider above={C.ivory}    below={C.sand}     />
        <Amenities data={data.amenities} />
        <ScrollDivider above={C.sand}     below={C.ivory}    />
        <Experiences data={data.experiences} />
        <ScrollDivider above={C.ivory}    below={C.sand}     />
        <SpecialOffers data={data.offers} />
        <ScrollDivider above={C.sand}     below={C.ivory}    />
        <GalleryPreview data={data.galleryPreview} />
        <ScrollDivider above={C.ivory}    below={C.sand}     />
        <ReviewScroller reviews={reviews} />
        <BookingCta data={data.bookingCta} />
        <MapLocation contact={contact} />
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
