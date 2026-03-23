import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ExperiencesHub } from "@/components/sections/ExperiencesHub";

export const metadata = {
  title: "Experiences in East Bali — Tours, Diving, Spa | Orlowsky Discovery",
  description: "Guided day tours, diving at Tulamben and Nusa Penida, Ayurvedic spa, oceanfront events, and car rental — all available from Orlowsky Discovery Hotel, Candidasa.",
};

export default function ExperiencesPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/experiences.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/experiences/experiences-excursions.jpg"
        imageAlt="Lush green rice terraces in East Bali"
        heading={data.heading}
        subtext={data.subtext}
      />
      <ExperiencesHub data={data} />
    </InnerPageLayout>
  );
}
