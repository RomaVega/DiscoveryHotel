import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { CarRentalDetail } from "@/components/sections/CarRentalDetail";
import { JsonLd, breadcrumbs, service } from "@/lib/jsonld";

export const metadata = {
  title: "Аренда Авто и Мотоцикла на Бали — Orlowsky Discovery Hotel, Кандидаса",
  description: "Аренда скутера от Rp 20,000/час, автомобиля с водителем или без, и электровелосипедов. Исследуйте Восточный Бали в своём темпе.",
  alternates: {
    canonical: `${SITE_URL}/ru/experiences/car-rental`,
    languages: {
      "en": `${SITE_URL}/experiences/car-rental`,
      "ru": `${SITE_URL}/ru/experiences/car-rental`,
      "x-default": `${SITE_URL}/experiences/car-rental`,
    },
  },
  openGraph: {
    title: "Аренда Авто и Мотоцикла на Бали — Orlowsky Discovery Hotel, Кандидаса",
    description: "Аренда скутера от Rp 20,000/час, автомобиля с водителем или без, и электровелосипедов. Исследуйте Восточный Бали в своём темпе.",
    url: `${SITE_URL}/ru/experiences/car-rental`,
    images: [{ url: `${SITE_URL}/images/rental/rental.webp`, width: 1200, height: 630 }],
  },
};

export default function CarRentalRuPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/car-rental.json");

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        service({
          path: "/ru/experiences/car-rental",
          name: "Аренда авто и мотоцикла в Кандидасе, Восточный Бали",
          description: "Аренда скутера, автомобиля с водителем или без, и электровелосипедов в Кандидасе. Доставка к отелю и обратно.",
          image: `${SITE_URL}/images/rental/rental.webp`,
          serviceType: "Vehicle Rental",
          category: "Транспорт",
          locale: "ru",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Впечатления", path: "/ru/experiences" },
          { name: "Аренда транспорта", path: "/ru/experiences/car-rental" },
        ]),
      ]} />
      <PageHero
        image="/images/rental/scooter-rental-candidasa-bali.webp"
        imageDesktop="/images/rental/rental.webp"
        imageAlt="Scooter rental at Orlowsky Discovery Hotel, Candidasa, Bali"
        heading={data.heading}
        subtext={data.subtext}
      />
      <CarRentalDetail data={data} />
    </InnerPageLayout>
  );
}
