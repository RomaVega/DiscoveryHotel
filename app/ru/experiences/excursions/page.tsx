import { SITE_URL } from "@/lib/site";
import { getContactData, getExcursionsPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ExcursionsDetail } from "@/components/sections/ExcursionsDetail";
import { JsonLd, breadcrumbs, service } from "@/lib/jsonld";

export const metadata = {
  title: "Экскурсии по Восточному Бали — Храмы, Рисовые Террасы и Водопады",
  description: "Туры к храму Бесаких, рисовым террасам, водопадам и деревне Тенганан с местными гидами. Однодневные и полудневные экскурсии из Orlowsky Discovery Hotel.",
  alternates: {
    canonical: `${SITE_URL}/ru/experiences/excursions`,
    languages: {
      "en": `${SITE_URL}/experiences/excursions`,
      "ru": `${SITE_URL}/ru/experiences/excursions`,
      "x-default": `${SITE_URL}/experiences/excursions`,
    },
  },
  openGraph: {
    title: "Экскурсии по Восточному Бали — Храмы, Рисовые Террасы и Водопады",
    description: "Туры к храму Бесаких, рисовым террасам, водопадам и деревне Тенганан с местными гидами. Однодневные и полудневные экскурсии из Orlowsky Discovery Hotel.",
    url: `${SITE_URL}/ru/experiences/excursions`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-excursions.webp`, width: 1200, height: 630 }],
  },
};

export default function ExcursionsRuPage() {
  const contact = getContactData();
  const data = getExcursionsPageData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        service({
          path: "/ru/experiences/excursions",
          name: "Экскурсии по Восточному Бали — храмы, террасы, водопады",
          description: "Туры к храму Бесаких, вулкану Кинтамани, в Убуд, к рисовым террасам Тегаллаланг и скрытым водопадам Восточного Бали.",
          image: `${SITE_URL}/images/experiences/experiences-excursions.webp`,
          serviceType: "Guided Tours",
          category: "Туристическая активность",
          locale: "ru",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Впечатления", path: "/ru/experiences" },
          { name: "Экскурсии", path: "/ru/experiences/excursions" },
        ]),
      ]} />
      <PageHero
        image="/images/experiences/experiences-excursions.webp"
        imageAlt="Bali temple with lush tropical gardens"
        imageClassName="lg:object-[50%_25%]"
        heading={data.heading}
        subtext={data.subtext}
      />
      <ExcursionsDetail data={data} />
    </InnerPageLayout>
  );
}
