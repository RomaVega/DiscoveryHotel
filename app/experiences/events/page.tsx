import { getContactData, getEventsPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { EventsDetail } from "@/components/sections/EventsDetail";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Events & Celebrations — Oceanfront Venue in Candidasa, Bali",
  description: "Weddings, anniversaries, corporate events, and private dinners at our oceanfront venue in Candidasa. Up to 200 guests, European and Balinese ceremony styles.",
  alternates: {
    canonical: `${SITE_URL}/experiences/events`,
  },
  openGraph: {
    title: "Events & Celebrations — Oceanfront Venue in Candidasa, Bali",
    description: "Weddings, anniversaries, corporate events, and private dinners at our oceanfront venue in Candidasa. Up to 200 guests, European and Balinese ceremony styles.",
    url: `${SITE_URL}/experiences/events`,
    images: [{ url: `${SITE_URL}/images/experiences/experiences-events.jpg`, width: 1200, height: 630 }],
  },
};

export default function EventsPage() {
  const contact = getContactData();
  const data = getEventsPageData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/experiences/experiences-events.jpg"
        imageAlt="Elegant outdoor event setup with ocean backdrop"
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <EventsDetail data={data} />
    </InnerPageLayout>
  );
}
