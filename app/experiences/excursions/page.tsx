import { getContactData, getExcursionsPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ExcursionsDetail } from "@/components/sections/ExcursionsDetail";
import { SITE_URL } from "@/lib/site";
import { JsonLd, breadcrumbs, service } from "@/lib/jsonld";

export const metadata = {
  title: "Bali Day Tours & Excursions from Candidasa — Orlowsky Discovery",
  description: "Guided tours to Besakih Temple, Kintamani volcano, Ubud, Tegallalang rice terraces, and hidden waterfalls in East Bali. Book from Orlowsky Discovery Hotel, Candidasa.",
  alternates: {
    canonical: `${SITE_URL}/experiences/excursions`,
    languages: {
      "en": `${SITE_URL}/experiences/excursions`,
      "ru": `${SITE_URL}/ru/experiences/excursions`,
      "x-default": `${SITE_URL}/experiences/excursions`,
    },
  },
  openGraph: {
    title: "Bali Day Tours & Excursions from Candidasa — Orlowsky Discovery",
    description: "Guided tours to Besakih Temple, Kintamani volcano, Ubud, Tegallalang rice terraces, and hidden waterfalls in East Bali. Book from Orlowsky Discovery Hotel, Candidasa.",
    url: `${SITE_URL}/experiences/excursions`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-excursions.webp`, width: 1200, height: 630 }],
  },
};

export default function ExcursionsPage() {
  const contact = getContactData();
  const data = getExcursionsPageData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        service({
          path: "/experiences/excursions",
          name: "Bali Day Tours & Excursions from Candidasa",
          description: "Guided tours to Besakih Temple, Kintamani volcano, Ubud, Tegallalang rice terraces, and hidden waterfalls in East Bali.",
          image: `${SITE_URL}/images/experiences/experiences-excursions.webp`,
          serviceType: "Guided Tours",
          category: "Tourist Activity",
          locale: "en",
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Experiences", path: "/experiences" },
          { name: "Excursions", path: "/experiences/excursions" },
        ]),
      ]} />
      <PageHero
        image="/images/experiences/experiences-excursions.webp"
        imageAlt="Bali temple with lush tropical gardens"
        imageClassName="lg:object-[50%_25%]"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <ExcursionsDetail data={data} />
    </InnerPageLayout>
  );
}
