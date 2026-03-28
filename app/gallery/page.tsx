import { getHomePageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Photo Gallery — Orlowsky Discovery Hotel, Candidasa, Bali",
  description: "Photos of Orlowsky Discovery Hotel — pool villas, tropical gardens, oceanfront restaurant, Ayurvedic spa, and the beaches of Candidasa, East Bali.",
  alternates: {
    canonical: `${SITE_URL}/gallery`,
  },
  openGraph: {
    title: "Photo Gallery — Orlowsky Discovery Hotel, Candidasa, Bali",
    description: "Photos of Orlowsky Discovery Hotel — pool villas, tropical gardens, oceanfront restaurant, Ayurvedic spa, and the beaches of Candidasa, East Bali.",
    url: `${SITE_URL}/gallery`,
    images: [{ url: `${SITE_URL}/images/gallery/gallery-hero-orlowsky-discovery-hotel-candidasa.jpg`, width: 1200, height: 630 }],
  },
};

export default function GalleryPage() {
  const data = getHomePageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/gallery/gallery-hero-orlowsky-discovery-hotel-candidasa.jpg"
        imageAlt="Aerial view of Orlowsky Discovery Hotel, Candidasa, East Bali"
        heading={data.galleryPreview.heading}
        subtext={data.galleryPreview.subtext}
        noOverlay
      />
      <GalleryPreview data={data.galleryPreview} defaultExpanded hideHeading />
    </InnerPageLayout>
  );
}
