import { getContactData, getExperiencesHubData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ExperiencesHub } from "@/components/sections/ExperiencesHub";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Experiences in East Bali — Tours, Diving, Spa | Orlowsky Discovery",
  description: "Guided day tours, diving at Tulamben and Nusa Penida, Ayurvedic spa, oceanfront events, and car rental — all available from Orlowsky Discovery Hotel, Candidasa.",
  alternates: {
    canonical: `${SITE_URL}/experiences`,
  },
  openGraph: {
    title: "Experiences in East Bali — Tours, Diving, Spa | Orlowsky Discovery",
    description: "Guided day tours, diving at Tulamben and Nusa Penida, Ayurvedic spa, oceanfront events, and car rental — all available from Orlowsky Discovery Hotel, Candidasa.",
    url: `${SITE_URL}/experiences`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-excursions.jpg`, width: 1200, height: 630 }],
  },
};

export default function ExperiencesPage() {
  const contact = getContactData();
  const data = getExperiencesHubData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/experiences/experiences-excursions.jpg"
        imageAlt="Lush green rice terraces in East Bali"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <ExperiencesHub data={data} />
    </InnerPageLayout>
  );
}
