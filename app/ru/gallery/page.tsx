import { SITE_URL } from "@/lib/site";
import { getHomePageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { JsonLd, breadcrumbs, webPage } from "@/lib/jsonld";

export const metadata = {
  title: "Фотогалерея — Orlowsky Discovery Hotel, Кандидаса, Бали",
  description: "Виллы, тропические сады, бассейн, ресторан у океана и аюрведический спа в Кандидасе, Восточный Бали. Фотографии отеля.",
  alternates: {
    canonical: `${SITE_URL}/ru/gallery`,
    languages: {
      "en": `${SITE_URL}/gallery`,
      "ru": `${SITE_URL}/ru/gallery`,
      "x-default": `${SITE_URL}/gallery`,
    },
  },
  openGraph: {
    title: "Фотогалерея — Orlowsky Discovery Hotel, Кандидаса, Бали",
    description: "Виллы, тропические сады, бассейн, ресторан у океана и аюрведический спа в Кандидасе, Восточный Бали. Фотографии отеля.",
    url: `${SITE_URL}/ru/gallery`,
    images: [{ url: `${SITE_URL}/images/gallery/gallery-hero-orlowsky-discovery-hotel-candidasa.webp`, width: 1200, height: 630 }],
  },
};

export default function GalleryRuPage() {
  const data = getHomePageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        webPage({
          path: "/ru/gallery",
          name: "Фотогалерея — Orlowsky Discovery Hotel, Кандидаса, Бали",
          description: "Фотографии Orlowsky Discovery Hotel — виллы с бассейном, тропические сады, ресторан у океана, аюрведический спа и пляжи Кандидасы.",
          image: `${SITE_URL}/images/gallery/gallery-hero-orlowsky-discovery-hotel-candidasa.webp`,
          locale: "ru",
          type: "CollectionPage",
        }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Галерея", path: "/ru/gallery" },
        ]),
      ]} />
      <PageHero
        image="/images/gallery/gallery-hero-orlowsky-discovery-hotel-candidasa.webp"
        imageAlt="Aerial view of hotel and tropical gardens"
        heading={data.galleryPreview.heading}
        subtext={data.galleryPreview.subtext}
        noOverlay
      />
      <GalleryPreview data={data.galleryPreview} defaultExpanded hideHeading />
    </InnerPageLayout>
  );
}
