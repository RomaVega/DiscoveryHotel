import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ContactDetail } from "@/components/sections/ContactDetail";
import { MapLocation } from "@/components/sections/MapLocation";

export const metadata = {
  title: "Контакты — Orlowsky Discovery Hotel, Кандидаса, Бали",
  description: "Свяжитесь с Orlowsky Discovery Hotel по WhatsApp, email или посетите нас в Кандидасе. Jalan Pantai Indah 06, Карангасем 80851, Бали.",
  alternates: {
    canonical: `${SITE_URL}/ru/contact`,
    languages: {
      "en": `${SITE_URL}/contact`,
      "ru": `${SITE_URL}/ru/contact`,
      "x-default": `${SITE_URL}/contact`,
    },
  },
  openGraph: {
    title: "Контакты — Orlowsky Discovery Hotel, Кандидаса, Бали",
    description: "Свяжитесь с Orlowsky Discovery Hotel по WhatsApp, email или посетите нас в Кандидасе. Jalan Pantai Indah 06, Карангасем 80851, Бали.",
    url: `${SITE_URL}/ru/contact`,
    images: [{ url: `${SITE_URL}/images/hero/hero-main.jpg`, width: 1200, height: 630 }],
  },
};

export default function ContactRuPage() {
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
