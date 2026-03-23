import { getRoomsPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { RoomsDetail } from "@/components/sections/RoomsDetail";

export const metadata = {
  title: "Rooms & Villas in Candidasa, Bali — Orlowsky Discovery Hotel",
  description: "Pool villa (230 m²) with private pool and 3 bedrooms, or Deluxe Cottage (46 m²) with garden views. Book direct at Orlowsky Discovery Hotel, Candidasa, East Bali.",
};

export default function RoomsPage() {
  const data = getRoomsPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/rooms/pool-villa.jpg"
        imageAlt="Aerial view of pool villas surrounded by tropical gardens"
        heading={data.heading}
        subtext={data.subtext}
      />
      <RoomsDetail data={data} />
    </InnerPageLayout>
  );
}
