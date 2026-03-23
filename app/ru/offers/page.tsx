import { SITE_URL } from "@/lib/site";
import { getHomePageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { SpecialOffers } from "@/components/sections/SpecialOffers";

export const metadata = {
  title: "Спецпредложения и Скидки — Orlowsky Discovery Hotel, Бали",
  description: "Скидка 20% при раннем бронировании и пакет для молодожёнов с романтическим ужином и спа. Прямое бронирование в Orlowsky Discovery Hotel, Кандидаса.",
  alternates: {
    canonical: `${SITE_URL}/ru/offers`,
    languages: {
      "en": `${SITE_URL}/offers`,
      "ru": `${SITE_URL}/ru/offers`,
      "x-default": `${SITE_URL}/offers`,
    },
  },
  openGraph: {
    title: "Спецпредложения и Скидки — Orlowsky Discovery Hotel, Бали",
    description: "Скидка 20% при раннем бронировании и пакет для молодожёнов с романтическим ужином и спа. Прямое бронирование в Orlowsky Discovery Hotel, Кандидаса.",
    url: `${SITE_URL}/ru/offers`,
    images: [{ url: `${SITE_URL}/images/offers/early-bird.jpg`, width: 1200, height: 630 }],
  },
};

export default function OffersRuPage() {
  const data = getHomePageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/offers/early-bird.jpg"
        imageAlt="Hotel pool at sunrise"
        heading={data.offers.heading}
        subtext={{ en: "Book direct for early bird rates, honeymoon packages, and other exclusive deals at Orlowsky Discovery Hotel, Candidasa, Bali.", ru: "Бронируйте напрямую — ранние цены, медовый месяц и другие эксклюзивные предложения в отеле Orlowsky Discovery, Кандидаса, Бали." }}
      />
      <SpecialOffers data={data.offers} hideHeading />
    </InnerPageLayout>
  );
}
