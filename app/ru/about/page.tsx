import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { AboutDetail } from "@/components/sections/AboutDetail";
import { JsonLd, breadcrumbs, webPage } from "@/lib/jsonld";

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
    images: [{ url: `${SITE_URL}/images/gallery/orlowsky-hotel-pool-beach-panorama.webp`, width: 1200, height: 630 }],
  },
};

export default function AboutRuPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/about.json");

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        webPage({
          path: "/ru/about",
          name: "Об отеле Orlowsky Discovery — Кандидаса, Восточный Бали",
          description: "Бутик-отель на берегу моря в Кандидасе, Карангасем. Виллы с бассейном, тропические сады, аюрведический спа и ресторан у океана.",
          image: `${SITE_URL}/images/welcome/Image.webp`,
          locale: "ru",
          type: "AboutPage",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Об Отеле", path: "/ru/about" },
        ]),
      ]} />
      <PageHero
        image="/images/gallery/orlowsky-hotel-pool-terrace-ocean.webp"
        imageAlt="Tropical garden and pool area of the hotel"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <AboutDetail data={data} />
    </InnerPageLayout>
  );
}
