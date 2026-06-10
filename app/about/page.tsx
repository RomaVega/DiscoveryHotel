import { getContactData, getAboutPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { AboutDetail } from "@/components/sections/AboutDetail";
import { SITE_URL } from "@/lib/site";
import { JsonLd, breadcrumbs, webPage } from "@/lib/jsonld";

export const metadata = {
  title: "About Orlowsky Discovery Hotel — Candidasa, East Bali",
  description: "Boutique seafront hotel in Candidasa, Karangasem. Pool villas, tropical gardens, Ayurvedic spa, and oceanfront dining. 5-star Balinese hospitality away from the crowds.",
  alternates: {
    canonical: `${SITE_URL}/about`,
    languages: {
      "en": `${SITE_URL}/about`,
      "ru": `${SITE_URL}/ru/about`,
      "x-default": `${SITE_URL}/about`,
    },
  },
  openGraph: {
    title: "About Orlowsky Discovery Hotel — Candidasa, East Bali",
    description: "Boutique seafront hotel in Candidasa, Karangasem. Pool villas, tropical gardens, Ayurvedic spa, and oceanfront dining. 5-star Balinese hospitality away from the crowds.",
    url: `${SITE_URL}/about`,
    images: [{ url: `${SITE_URL}/images/welcome/Image.webp`, width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  const contact = getContactData();
  const data = getAboutPageData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        webPage({
          path: "/about",
          name: "About Orlowsky Discovery Hotel — Candidasa, East Bali",
          description: "Boutique seafront hotel in Candidasa, Karangasem. Pool villas, tropical gardens, Ayurvedic spa, and oceanfront dining.",
          image: `${SITE_URL}/images/welcome/Image.webp`,
          locale: "en",
          type: "AboutPage",
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]),
      ]} />
      <PageHero
        image="/images/welcome/Image.webp"
        imageDesktop="/images/gallery/orlowsky-hotel-pool-terrace-ocean.webp"
        imageAlt="Tropical garden path to the ocean at Orlowsky Discovery Hotel, Candidasa"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <AboutDetail data={data} />
    </InnerPageLayout>
  );
}
