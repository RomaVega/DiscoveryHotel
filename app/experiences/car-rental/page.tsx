import { getContactData, getCarRentalPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { CarRentalDetail } from "@/components/sections/CarRentalDetail";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Car & Bike Rental in Candidasa, East Bali — Orlowsky Discovery",
  description: "Rent scooters, cars with or without driver, and electric bikes in Candidasa. Hotel pickup and drop-off. Explore East Bali, Ubud, Kintamani at your own pace.",
  alternates: {
    canonical: `${SITE_URL}/experiences/car-rental`,
  },
  openGraph: {
    title: "Car & Bike Rental in Candidasa, East Bali — Orlowsky Discovery",
    description: "Rent scooters, cars with or without driver, and electric bikes in Candidasa. Hotel pickup and drop-off. Explore East Bali, Ubud, Kintamani at your own pace.",
    url: `${SITE_URL}/experiences/car-rental`,
    images: [{ url: `${SITE_URL}/images/rental/rental.png`, width: 1200, height: 630 }],
  },
};

export default function CarRentalPage() {
  const contact = getContactData();
  const data = getCarRentalPageData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/rental/rental.png"
        imageAlt="Scooter on a scenic Bali road"
        heading={data.heading}
        subtext={data.subtext}
      />
      <CarRentalDetail data={data} />
    </InnerPageLayout>
  );
}
