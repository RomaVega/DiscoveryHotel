import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { CarRentalDetail } from "@/components/sections/CarRentalDetail";

export const metadata = {
  title: "Car & Bike Rental in Candidasa, East Bali — Orlowsky Discovery",
  description: "Rent scooters, cars with or without driver, and electric bikes in Candidasa. Hotel pickup and drop-off. Explore East Bali, Ubud, Kintamani at your own pace.",
};

export default function CarRentalPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/car-rental.json");

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
