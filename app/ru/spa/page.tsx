import { SITE_URL, OG_IMAGE } from "@/lib/site";
import { getSpaPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { SpaDetail } from "@/components/sections/SpaDetail";
import { JsonLd, breadcrumbs, service } from "@/lib/jsonld";

export const metadata = {
  title: "Аюрведический спа и балийский массаж — Чандидаса, Бали | Orlowsky Discovery",
  description: "Аутентичная Панчакарма, Широдхара и традиционный балийский массаж от терапевтов из Кералы. Ежедневно 09:00–21:00 в Orlowsky Discovery Hotel, Чандидаса.",
  alternates: {
    canonical: `${SITE_URL}/ru/spa`,
    languages: {
      "en": `${SITE_URL}/spa`,
      "ru": `${SITE_URL}/ru/spa`,
      "x-default": `${SITE_URL}/spa`,
    },
  },
  openGraph: {
    title: "Аюрведический спа и балийский массаж — Чандидаса, Бали | Orlowsky Discovery",
    description: "Аутентичная Панчакарма, Широдхара и традиционный балийский массаж от терапевтов из Кералы. Ежедневно 09:00–21:00 в Orlowsky Discovery Hotel, Чандидаса.",
    url: `${SITE_URL}/ru/spa`,
    images: [{ url: `${SITE_URL}/images/gallery/orlowsky-hotel-yoga-platform-ocean.webp`, width: 1200, height: 630 }],
  },
};

export default function SpaRuPage() {
  const data = getSpaPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        service({
          path: "/ru/spa",
          name: "Аюрведический спа и балийский массаж — Orlowsky Discovery",
          description: "Аутентичная Панчакарма, Широдхара и традиционный балийский массаж от терапевтов из Кералы. Ежедневно 09:00–21:00.",
          image: OG_IMAGE,
          serviceType: "Spa",
          category: "Здоровье и красота",
          locale: "ru",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Спа", path: "/ru/spa" },
        ]),
      ]} />
      <PageHero
        image={data.image}
        imageAlt={data.imageAlt}
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <SpaDetail data={data} />
    </InnerPageLayout>
  );
}
