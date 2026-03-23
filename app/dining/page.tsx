import { getDiningPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { DiningDetail } from "@/components/sections/DiningDetail";

export const metadata = {
  title: "Oceanfront Restaurant & Bar — Candidasa, Bali | Orlowsky Discovery",
  description: "Fresh seafood, Balinese and international cuisine at our semi-circular seaside restaurant. Open daily 07:00–22:00. Orlowsky Discovery Hotel, Candidasa.",
};

export default function DiningPage() {
  const data = getDiningPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/gallery/g9.jpg"
        imageAlt="Oceanfront restaurant at Orlowsky Discovery Hotel"
        heading={data.heading}
        subtext={data.subtext}
      />
      <DiningDetail data={data} />
    </InnerPageLayout>
  );
}
