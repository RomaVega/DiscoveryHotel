import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ExcursionsDetail } from "@/components/sections/ExcursionsDetail";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Bali Day Tours & Excursions from Candidasa — Orlowsky Discovery",
  description: "Guided tours to Besakih Temple, Kintamani volcano, Ubud, Tegallalang rice terraces, and hidden waterfalls in East Bali. Book from Orlowsky Discovery Hotel, Candidasa.",
  alternates: {
    canonical: `${SITE_URL}/experiences/excursions`,
  },
  openGraph: {
    title: "Bali Day Tours & Excursions from Candidasa — Orlowsky Discovery",
    description: "Guided tours to Besakih Temple, Kintamani volcano, Ubud, Tegallalang rice terraces, and hidden waterfalls in East Bali. Book from Orlowsky Discovery Hotel, Candidasa.",
    url: `${SITE_URL}/experiences/excursions`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-excursions.jpg`, width: 1200, height: 630 }],
  },
};

export default function ExcursionsPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/excursions.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/experiences/experiences-excursions.jpg"
        imageAlt="Bali temple with lush tropical gardens"
        heading={data.heading}
        subtext={data.subtext}
      />
      <ExcursionsDetail data={data} />
    </InnerPageLayout>
  );
}
