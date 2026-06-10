import { SITE_URL } from "@/lib/site";
import { getRoomsPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { RoomsDetail } from "@/components/sections/RoomsDetail";
import { JsonLd, breadcrumbs, webPage } from "@/lib/jsonld";

export const metadata = {
  title: "Номера и виллы в Кандидасе, Бали — Orlowsky Discovery Hotel",
  description: "Вилла с бассейном (230 м²) с тремя спальнями или Делюкс Коттедж (46 м²) с видом на сад. Прямое бронирование в Orlowsky Discovery Hotel, Кандидаса, Восточный Бали.",
  alternates: {
    canonical: `${SITE_URL}/ru/rooms`,
    languages: {
      "en": `${SITE_URL}/rooms`,
      "ru": `${SITE_URL}/ru/rooms`,
      "x-default": `${SITE_URL}/rooms`,
    },
  },
  openGraph: {
    title: "Номера и виллы в Кандидасе, Бали — Orlowsky Discovery Hotel",
    description: "Вилла с бассейном (230 м²) с тремя спальнями или Делюкс Коттедж (46 м²) с видом на сад. Прямое бронирование в Orlowsky Discovery Hotel, Кандидаса, Восточный Бали.",
    url: `${SITE_URL}/ru/rooms`,
    images: [{ url: `${SITE_URL}/images/rooms/pool-villa.webp`, width: 1200, height: 630 }],
  },
};

export default function RoomsRuPage() {
  const data = getRoomsPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        webPage({
          path: "/ru/rooms",
          name: "Номера и виллы — Orlowsky Discovery Hotel, Кандидаса",
          description: "Вилла с бассейном и тремя спальнями или Делюкс Коттедж с видом на сад на берегу Кандидасы, Восточный Бали.",
          image: `${SITE_URL}/images/rooms/pool-villa.webp`,
          locale: "ru",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Номера", path: "/ru/rooms" },
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
