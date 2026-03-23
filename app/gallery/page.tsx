import { getHomePageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { GalleryPreview } from "@/components/sections/GalleryPreview";

export const metadata = {
  title: "Photo Gallery — Orlowsky Discovery Hotel, Candidasa, Bali",
  description: "Photos of Orlowsky Discovery Hotel — pool villas, tropical gardens, oceanfront restaurant, Ayurvedic spa, and the beaches of Candidasa, East Bali.",
};

export default function GalleryPage() {
  const data = getHomePageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/gallery/g4.jpg"
        imageAlt="Aerial view of hotel and tropical gardens"
        heading={data.galleryPreview.heading}
        subtext={data.galleryPreview.subtext}
      />
      <GalleryPreview data={data.galleryPreview} defaultExpanded hideHeading />
    </InnerPageLayout>
  );
}
