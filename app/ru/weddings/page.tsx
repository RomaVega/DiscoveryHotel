import { SITE_URL } from "@/lib/site";
import { getContactData, getWeddingsPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { WeddingsDetail } from "@/components/sections/WeddingsDetail";
import { JsonLd, breadcrumbs, service } from "@/lib/jsonld";

export const metadata = {
  title: "Свадьба на Бали — Orlowsky Discovery Hotel, Чандидаса, Восточный Бали",
  description: "Европейские и традиционные балийские свадебные церемонии на берегу океана. Полный кейтеринг, декор и организация от команды отеля.",
  alternates: {
    canonical: `${SITE_URL}/ru/weddings`,
    languages: {
      "en": `${SITE_URL}/weddings`,
      "ru": `${SITE_URL}/ru/weddings`,
      "x-default": `${SITE_URL}/weddings`,
    },
  },
  openGraph: {
    title: "Свадьба на Бали — Orlowsky Discovery Hotel, Чандидаса, Восточный Бали",
    description: "Европейские и традиционные балийские свадебные церемонии на берегу океана. Полный кейтеринг, декор и организация от команды отеля.",
    url: `${SITE_URL}/ru/weddings`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-events.webp`, width: 1200, height: 630 }],
  },
};

export default function WeddingsRuPage() {
  const contact = getContactData();
  const data = getWeddingsPageData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        service({
          path: "/ru/weddings",
          name: "Свадьбы на Бали — Чандидаса, набережная океана",
          description: "Свадебная площадка на берегу океана в Чандидасе, Восточный Бали. Европейские и традиционные балийские церемонии, кейтеринг, размещение и трансферы.",
          image: `${SITE_URL}/images/experiences/experiences-events.webp`,
          serviceType: "Wedding Venue",
          category: "Площадка для мероприятий",
          locale: "ru",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Свадьбы", path: "/ru/weddings" },
        ]),
      ]} />
      <PageHero
        image="/images/experiences/experiences-events.webp"
        imageAlt="Oceanfront wedding ceremony setup in Bali"
        heading={data.heading}
        subtext={data.subtext}
      />
      <WeddingsDetail data={data} />
    </InnerPageLayout>
  );
}
