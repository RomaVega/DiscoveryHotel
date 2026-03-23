import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { DivingDetail } from "@/components/sections/DivingDetail";

export const metadata = {
  title: "Дайвинг и снорклинг в Восточном Бали — Туламбен и риф Кандидасы",
  description: "Погружение на затонувший корабль USAT Liberty в Туламбене, коралловый риф Кандидасы и манты на Нуса-Пениде. Программы для начинающих и опытных дайверов.",
  alternates: {
    canonical: `${SITE_URL}/ru/experiences/diving`,
    languages: {
      "en": `${SITE_URL}/experiences/diving`,
      "ru": `${SITE_URL}/ru/experiences/diving`,
      "x-default": `${SITE_URL}/experiences/diving`,
    },
  },
  openGraph: {
    title: "Дайвинг и снорклинг в Восточном Бали — Туламбен и риф Кандидасы",
    description: "Погружение на затонувший корабль USAT Liberty в Туламбене, коралловый риф Кандидасы и манты на Нуса-Пениде. Программы для начинающих и опытных дайверов.",
    url: `${SITE_URL}/ru/experiences/diving`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-diving.jpg`, width: 1200, height: 630 }],
  },
};

export default function DivingRuPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/diving.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/experiences/experiences-diving.jpg"
        imageAlt="Colorful coral reef underwater in Bali"
        heading={data.heading}
        subtext={data.subtext}
      />
      <DivingDetail data={data} />
    </InnerPageLayout>
  );
}
