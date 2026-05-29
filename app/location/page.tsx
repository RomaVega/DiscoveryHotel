import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { LocationDetail } from "@/components/sections/LocationDetail";
import { MapLocation } from "@/components/sections/MapLocation";
import { SITE_URL } from "@/lib/site";
import { JsonLd, breadcrumbs, place } from "@/lib/jsonld";

export const metadata = {
  title: "Location — Candidasa, Karangasem, East Bali | Orlowsky Discovery",
  description: "Orlowsky Discovery Hotel is on the quiet seafront of Candidasa, 1.5 hours from Bali Airport. Near Besakih Temple, Tirta Gangga, Amed, and Tulamben dive sites.",
  alternates: {
    canonical: `${SITE_URL}/location`,
    languages: {
      "en": `${SITE_URL}/location`,
      "ru": `${SITE_URL}/ru/location`,
      "x-default": `${SITE_URL}/location`,
    },
  },
  openGraph: {
    title: "Location — Candidasa, Karangasem, East Bali | Orlowsky Discovery",
    description: "Orlowsky Discovery Hotel is on the quiet seafront of Candidasa, 1.5 hours from Bali Airport. Near Besakih Temple, Tirta Gangga, Amed, and Tulamben dive sites.",
    url: `${SITE_URL}/location`,
    images: [{ url: `${SITE_URL}/images/gallery/orlowsky-hotel-terrace-view-candidasa-islands.webp`, width: 1200, height: 630 }],
  },
};

export default function LocationPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/location.json");

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        place({
          path: "/location",
          name: "Candidasa, Karangasem, East Bali",
          description: "Orlowsky Discovery Hotel is on the quiet seafront of Candidasa, 1.5 hours from Bali Airport, near Besakih Temple, Tirta Gangga, Amed, and Tulamben.",
          image: `${SITE_URL}/images/gallery/orlowsky-hotel-terrace-view-candidasa-islands.webp`,
          locale: "en",
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Location", path: "/location" },
        ]),
      ]} />
      <PageHero
        image="/images/gallery/orlowsky-hotel-terrace-view-candidasa-islands.webp"
        imageAlt="Scenic coastline of Candidasa, East Bali"
        heading={data.heading}
        subtext={data.subtext}
      />
      <LocationDetail data={data} />
      <MapLocation contact={contact} />
    </InnerPageLayout>
  );
}
