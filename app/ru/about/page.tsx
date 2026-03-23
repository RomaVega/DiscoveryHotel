import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { AboutDetail } from "@/components/sections/AboutDetail";

export const metadata = {
  title: "Об Отеле — Orlowsky Discovery Hotel, Кандидаса, Восточный Бали",
  description: "Бутик-отель на берегу моря в Кандидасе, Карангасем. Виллы с бассейном, тропические сады, аюрведический спа и ресторан у океана.",
  alternates: {
    canonical: `${SITE_URL}/ru/about`,
    languages: {
      "en": `${SITE_URL}/about`,
      "ru": `${SITE_URL}/ru/about`,
      "x-default": `${SITE_URL}/about`,
    },
  },
  openGraph: {
    title: "Об Отеле — Orlowsky Discovery Hotel, Кандидаса, Восточный Бали",
    description: "Бутик-отель на берегу моря в Кандидасе, Карангасем. Виллы с бассейном, тропические сады, аюрведический спа и ресторан у океана.",
    url: `${SITE_URL}/ru/about`,
    images: [{ url: `${SITE_URL}/images/gallery/g4.jpg`, width: 1200, height: 630 }],
  },
};

export default function AboutRuPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/about.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/welcome/Image.png"
        imageAlt="Tropical garden and pool area of the hotel"
        heading={data.heading}
        subtext={data.subtext}
      />
      <AboutDetail data={data} />
    </InnerPageLayout>
  );
}
