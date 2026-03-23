import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { EventsDetail } from "@/components/sections/EventsDetail";

export const metadata = {
  title: "Events & Celebrations — Oceanfront Venue in Candidasa, Bali",
  description: "Weddings, anniversaries, corporate events, and private dinners at our oceanfront venue in Candidasa. Up to 200 guests, European and Balinese ceremony styles.",
};

export default function EventsPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/events.json");

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/experiences/experiences-events.jpg"
        imageAlt="Elegant outdoor event setup with ocean backdrop"
        heading={data.heading}
        subtext={data.subtext}
      />
      <EventsDetail data={data} />
    </InnerPageLayout>
  );
}
