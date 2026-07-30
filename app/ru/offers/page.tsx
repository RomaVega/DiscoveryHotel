import { SITE_URL } from "@/lib/site";
import { getHomePageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { SpecialOffers } from "@/components/sections/SpecialOffers";
import { JsonLd, breadcrumbs, webPage } from "@/lib/jsonld";

export const metadata = {
  title: "Спецпредложения и Скидки — Orlowsky Discovery Hotel, Бали",
  description: "Скидка 20% при раннем бронировании и пакет для молодожёнов с романтическим ужином и спа. Прямое бронирование в Orlowsky Discovery Hotel, Чандидаса.",
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
    description: "Скидка 20% при раннем бронировании и пакет для молодожёнов с романтическим ужином и спа. Прямое бронирование в Orlowsky Discovery Hotel, Чандидаса.",
    url: `${SITE_URL}/ru/offers`,
    images: [{ url: `${SITE_URL}/images/offers/offers-og-beach-parasols.webp`, width: 1200, height: 630 }],
  },
};

export default function OffersRuPage() {
  const data = getHomePageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        webPage({
          path: "/ru/offers",
          name: "Спецпредложения и пакеты — Orlowsky Discovery Hotel, Бали",
          description: "Ранние тарифы, пакеты для молодожёнов и скидки за длительное проживание в Orlowsky Discovery Hotel, Чандидаса, Восточный Бали.",
          image: `${SITE_URL}/images/offers/offers-og-beach-parasols.webp`,
          locale: "ru",
          type: "CollectionPage",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Спецпредложения", path: "/ru/offers" },
        ]),
      ]} />
      <PageHero
        image="/images/offers/offers-hero-beach-parasols.webp"
        imageAlt="Зонты и шезлонги с батиковыми подушками на пляже отеля, впереди — бирюзовое море Бали"
        heading={data.offers.heading}
        subtext={data.offers.subtext}
        noOverlay
      />
      <SpecialOffers data={data.offers} hideHeading />
    </InnerPageLayout>
  );
}
