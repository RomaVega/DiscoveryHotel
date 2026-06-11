import { getDiningPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { DiningDetail } from "@/components/sections/DiningDetail";
import { SITE_URL } from "@/lib/site";
import { JsonLd, breadcrumbs, restaurant } from "@/lib/jsonld";

export const metadata = {
  title: "Oceanfront Restaurant & Bar — Candidasa, Bali | Orlowsky Discovery",
  description: "Fresh seafood, Balinese and international cuisine at our semi-circular seaside restaurant. Open daily 07:00–22:00. Orlowsky Discovery Hotel, Candidasa.",
  alternates: {
    canonical: `${SITE_URL}/dining`,
    languages: {
      "en": `${SITE_URL}/dining`,
      "ru": `${SITE_URL}/ru/dining`,
      "x-default": `${SITE_URL}/dining`,
    },
  },
  openGraph: {
    title: "Oceanfront Restaurant & Bar — Candidasa, Bali | Orlowsky Discovery",
    description: "Fresh seafood, Balinese and international cuisine at our semi-circular seaside restaurant. Open daily 07:00–22:00. Orlowsky Discovery Hotel, Candidasa.",
    url: `${SITE_URL}/dining`,
    images: [{ url: `${SITE_URL}/images/dining/oceanside-restaurant-and-bar.webp`, width: 1200, height: 630 }],
  },
};

export default function DiningPage() {
  const data = getDiningPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        restaurant({
          path: "/dining",
          name: "Orlowsky Discovery Restaurant & Bar",
          description: "Oceanfront restaurant serving fresh seafood, Balinese, Indonesian, and international cuisine in Candidasa, East Bali.",
          image: `${SITE_URL}/images/dining/oceanside-restaurant-and-bar.webp`,
          servesCuisine: ["Balinese", "Indonesian", "Seafood", "International"],
          openingHours: "Mo-Su 07:00-22:00",
          locale: "en",
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Dining", path: "/dining" },
        ]),
      ]} />
      <PageHero
        image="/images/gallery/orlowsky-hotel-romantic-heart-arch.webp"
        imageDesktop="/images/gallery/orlowsky-hotel-pool-beach-panorama.webp"
        imageAlt="Oceanfront grounds overlooking the turquoise sea at Orlowsky Discovery Hotel, Candidasa"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <DiningDetail data={data} />
    </InnerPageLayout>
  );
}
