import { SITE_URL } from "@/lib/site";
import { getContactData, getExperiencesHubData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ExperiencesHub } from "@/components/sections/ExperiencesHub";
import { JsonLd, breadcrumbs, webPage } from "@/lib/jsonld";

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
    images: [{ url: `${SITE_URL}/images/experiences/experiences-excursions.webp`, width: 1200, height: 630 }],
  },
};

export default function ExperiencesRuPage() {
  const contact = getContactData();
  const data = getExperiencesHubData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        webPage({
          path: "/ru/experiences",
          name: "Впечатления в Восточном Бали — экскурсии, дайвинг, спа",
          description: "Экскурсии к храмам, треккинг к вулканам, дайвинг в Туламбене и Нуса-Пениде, аюрведический спа и аренда авто из отеля Orlowsky Discovery.",
          image: `${SITE_URL}/images/experiences/experiences-excursions.webp`,
          locale: "ru",
          type: "CollectionPage",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Впечатления", path: "/ru/experiences" },
        ]),
      ]} />
      <PageHero
        image="/images/experiences/experiences-excursions.webp"
        imageAlt="East Bali experiences — rice terraces, a Balinese temple and Mount Agung volcano"
        imageDesktop="/images/experiences/experiences-bali-temples-volcanoes-diving-spa.webp"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <ExperiencesHub data={data} />
    </InnerPageLayout>
  );
}
