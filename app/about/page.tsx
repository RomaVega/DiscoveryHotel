import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { AboutDetail } from "@/components/sections/AboutDetail";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "About Orlowsky Discovery Hotel — Candidasa, East Bali",
  description: "Boutique seafront hotel in Candidasa, Karangasem. Pool villas, tropical gardens, Ayurvedic spa, and oceanfront dining. 5-star Balinese hospitality away from the crowds.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Orlowsky Discovery Hotel — Candidasa, East Bali",
    description: "Boutique seafront hotel in Candidasa, Karangasem. Pool villas, tropical gardens, Ayurvedic spa, and oceanfront dining. 5-star Balinese hospitality away from the crowds.",
    url: `${SITE_URL}/about`,
    images: [{ url: `${SITE_URL}/images/welcome/Image.png`, width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/about.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/welcome/Image.png"
        imageAlt="Tropical garden and pool area of the hotel"
        heading={data.heading}
        subtext={data.subtext}
      />
      <AboutDetail data={data} />
    </InnerPageLayout>
  );
}
