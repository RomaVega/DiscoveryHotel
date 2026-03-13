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
import { MapLocation } from "@/components/sections/MapLocation";
import { WaveDivider } from "@/components/common/WaveDivider";

export default function HomePage() {
  const data = getHomePageData();
  const contact = getContactData();

  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroImage hero={data.hero} />
        <WaveDivider from="fill-sand" to="fill-sand" />
        <Welcome data={data.welcome} />
        <WaveDivider from="fill-sand" to="fill-ivory" />
        <RoomsPreview data={data.roomsPreview} />
        <WaveDivider from="fill-ivory" to="fill-sand" />
        <Amenities data={data.amenities} />
        <WaveDivider from="fill-sand" to="fill-ivory" />
        <Experiences data={data.experiences} />
        <WaveDivider from="fill-ivory" to="fill-sand" />
        <SpecialOffers data={data.offers} />
        <WaveDivider from="fill-sand" to="fill-ivory" />
        <GalleryPreview data={data.galleryPreview} />
        <WaveDivider from="fill-ivory" to="fill-deep-teal" />
        <BookingCta data={data.bookingCta} />
        <WaveDivider from="fill-deep-teal" to="fill-sand" />
        <MapLocation contact={contact} />
        <WaveDivider from="fill-sand" to="fill-deep-teal" />
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
