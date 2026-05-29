import { getContactData, getCarRentalPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { CarRentalDetail } from "@/components/sections/CarRentalDetail";
import { SITE_URL } from "@/lib/site";
import { JsonLd, breadcrumbs, service } from "@/lib/jsonld";

export const metadata = {
  title: "Car & Bike Rental in Candidasa, East Bali — Orlowsky Discovery",
  description: "Rent scooters, cars with or without driver, and electric bikes in Candidasa. Hotel pickup and drop-off. Explore East Bali, Ubud, Kintamani at your own pace.",
  alternates: {
    canonical: `${SITE_URL}/experiences/car-rental`,
    languages: {
      "en": `${SITE_URL}/experiences/car-rental`,
      "ru": `${SITE_URL}/ru/experiences/car-rental`,
      "x-default": `${SITE_URL}/experiences/car-rental`,
    },
  },
  openGraph: {
    title: "Car & Bike Rental in Candidasa, East Bali — Orlowsky Discovery",
    description: "Rent scooters, cars with or without driver, and electric bikes in Candidasa. Hotel pickup and drop-off. Explore East Bali, Ubud, Kintamani at your own pace.",
    url: `${SITE_URL}/experiences/car-rental`,
    images: [{ url: `${SITE_URL}/images/rental/rental.webp`, width: 1200, height: 630 }],
  },
};

export default function CarRentalPage() {
  const contact = getContactData();
  const data = getCarRentalPageData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        service({
          path: "/experiences/car-rental",
          name: "Car & Bike Rental in Candidasa, East Bali",
          description: "Rent scooters, cars with or without driver, and electric bikes in Candidasa. Hotel pickup and drop-off.",
          image: `${SITE_URL}/images/rental/rental.webp`,
          serviceType: "Vehicle Rental",
          category: "Transportation",
          locale: "en",
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Experiences", path: "/experiences" },
          { name: "Car & Bike Rental", path: "/experiences/car-rental" },
        ]),
      ]} />
      <PageHero
        image="/images/rental/rental.webp"
        imageAlt="Scooter on a scenic Bali road"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <CarRentalDetail data={data} />
    </InnerPageLayout>
  );
}
