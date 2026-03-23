import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { FaqDetail } from "@/components/sections/FaqDetail";

export const metadata = {
  title: "FAQ — Orlowsky Discovery Hotel, Candidasa, Bali",
  description: "Frequently asked questions about Orlowsky Discovery Hotel — check-in, airport transfer, payment, visa, room types, spa, and activities in Candidasa, East Bali.",
};

export default function FaqPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/faq.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/gallery/g7.jpg"
        imageAlt="Hotel lobby and reception area"
        heading={data.heading}
      />
      <FaqDetail data={data} />
    </InnerPageLayout>
  );
}
