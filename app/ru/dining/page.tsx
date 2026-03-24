import { SITE_URL } from "@/lib/site";
import { getDiningPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { DiningDetail } from "@/components/sections/DiningDetail";

export const metadata = {
  title: "Ресторан и бар у океана — Кандидаса, Бали | Orlowsky Discovery",
  description: "Свежие морепродукты, балийская и международная кухня в нашем полукруглом ресторане на берегу моря. Ежедневно 07:00–22:00. Orlowsky Discovery Hotel, Кандидаса.",
  alternates: {
    canonical: `${SITE_URL}/ru/dining`,
    languages: {
      "en": `${SITE_URL}/dining`,
      "ru": `${SITE_URL}/ru/dining`,
      "x-default": `${SITE_URL}/dining`,
    },
  },
  openGraph: {
    title: "Ресторан и бар у океана — Кандидаса, Бали | Orlowsky Discovery",
    description: "Свежие морепродукты, балийская и международная кухня в нашем полукруглом ресторане на берегу моря. Ежедневно 07:00–22:00. Orlowsky Discovery Hotel, Кандидаса.",
    url: `${SITE_URL}/ru/dining`,
    images: [{ url: `${SITE_URL}/images/gallery/g9.jpg`, width: 1200, height: 630 }],
  },
};

export default function DiningRuPage() {
  const data = getDiningPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/gallery/g9.jpg"
        imageAlt="Oceanfront restaurant at Orlowsky Discovery Hotel"
        heading={data.heading}
        subtext={data.subtext}
      />
      <DiningDetail data={data} />
    </InnerPageLayout>
  );
}
