import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { DivingDetail } from "@/components/sections/DivingDetail";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Diving & Snorkeling East Bali — Tulamben & Candidasa Reef",
  description: "Dive the USAT Liberty shipwreck at Tulamben, Candidasa coral reef, and manta rays at Nusa Penida. Beginner to advanced programs from Orlowsky Discovery Hotel.",
  alternates: {
    canonical: `${SITE_URL}/experiences/diving`,
  },
  openGraph: {
    title: "Diving & Snorkeling East Bali — Tulamben & Candidasa Reef",
    description: "Dive the USAT Liberty shipwreck at Tulamben, Candidasa coral reef, and manta rays at Nusa Penida. Beginner to advanced programs from Orlowsky Discovery Hotel.",
    url: `${SITE_URL}/experiences/diving`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-diving.jpg`, width: 1200, height: 630 }],
  },
};

export default function DivingPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/diving.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/experiences/experiences-diving.jpg"
        imageAlt="Colorful coral reef underwater in Bali"
        heading={data.heading}
        subtext={data.subtext}
      />
      <DivingDetail data={data} />
    </InnerPageLayout>
  );
}
