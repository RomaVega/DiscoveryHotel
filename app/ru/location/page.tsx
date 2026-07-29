import { SITE_URL } from "@/lib/site";
import { getContactData, getLocationPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { LocationDetail } from "@/components/sections/LocationDetail";
import { MapLocation } from "@/components/sections/MapLocation";
import { JsonLd, breadcrumbs, place } from "@/lib/jsonld";

export const metadata = {
  title: "Расположение — Чандидаса, Карангасем, Восточный Бали | Orlowsky Discovery",
  description: "Orlowsky Discovery Hotel расположен на тихой набережной Чандидасы, 1,5 часа от аэропорта Бали. Рядом с храмом Бесаких, Тирта Гангга и дайв-сайтами Туламбена.",
  alternates: {
    canonical: `${SITE_URL}/ru/location`,
    languages: {
      "en": `${SITE_URL}/location`,
      "ru": `${SITE_URL}/ru/location`,
      "x-default": `${SITE_URL}/location`,
    },
  },
  openGraph: {
    title: "Расположение — Чандидаса, Карангасем, Восточный Бали | Orlowsky Discovery",
    description: "Orlowsky Discovery Hotel расположен на тихой набережной Чандидасы, 1,5 часа от аэропорта Бали. Рядом с храмом Бесаких, Тирта Гангга и дайв-сайтами Туламбена.",
    url: `${SITE_URL}/ru/location`,
    images: [{ url: `${SITE_URL}/images/gallery/orlowsky-hotel-terrace-view-candidasa-islands.webp`, width: 1200, height: 630 }],
  },
};

export default function LocationRuPage() {
  const contact = getContactData();
  const data = getLocationPageData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        place({
          path: "/ru/location",
          name: "Чандидаса, Карангасем, Восточный Бали",
          description: "Orlowsky Discovery Hotel расположен на тихой набережной Чандидасы, 1,5 часа от аэропорта Бали. Рядом с храмом Бесаких, Тирта Гангга и дайв-сайтами Туламбена.",
          image: `${SITE_URL}/images/gallery/orlowsky-hotel-terrace-view-candidasa-islands.webp`,
          locale: "ru",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Расположение", path: "/ru/location" },
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
