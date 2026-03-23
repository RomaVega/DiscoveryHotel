import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { WeddingsDetail } from "@/components/sections/WeddingsDetail";

export const metadata = {
  title: "Destination Weddings in Bali — Candidasa Oceanfront | Orlowsky Discovery",
  description: "Beachfront wedding venue in Candidasa, East Bali. European and traditional Balinese ceremonies, full catering, accommodation, and transfers at Orlowsky Discovery Hotel.",
};

export default function WeddingsPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/weddings.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/experiences/experiences-events.jpg"
        imageAlt="Oceanfront wedding ceremony setup in Bali"
        heading={data.heading}
        subtext={data.subtext}
      />
      <WeddingsDetail data={data} />
    </InnerPageLayout>
  );
}
