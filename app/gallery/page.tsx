import { getHomePageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { SITE_URL } from "@/lib/site";
import { JsonLd, breadcrumbs, webPage } from "@/lib/jsonld";

export const metadata = {
  title: "Photo Gallery — Orlowsky Discovery Hotel, Candidasa, Bali",
  description: "Photos of Orlowsky Discovery Hotel — pool villas, tropical gardens, oceanfront restaurant, Ayurvedic spa, and the beaches of Candidasa, East Bali.",
  alternates: {
    canonical: `${SITE_URL}/gallery`,
    languages: {
      "en": `${SITE_URL}/gallery`,
      "ru": `${SITE_URL}/ru/gallery`,
      "x-default": `${SITE_URL}/gallery`,
    },
  },
  openGraph: {
    title: "Photo Gallery — Orlowsky Discovery Hotel, Candidasa, Bali",
    description: "Photos of Orlowsky Discovery Hotel — pool villas, tropical gardens, oceanfront restaurant, Ayurvedic spa, and the beaches of Candidasa, East Bali.",
    url: `${SITE_URL}/gallery`,
    images: [{ url: `${SITE_URL}/images/gallery/gallery-hero-orlowsky-discovery-hotel-candidasa.webp`, width: 1200, height: 630 }],
  },
};

export default function GalleryPage() {
  const data = getHomePageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        webPage({
          path: "/gallery",
          name: "Photo Gallery — Orlowsky Discovery Hotel, Candidasa, Bali",
          description: "Photos of Orlowsky Discovery Hotel — pool villas, tropical gardens, oceanfront restaurant, Ayurvedic spa, and the beaches of Candidasa.",
          image: `${SITE_URL}/images/gallery/gallery-hero-orlowsky-discovery-hotel-candidasa.webp`,
          locale: "en",
          type: "CollectionPage",
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ]),
      ]} />
      <PageHero
        image="/images/gallery/gallery-hero-orlowsky-discovery-hotel-candidasa.webp"
        imageAlt="Aerial view of Orlowsky Discovery Hotel, Candidasa, East Bali"
        heading={data.galleryPreview.heading}
        subtext={data.galleryPreview.subtext}
        noOverlay
      />
      <GalleryPreview data={data.galleryPreview} defaultExpanded hideHeading />
    </InnerPageLayout>
  );
}
