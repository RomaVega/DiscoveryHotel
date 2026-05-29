import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { FaqDetail } from "@/components/sections/FaqDetail";
import { SITE_URL } from "@/lib/site";
import { JsonLd, breadcrumbs, faqPage } from "@/lib/jsonld";

export const metadata = {
  title: "FAQ — Orlowsky Discovery Hotel, Candidasa, Bali",
  description: "Frequently asked questions about Orlowsky Discovery Hotel — check-in, airport transfer, payment, visa, room types, spa, and activities in Candidasa, East Bali.",
  alternates: {
    canonical: `${SITE_URL}/faq`,
    languages: {
      "en": `${SITE_URL}/faq`,
      "ru": `${SITE_URL}/ru/faq`,
      "x-default": `${SITE_URL}/faq`,
    },
  },
  openGraph: {
    title: "FAQ — Orlowsky Discovery Hotel, Candidasa, Bali",
    description: "Frequently asked questions about Orlowsky Discovery Hotel — check-in, airport transfer, payment, visa, room types, spa, and activities in Candidasa, East Bali.",
    url: `${SITE_URL}/faq`,
    images: [{ url: `${SITE_URL}/images/gallery/orlowsky-hotel-pool-terrace-ocean.webp`, width: 1200, height: 630 }],
  },
};

export default function FaqPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/faq.json");

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        faqPage(data.items, "en"),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]),
      ]} />
      <PageHero
        image="/images/gallery/orlowsky-hotel-pool-terrace-ocean.webp"
        imageAlt="Hotel lobby and reception area"
        heading={data.heading}
      />
      <FaqDetail data={data} />
    </InnerPageLayout>
  );
}
