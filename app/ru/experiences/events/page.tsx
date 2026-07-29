import { SITE_URL } from "@/lib/site";
import { getContactData, getEventsPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { EventsDetail } from "@/components/sections/EventsDetail";
import { JsonLd, breadcrumbs, service } from "@/lib/jsonld";

export const metadata = {
  title: "Свадьбы и Мероприятия на Бали — Orlowsky Discovery Hotel, Чандидаса",
  description: "Свадьбы, юбилеи и корпоративные мероприятия на площадке у океана. Европейские и балийские церемонии, кейтеринг и профессиональная организация.",
  alternates: {
    canonical: `${SITE_URL}/ru/experiences/events`,
    languages: {
      "en": `${SITE_URL}/experiences/events`,
      "ru": `${SITE_URL}/ru/experiences/events`,
      "x-default": `${SITE_URL}/experiences/events`,
    },
  },
  openGraph: {
    title: "Свадьбы и Мероприятия на Бали — Orlowsky Discovery Hotel, Чандидаса",
    description: "Свадьбы, юбилеи и корпоративные мероприятия на площадке у океана. Европейские и балийские церемонии, кейтеринг и профессиональная организация.",
    url: `${SITE_URL}/ru/experiences/events`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-events.webp`, width: 1200, height: 630 }],
  },
};

export default function EventsRuPage() {
  const contact = getContactData();
  const data = getEventsPageData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        service({
          path: "/ru/experiences/events",
          name: "Мероприятия и торжества — площадка на берегу океана в Чандидасе",
          description: "Свадьбы, юбилеи, корпоративные мероприятия и приватные ужины на нашей площадке у океана. До 200 гостей.",
          image: `${SITE_URL}/images/experiences/experiences-events.webp`,
          serviceType: "Event Venue",
          category: "Организация мероприятий",
          locale: "ru",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Впечатления", path: "/ru/experiences" },
          { name: "Мероприятия", path: "/ru/experiences/events" },
        ]),
      ]} />
      <PageHero
        image="/images/experiences/experiences-events.webp"
        imageAlt="Elegant outdoor event setup with ocean backdrop"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <EventsDetail data={data} />
    </InnerPageLayout>
  );
}
