import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ContactDetail } from "@/components/sections/ContactDetail";
import { MapLocation } from "@/components/sections/MapLocation";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Contact — Orlowsky Discovery Hotel, Candidasa, Bali",
  description: "Contact Orlowsky Discovery Hotel in Candidasa, East Bali. WhatsApp, email, address, Google Maps directions, and booking enquiries.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact — Orlowsky Discovery Hotel, Candidasa, Bali",
    description: "Contact Orlowsky Discovery Hotel in Candidasa, East Bali. WhatsApp, email, address, Google Maps directions, and booking enquiries.",
    url: `${SITE_URL}/contact`,
    images: [{ url: `${SITE_URL}/images/gallery/g5.jpg`, width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image="/images/gallery/g5.jpg"
        imageAlt="Hotel entrance surrounded by tropical gardens"
        heading={{ en: "Contact Orlowsky Discovery Hotel, Candidasa", ru: "Контакты отеля Orlowsky Discovery, Кандидаса" }}
        subtext={{ en: "WhatsApp, email, address, and directions to our hotel on the seafront of Candidasa, East Bali.", ru: "WhatsApp, email, адрес и маршрут до нашего отеля на набережной Кандидасы, Восточный Бали." }}
      />
      <MapLocation contact={contact} />
      <ContactDetail contact={contact} />
    </InnerPageLayout>
  );
}
