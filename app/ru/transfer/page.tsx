import { SITE_URL, OG_IMAGE } from "@/lib/site";
import { getTransferPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { TransferDetail } from "@/components/sections/TransferDetail";
import { JsonLd, breadcrumbs, service } from "@/lib/jsonld";

export const metadata = {
  title: "Трансфер из Аэропорта Бали в Кандидасу — Orlowsky Discovery Hotel",
  description: "Частный трансфер из аэропорта Нгурах-Рай в Кандидасу за $40 в одну сторону. Кондиционер, вода и англоговорящий водитель. Бронирование через отель.",
  alternates: {
    canonical: `${SITE_URL}/ru/transfer`,
    languages: {
      "en": `${SITE_URL}/transfer`,
      "ru": `${SITE_URL}/ru/transfer`,
      "x-default": `${SITE_URL}/transfer`,
    },
  },
  openGraph: {
    title: "Трансфер из Аэропорта Бали в Кандидасу — Orlowsky Discovery Hotel",
    description: "Частный трансфер из аэропорта Нгурах-Рай в Кандидасу за $40 в одну сторону. Кондиционер, вода и англоговорящий водитель. Бронирование через отель.",
    url: `${SITE_URL}/ru/transfer`,
    images: [{ url: `${SITE_URL}/images/hero/hero-og.jpg`, width: 1200, height: 630 }],
  },
};

export default function TransferRuPage() {
  const data = getTransferPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        service({
          path: "/ru/transfer",
          name: "Трансфер из аэропорта Бали в Кандидасу — Orlowsky Discovery",
          description: "Частный трансфер из аэропорта Нгурах-Рай (DPS) в Кандидасу. Фиксированные тарифы, кондиционер, англоговорящий водитель, 24/7.",
          image: OG_IMAGE,
          serviceType: "Airport Shuttle",
          category: "Транспорт",
          locale: "ru",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Трансфер", path: "/ru/transfer" },
        ]),
      ]} />
      <PageHero
        image={data.image}
        imageAlt={data.imageAlt}
        heading={data.heading}
        subtext={data.subtext}
      />
      <TransferDetail data={data} />
    </InnerPageLayout>
  );
}
