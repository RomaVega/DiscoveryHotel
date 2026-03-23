import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { LocationDetail } from "@/components/sections/LocationDetail";
import { MapLocation } from "@/components/sections/MapLocation";

export const metadata = {
  title: "Location — Candidasa, Karangasem, East Bali | Orlowsky Discovery",
  description: "Orlowsky Discovery Hotel is on the quiet seafront of Candidasa, 1.5 hours from Bali Airport. Near Besakih Temple, Tirta Gangga, Amed, and Tulamben dive sites.",
};

export default function LocationPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/location.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/gallery/g6.jpg"
        imageAlt="Scenic coastline of Candidasa, East Bali"
        heading={data.heading}
        subtext={data.subtext}
      />
      <LocationDetail data={data} />
      <MapLocation contact={contact} />
    </InnerPageLayout>
  );
}
