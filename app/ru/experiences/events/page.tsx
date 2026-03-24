import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { EventsDetail } from "@/components/sections/EventsDetail";

export const metadata = {
  title: "Свадьбы и Мероприятия на Бали — Orlowsky Discovery Hotel, Кандидаса",
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
    title: "Свадьбы и Мероприятия на Бали — Orlowsky Discovery Hotel, Кандидаса",
    description: "Свадьбы, юбилеи и корпоративные мероприятия на площадке у океана. Европейские и балийские церемонии, кейтеринг и профессиональная организация.",
    url: `${SITE_URL}/ru/experiences/events`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-events.jpg`, width: 1200, height: 630 }],
  },
};

export default function EventsRuPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/events.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/experiences/experiences-events.jpg"
        imageAlt="Elegant outdoor event setup with ocean backdrop"
        heading={data.heading}
        subtext={data.subtext}
      />
      <EventsDetail data={data} />
    </InnerPageLayout>
  );
}
