import { SITE_URL } from "@/lib/site";
import { getRoomsPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { RoomsDetail } from "@/components/sections/RoomsDetail";

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
    images: [{ url: `${SITE_URL}/images/rooms/pool-villa.jpg`, width: 1200, height: 630 }],
  },
};

export default function RoomsRuPage() {
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
