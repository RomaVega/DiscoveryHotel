import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ContactDetail } from "@/components/sections/ContactDetail";
import { MapLocation } from "@/components/sections/MapLocation";
import { SITE_URL } from "@/lib/site";
import { JsonLd, breadcrumbs, webPage } from "@/lib/jsonld";

export const metadata = {
  title: "Contact — Orlowsky Discovery Hotel, Candidasa, Bali",
  description: "Contact Orlowsky Discovery Hotel in Candidasa, East Bali. WhatsApp, email, address, Google Maps directions, and booking enquiries.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
    languages: {
      "en": `${SITE_URL}/contact`,
      "ru": `${SITE_URL}/ru/contact`,
      "x-default": `${SITE_URL}/contact`,
    },
  },
  openGraph: {
    title: "Contact — Orlowsky Discovery Hotel, Candidasa, Bali",
    description: "Contact Orlowsky Discovery Hotel in Candidasa, East Bali. WhatsApp, email, address, Google Maps directions, and booking enquiries.",
    url: `${SITE_URL}/contact`,
    images: [{ url: `${SITE_URL}/images/gallery/orlowsky-hotel-restaurant-bar-candidasa.webp`, width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        webPage({
          path: "/contact",
          name: "Contact Orlowsky Discovery Hotel, Candidasa",
          description: "WhatsApp, email, address, and directions to our hotel on the seafront of Candidasa, East Bali.",
          image: `${SITE_URL}/images/gallery/orlowsky-hotel-restaurant-bar-candidasa.webp`,
          locale: "en",
          type: "ContactPage",
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]),
      ]} />
      <PageHero
        image="/images/gallery/orlowsky-hotel-restaurant-bar-candidasa.webp"
        imageAlt="Hotel entrance surrounded by tropical gardens"
        heading={{ en: "Contact Orlowsky Discovery Hotel, Candidasa", ru: "Контакты отеля Orlowsky Discovery, Кандидаса" }}
        subtext={{ en: "WhatsApp, email, address, and directions to our hotel on the seafront of Candidasa, East Bali.", ru: "WhatsApp, email, адрес и маршрут до нашего отеля на набережной Кандидасы, Восточный Бали." }}
      />
      <MapLocation contact={contact} />
      <ContactDetail contact={contact} />
    </InnerPageLayout>
  );
}
