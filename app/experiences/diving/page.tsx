import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { DivingDetail } from "@/components/sections/DivingDetail";

export const metadata = {
  title: "Diving & Snorkeling East Bali — Tulamben & Candidasa Reef",
  description: "Dive the USAT Liberty shipwreck at Tulamben, Candidasa coral reef, and manta rays at Nusa Penida. Beginner to advanced programs from Orlowsky Discovery Hotel.",
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
