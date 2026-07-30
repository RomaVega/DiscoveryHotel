import { getHomePageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { SpecialOffers } from "@/components/sections/SpecialOffers";
import { SITE_URL } from "@/lib/site";
import { JsonLd, breadcrumbs, webPage } from "@/lib/jsonld";

export const metadata = {
  title: "Special Offers & Packages — Orlowsky Discovery Hotel, Bali",
  description: "Early bird rates, honeymoon packages, and long-stay discounts at Orlowsky Discovery Hotel, Candidasa, East Bali. Book direct for the best price.",
  alternates: {
    canonical: `${SITE_URL}/offers`,
    languages: {
      "en": `${SITE_URL}/offers`,
      "ru": `${SITE_URL}/ru/offers`,
      "x-default": `${SITE_URL}/offers`,
    },
  },
  openGraph: {
    title: "Special Offers & Packages — Orlowsky Discovery Hotel, Bali",
    description: "Early bird rates, honeymoon packages, and long-stay discounts at Orlowsky Discovery Hotel, Candidasa, East Bali. Book direct for the best price.",
    url: `${SITE_URL}/offers`,
    images: [{ url: `${SITE_URL}/images/offers/offers-og-beach-parasols.webp`, width: 1200, height: 630 }],
  },
};

export default function OffersPage() {
  const data = getHomePageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        webPage({
          path: "/offers",
          name: "Special Offers & Packages — Orlowsky Discovery Hotel, Bali",
          description: "Early bird rates, honeymoon packages, and long-stay discounts at Orlowsky Discovery Hotel, Candidasa, East Bali.",
          image: `${SITE_URL}/images/offers/offers-og-beach-parasols.webp`,
          locale: "en",
          type: "CollectionPage",
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Offers", path: "/offers" },
        ]),
      ]} />
      <PageHero
        image="/images/offers/offers-hero-beach-parasols.webp"
        noOverlay
        imageAlt="Parasols and batik-cushioned loungers on the hotel beach, facing the turquoise Bali Sea"
        heading={data.offers.heading}
        subtext={data.offers.subtext}
      />
      <SpecialOffers data={data.offers} hideHeading />
    </InnerPageLayout>
  );
}
