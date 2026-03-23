import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { FaqDetail } from "@/components/sections/FaqDetail";

export const metadata = {
  title: "Часто Задаваемые Вопросы — Orlowsky Discovery Hotel, Бали",
  description: "Ответы на вопросы о бронировании, номерах, трансфере, дайвинге и спа в Orlowsky Discovery Hotel, Кандидаса, Восточный Бали.",
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
    description: "Ответы на вопросы о бронировании, номерах, трансфере, дайвинге и спа в Orlowsky Discovery Hotel, Кандидаса, Восточный Бали.",
    url: `${SITE_URL}/ru/faq`,
    images: [{ url: `${SITE_URL}/images/hero/hero-main.jpg`, width: 1200, height: 630 }],
  },
};

export default function FaqRuPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/faq.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/gallery/g7.jpg"
        imageAlt="Hotel lobby and reception area"
        heading={data.heading}
      />
      <FaqDetail data={data} />
    </InnerPageLayout>
  );
}
