import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { LocationDetail } from "@/components/sections/LocationDetail";
import { MapLocation } from "@/components/sections/MapLocation";

export const metadata = {
  title: "Расположение — Кандидаса, Карангасем, Восточный Бали | Orlowsky Discovery",
  description: "Orlowsky Discovery Hotel расположен на тихой набережной Кандидасы, 1,5 часа от аэропорта Бали. Рядом с храмом Бесаких, Тирта Гангга и дайв-сайтами Туламбена.",
  alternates: {
    canonical: `${SITE_URL}/ru/location`,
    languages: {
      "en": `${SITE_URL}/location`,
      "ru": `${SITE_URL}/ru/location`,
      "x-default": `${SITE_URL}/location`,
    },
  },
  openGraph: {
    title: "Расположение — Кандидаса, Карангасем, Восточный Бали | Orlowsky Discovery",
    description: "Orlowsky Discovery Hotel расположен на тихой набережной Кандидасы, 1,5 часа от аэропорта Бали. Рядом с храмом Бесаких, Тирта Гангга и дайв-сайтами Туламбена.",
    url: `${SITE_URL}/ru/location`,
    images: [{ url: `${SITE_URL}/images/gallery/g6.jpg`, width: 1200, height: 630 }],
  },
};

export default function LocationRuPage() {
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
