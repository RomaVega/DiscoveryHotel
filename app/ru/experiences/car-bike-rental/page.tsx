import { SITE_URL } from "@/lib/site";
import { getContactData, getCarRentalPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { CarRentalDetail } from "@/components/sections/CarRentalDetail";
import { JsonLd, breadcrumbs, service } from "@/lib/jsonld";

export const metadata = {
  title: "Аренда Авто и Мотоцикла на Бали — Orlowsky Discovery Hotel, Чандидаса",
  description: "Аренда скутера от Rp 20,000/час, автомобиля с водителем или без, и электровелосипедов. Исследуйте Восточный Бали в своём темпе.",
  alternates: {
    canonical: `${SITE_URL}/ru/experiences/car-bike-rental`,
    languages: {
      "en": `${SITE_URL}/experiences/car-bike-rental`,
      "ru": `${SITE_URL}/ru/experiences/car-bike-rental`,
      "x-default": `${SITE_URL}/experiences/car-bike-rental`,
    },
  },
  openGraph: {
    title: "Аренда Авто и Мотоцикла на Бали — Orlowsky Discovery Hotel, Чандидаса",
    description: "Аренда скутера от Rp 20,000/час, автомобиля с водителем или без, и электровелосипедов. Исследуйте Восточный Бали в своём темпе.",
    url: `${SITE_URL}/ru/experiences/car-bike-rental`,
    images: [{ url: `${SITE_URL}/images/rental/rental.webp`, width: 1200, height: 630 }],
  },
};

export default function CarRentalRuPage() {
  const contact = getContactData();
  const data = getCarRentalPageData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        service({
          path: "/ru/experiences/car-bike-rental",
          name: "Аренда авто и мотоцикла в Чандидасе, Восточный Бали",
          description: "Аренда скутера, автомобиля с водителем или без, и электровелосипедов в Чандидасе. Подача транспорта к отелю и возврат.",
          image: `${SITE_URL}/images/rental/rental.webp`,
          serviceType: "Vehicle Rental",
          category: "Транспорт",
          locale: "ru",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Впечатления", path: "/ru/experiences" },
          { name: "Аренда транспорта", path: "/ru/experiences/car-bike-rental" },
        ]),
      ]} />
      <PageHero
        image="/images/rental/scooter-rental-candidasa-bali.webp"
        imageDesktop="/images/rental/rental.webp"
        imageAlt="Scooter rental at Orlowsky Discovery Hotel, Candidasa, Bali"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <CarRentalDetail data={data} />
    </InnerPageLayout>
  );
}
