import { getHomePageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { SpecialOffers } from "@/components/sections/SpecialOffers";

export const metadata = {
  title: "Special Offers & Packages — Orlowsky Discovery Hotel, Bali",
  description: "Early bird rates, honeymoon packages, and long-stay discounts at Orlowsky Discovery Hotel, Candidasa, East Bali. Book direct for the best price.",
};

export default function OffersPage() {
  const data = getHomePageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/offers/early-bird.jpg"
        imageAlt="Hotel pool at sunrise"
        heading={data.offers.heading}
        subtext={{ en: "Book direct for early bird rates, honeymoon packages, and exclusive deals at Orlowsky Discovery Hotel, Candidasa, Bali.", ru: "Бронируйте напрямую — ранние цены, медовый месяц и эксклюзивные предложения в отеле Orlowsky Discovery, Кандидаса, Бали." }}
      />
      <SpecialOffers data={data.offers} />
    </InnerPageLayout>
  );
}
