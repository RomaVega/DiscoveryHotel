import { getHomePageData, getContactData } from "@/lib/content";
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
import { BookingCta } from "@/components/sections/BookingCta";

export default function HomePage() {
  const data = getHomePageData();
  const contact = getContactData();

  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroImage hero={data.hero} />
        <Welcome data={data.welcome} />
        <RoomsPreview data={data.roomsPreview} />
        <Amenities data={data.amenities} />
        <Experiences data={data.experiences} />
        <SpecialOffers data={data.offers} />
        <GalleryPreview data={data.galleryPreview} />
        <BookingCta data={data.bookingCta} />
      </main>
      <Footer contact={contact} />
      <WhatsAppButton
        phone={contact.whatsapp}
        greeting={contact.whatsappGreeting}
      />
    </>
  );
}
