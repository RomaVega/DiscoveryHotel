import { getContactData, getHomePageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ContactDetail } from "@/components/sections/ContactDetail";
import { MapLocation } from "@/components/sections/MapLocation";

export const metadata = {
  title: "Contact — Orlowsky Discovery Hotel, Candidasa, Bali",
  description: "Contact Orlowsky Discovery Hotel in Candidasa, East Bali. WhatsApp, email, address, Google Maps directions, and booking enquiries.",
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
      <ContactDetail contact={contact} />
      <MapLocation contact={contact} />
    </InnerPageLayout>
  );
}
