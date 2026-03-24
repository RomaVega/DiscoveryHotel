import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { WeddingsDetail } from "@/components/sections/WeddingsDetail";

export const metadata = {
  title: "Свадьба на Бали — Orlowsky Discovery Hotel, Кандидаса, Восточный Бали",
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
    title: "Свадьба на Бали — Orlowsky Discovery Hotel, Кандидаса, Восточный Бали",
    description: "Европейские и традиционные балийские свадебные церемонии на берегу океана. Полный кейтеринг, декор и организация от команды отеля.",
    url: `${SITE_URL}/ru/weddings`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-events.jpg`, width: 1200, height: 630 }],
  },
};

export default function WeddingsRuPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/weddings.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/experiences/experiences-events.jpg"
        imageAlt="Oceanfront wedding ceremony setup in Bali"
        heading={data.heading}
        subtext={data.subtext}
      />
      <WeddingsDetail data={data} />
    </InnerPageLayout>
  );
}
