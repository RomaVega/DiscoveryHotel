import { SITE_URL } from "@/lib/site";
import { getContactData, getFaqPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { FaqDetail } from "@/components/sections/FaqDetail";
import { JsonLd, breadcrumbs, faqPage } from "@/lib/jsonld";

export const metadata = {
  title: "Часто Задаваемые Вопросы — Orlowsky Discovery Hotel, Бали",
  description: "Ответы на вопросы о бронировании, номерах, трансфере, дайвинге и спа в Orlowsky Discovery Hotel, Чандидаса, Восточный Бали.",
  alternates: {
    canonical: `${SITE_URL}/ru/faq`,
    languages: {
      "en": `${SITE_URL}/faq`,
      "ru": `${SITE_URL}/ru/faq`,
      "x-default": `${SITE_URL}/faq`,
    },
  },
  openGraph: {
    title: "Часто Задаваемые Вопросы — Orlowsky Discovery Hotel, Бали",
    description: "Ответы на вопросы о бронировании, номерах, трансфере, дайвинге и спа в Orlowsky Discovery Hotel, Чандидаса, Восточный Бали.",
    url: `${SITE_URL}/ru/faq`,
    images: [{ url: `${SITE_URL}/images/hero/hero-og.jpg`, width: 1200, height: 630 }],
  },
};

export default function FaqRuPage() {
  const contact = getContactData();
  const data = getFaqPageData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        faqPage(data.items, "ru"),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Вопросы и Ответы", path: "/ru/faq" },
        ]),
      ]} />
      <PageHero
        image="/images/gallery/orlowsky-hotel-pool-terrace-ocean.webp"
        imageAlt="Hotel lobby and reception area"
        heading={data.heading}
      />
      <FaqDetail data={data} />
    </InnerPageLayout>
  );
}
