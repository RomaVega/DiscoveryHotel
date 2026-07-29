import { SITE_URL } from "@/lib/site";
import { getContactData, getDivingPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { DivingDetail } from "@/components/sections/DivingDetail";
import { JsonLd, breadcrumbs, service } from "@/lib/jsonld";

export const metadata = {
  title: "Дайвинг и снорклинг в Восточном Бали — Туламбен и риф Чандидасы",
  description: "Погружение на затонувший корабль USAT Liberty в Туламбене, коралловый риф Чандидасы и манты на Нуса-Пениде. Программы для начинающих и опытных дайверов.",
  alternates: {
    canonical: `${SITE_URL}/ru/experiences/diving`,
    languages: {
      "en": `${SITE_URL}/experiences/diving`,
      "ru": `${SITE_URL}/ru/experiences/diving`,
      "x-default": `${SITE_URL}/experiences/diving`,
    },
  },
  openGraph: {
    title: "Дайвинг и снорклинг в Восточном Бали — Туламбен и риф Чандидасы",
    description: "Погружение на затонувший корабль USAT Liberty в Туламбене, коралловый риф Чандидасы и манты на Нуса-Пениде. Программы для начинающих и опытных дайверов.",
    url: `${SITE_URL}/ru/experiences/diving`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-diving.webp`, width: 1200, height: 630 }],
  },
};

export default function DivingRuPage() {
  const contact = getContactData();
  const data = getDivingPageData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        service({
          path: "/ru/experiences/diving",
          name: "Дайвинг и снорклинг в Восточном Бали — Туламбен и риф Чандидасы",
          description: "Погружение на затонувший корабль USAT Liberty в Туламбене, коралловый риф Чандидасы и манты на Нуса-Пениде. Программы для начинающих и опытных дайверов.",
          image: `${SITE_URL}/images/experiences/experiences-diving.webp`,
          serviceType: "Diving Tours",
          category: "Туристическая активность",
          locale: "ru",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Впечатления", path: "/ru/experiences" },
          { name: "Дайвинг", path: "/ru/experiences/diving" },
        ]),
      ]} />
      <PageHero
        image="/images/experiences/experiences-diving.webp"
        imageAlt="Colorful coral reef underwater in Bali"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <DivingDetail data={data} />
    </InnerPageLayout>
  );
}
