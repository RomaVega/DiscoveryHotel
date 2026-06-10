import { getRoomsPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { RoomsDetail } from "@/components/sections/RoomsDetail";
import { SITE_URL } from "@/lib/site";
import { JsonLd, breadcrumbs, webPage } from "@/lib/jsonld";

export const metadata = {
  title: "Rooms & Villas in Candidasa, Bali — Orlowsky Discovery Hotel",
  description: "Pool villa (230 m²) with private pool and 3 bedrooms, or Deluxe Cottage (46 m²) with garden views. Book direct at Orlowsky Discovery Hotel, Candidasa, East Bali.",
  alternates: {
    canonical: `${SITE_URL}/rooms`,
    languages: {
      "en": `${SITE_URL}/rooms`,
      "ru": `${SITE_URL}/ru/rooms`,
      "x-default": `${SITE_URL}/rooms`,
    },
  },
  openGraph: {
    title: "Rooms & Villas in Candidasa, Bali — Orlowsky Discovery Hotel",
    description: "Pool villa (230 m²) with private pool and 3 bedrooms, or Deluxe Cottage (46 m²) with garden views. Book direct at Orlowsky Discovery Hotel, Candidasa, East Bali.",
    url: `${SITE_URL}/rooms`,
    images: [{ url: `${SITE_URL}/images/rooms/pool-villa.webp`, width: 1200, height: 630 }],
  },
};

export default function RoomsPage() {
  const data = getRoomsPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        webPage({
          path: "/rooms",
          name: "Rooms & Villas — Orlowsky Discovery Hotel, Candidasa",
          description: "Pool villa with private pool and three bedrooms, or Deluxe Cottage with garden views, on the seafront of Candidasa, East Bali.",
          image: `${SITE_URL}/images/rooms/pool-villa.webp`,
          locale: "en",
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Rooms", path: "/rooms" },
        ]),
      ]} />
      <PageHero
        image="/images/gallery/orlowsky-hotel-villas-coconut-grove.webp"
        imageDesktop="/images/gallery/orlowsky-hotel-two-story-villa-private-pool.webp"
        imageAlt="Pool villas and cottages set in a tropical coconut grove, Orlowsky Discovery Hotel, Candidasa"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <RoomsDetail data={data} />
    </InnerPageLayout>
  );
}
