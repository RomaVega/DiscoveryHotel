import { SITE_URL } from "@/lib/site";
import { getSpaPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { SpaDetail } from "@/components/sections/SpaDetail";

export const metadata = {
  title: "Аюрведический спа и балийский массаж — Кандидаса, Бали | Orlowsky Discovery",
  description: "Аутентичная Панчакарма, Широдхара и традиционный балийский массаж от терапевтов из Кералы. Ежедневно 09:00–21:00 в Orlowsky Discovery Hotel, Кандидаса.",
  alternates: {
    canonical: `${SITE_URL}/ru/spa`,
    languages: {
      "en": `${SITE_URL}/spa`,
      "ru": `${SITE_URL}/ru/spa`,
      "x-default": `${SITE_URL}/spa`,
    },
  },
  openGraph: {
    title: "Аюрведический спа и балийский массаж — Кандидаса, Бали | Orlowsky Discovery",
    description: "Аутентичная Панчакарма, Широдхара и традиционный балийский массаж от терапевтов из Кералы. Ежедневно 09:00–21:00 в Orlowsky Discovery Hotel, Кандидаса.",
    url: `${SITE_URL}/ru/spa`,
    images: [{ url: `${SITE_URL}/images/gallery/g3.jpg`, width: 1200, height: 630 }],
  },
};

export default function SpaRuPage() {
  const data = getSpaPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image={data.image}
        imageAlt={data.imageAlt}
        heading={data.heading}
        subtext={data.subtext}
      />
      <SpaDetail data={data} />
    </InnerPageLayout>
  );
}
