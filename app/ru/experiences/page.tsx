import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ExperiencesHub } from "@/components/sections/ExperiencesHub";

export const metadata = {
  title: "Впечатления в Восточном Бали — Храмы, Вулканы, Дайвинг и Спа | Orlowsky Discovery",
  description: "Экскурсии к храмам, треккинг к вулканам, дайвинг в Туламбене и Нуса-Пениде, аюрведический спа и аренда авто — всё организуется через отель.",
  alternates: {
    canonical: `${SITE_URL}/ru/experiences`,
    languages: {
      "en": `${SITE_URL}/experiences`,
      "ru": `${SITE_URL}/ru/experiences`,
      "x-default": `${SITE_URL}/experiences`,
    },
  },
  openGraph: {
    title: "Впечатления в Восточном Бали — Храмы, Вулканы, Дайвинг и Спа | Orlowsky Discovery",
    description: "Экскурсии к храмам, треккинг к вулканам, дайвинг в Туламбене и Нуса-Пениде, аюрведический спа и аренда авто — всё организуется через отель.",
    url: `${SITE_URL}/ru/experiences`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-excursions.jpg`, width: 1200, height: 630 }],
  },
};

export default function ExperiencesRuPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/experiences.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/experiences/experiences-excursions.jpg"
        imageAlt="Lush green rice terraces in East Bali"
        heading={data.heading}
        subtext={data.subtext}
      />
      <ExperiencesHub data={data} />
    </InnerPageLayout>
  );
}
