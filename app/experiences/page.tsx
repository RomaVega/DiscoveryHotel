import { getContactData, getExperiencesHubData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ExperiencesHub } from "@/components/sections/ExperiencesHub";
import { SITE_URL } from "@/lib/site";
import { JsonLd, breadcrumbs, webPage } from "@/lib/jsonld";

export const metadata = {
  title: "Experiences in East Bali — Tours, Diving, Spa | Orlowsky Discovery",
  description: "Guided day tours, diving at Tulamben and Nusa Penida, Ayurvedic spa, oceanfront events, and car rental — all available from Orlowsky Discovery Hotel, Candidasa.",
  alternates: {
    canonical: `${SITE_URL}/experiences`,
    languages: {
      "en": `${SITE_URL}/experiences`,
      "ru": `${SITE_URL}/ru/experiences`,
      "x-default": `${SITE_URL}/experiences`,
    },
  },
  openGraph: {
    title: "Experiences in East Bali — Tours, Diving, Spa | Orlowsky Discovery",
    description: "Guided day tours, diving at Tulamben and Nusa Penida, Ayurvedic spa, oceanfront events, and car rental — all available from Orlowsky Discovery Hotel, Candidasa.",
    url: `${SITE_URL}/experiences`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-excursions.webp`, width: 1200, height: 630 }],
  },
};

export default function ExperiencesPage() {
  const contact = getContactData();
  const data = getExperiencesHubData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        webPage({
          path: "/experiences",
          name: "Experiences in East Bali — Tours, Diving, Spa",
          description: "Guided day tours, diving at Tulamben and Nusa Penida, Ayurvedic spa, oceanfront events, and car rental from Orlowsky Discovery Hotel.",
          image: `${SITE_URL}/images/experiences/experiences-excursions.webp`,
          locale: "en",
          type: "CollectionPage",
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Experiences", path: "/experiences" },
        ]),
      ]} />
      <PageHero
        image="/images/experiences/experiences-excursions.webp"
        imageAlt="Lush green rice terraces in East Bali"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <ExperiencesHub data={data} />
    </InnerPageLayout>
  );
}
