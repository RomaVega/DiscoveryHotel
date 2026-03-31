import { getDiningPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { DiningDetail } from "@/components/sections/DiningDetail";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Oceanfront Restaurant & Bar — Candidasa, Bali | Orlowsky Discovery",
  description: "Fresh seafood, Balinese and international cuisine at our semi-circular seaside restaurant. Open daily 07:00–22:00. Orlowsky Discovery Hotel, Candidasa.",
  alternates: {
    canonical: `${SITE_URL}/dining`,
  },
  openGraph: {
    title: "Oceanfront Restaurant & Bar — Candidasa, Bali | Orlowsky Discovery",
    description: "Fresh seafood, Balinese and international cuisine at our semi-circular seaside restaurant. Open daily 07:00–22:00. Orlowsky Discovery Hotel, Candidasa.",
    url: `${SITE_URL}/dining`,
    images: [{ url: `${SITE_URL}/images/gallery/g9.jpg`, width: 1200, height: 630 }],
  },
};

export default function DiningPage() {
  const data = getDiningPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/dining/Oceanside-restaurant-and-bar.png"
        imageAlt="Oceanfront restaurant and bar at Orlowsky Discovery Hotel"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <DiningDetail data={data} />
    </InnerPageLayout>
  );
}
