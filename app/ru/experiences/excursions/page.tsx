import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ExcursionsDetail } from "@/components/sections/ExcursionsDetail";

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
    images: [{ url: `${SITE_URL}/images/experiences/experiences-excursions.jpg`, width: 1200, height: 630 }],
  },
};

export default function ExcursionsRuPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/excursions.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/experiences/experiences-excursions.jpg"
        imageAlt="Bali temple with lush tropical gardens"
        heading={data.heading}
        subtext={data.subtext}
      />
      <ExcursionsDetail data={data} />
    </InnerPageLayout>
  );
}
