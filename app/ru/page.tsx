import { SITE_URL } from "@/lib/site";
import { getHomePageData, getContactData, getReviewsData } from "@/lib/content";
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

export const metadata = {
  title: "Orlowsky Discovery Hotel | Кандидаса, Восточный Бали",
  description: "Четырёхзвёздочный бутик-отель на берегу Кандидасы, Восточный Бали. Виллы с видом на океан, тропические сады, спа, дайвинг и балийское гостеприимство.",
  alternates: {
    canonical: `${SITE_URL}/ru`,
    languages: {
      "en": `${SITE_URL}/`,
      "ru": `${SITE_URL}/ru`,
      "x-default": `${SITE_URL}/`,
    },
  },
  openGraph: {
    title: "Orlowsky Discovery Hotel | Кандидаса, Восточный Бали",
    description: "Четырёхзвёздочный бутик-отель на берегу Кандидасы, Восточный Бали. Виллы с видом на океан, тропические сады, спа, дайвинг и балийское гостеприимство.",
    url: `${SITE_URL}/ru`,
    images: [{ url: `${SITE_URL}/images/hero/hero-main.jpg`, width: 1200, height: 630 }],
  },
};

// Design token colors (mirrors globals.css @theme)
const C = {
  sand:     "#f5f0e8",
  ivory:    "#faf8f4",
  deepTeal: "#2a6b74",
};

export default function HomeRuPage() {
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
        <DiningPreview />
        <ScrollDivider above={C.sand}     below={C.ivory}    />
        <Amenities data={data.amenities} />
        <ScrollDivider above={C.ivory}    below={C.sand}     />
        <Experiences data={data.experiences} />
        <ScrollDivider above={C.sand}     below={C.ivory}    />
        <SpecialOffers data={data.offers} />
        <ScrollDivider above={C.ivory}    below={C.sand}     />
        <GalleryPreview data={data.galleryPreview} />
        <ScrollDivider above={C.sand}     below={C.ivory}    />
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
