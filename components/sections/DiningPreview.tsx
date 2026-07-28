"use client"; // Uses useLanguage for locale-aware text, RoomSlideshow for photo gallery

import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { RoomSlideshow } from "@/components/common/RoomSlideshow";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { useLanguage } from "@/lib/language-context";
import { Utensils } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const SLIDES = [
  { src: "/images/restaurant-bar/orlowsky-hotel-oceanfront-dining-candidasa.webp",       alt: "Oceanfront dining at Orlowsky Discovery Hotel, Candidasa" },
  { src: "/images/restaurant-bar/orlowsky-hotel-restaurant-bar-dining-candidasa.webp",   alt: "Restaurant and bar dining area at Orlowsky Hotel" },
  { src: "/images/restaurant-bar/orlowsky-hotel-bar-tropical-drinks-candidasa.webp",     alt: "Bar with tropical drinks at Orlowsky Hotel Candidasa" },
  { src: "/images/restaurant-bar/orlowsky-hotel-seaside-dining-candidasa.webp",          alt: "Seaside dining terrace at Orlowsky Hotel Candidasa" },
  { src: "/images/restaurant-bar/orlowsky-hotel-restaurant-bar-courtyard-candidasa.webp",alt: "Restaurant bar courtyard at Orlowsky Discovery Hotel" },
  { src: "/images/restaurant-bar/orlowsky-hotel-international-cuisine-bali.webp",        alt: "International cuisine at Orlowsky Hotel Bali" },
  { src: "/images/restaurant-bar/orlowsky-hotel-fresh-seafood-appetizer-candidasa.webp", alt: "Fresh seafood appetizer at Orlowsky Hotel restaurant" },
  { src: "/images/restaurant-bar/orlowsky-hotel-restaurant-bar-candidasa-bali.webp",     alt: "Restaurant and bar at Orlowsky Hotel Candidasa Bali" },
  { src: "/images/restaurant-bar/orlowsky-hotel-restaurant-interior-candidasa.webp",     alt: "Restaurant interior at Orlowsky Hotel Candidasa" },
  { src: "/images/restaurant-bar/orlowsky-hotel-beach-gazebo-ocean-view-candidasa.webp", alt: "Beach gazebo with ocean view at Orlowsky Hotel Candidasa" },
  { src: "/images/restaurant-bar/orlowsky-hotel-restaurant-dining-setup-candidasa.webp", alt: "Dining table setup at Orlowsky Hotel restaurant" },
  { src: "/images/restaurant-bar/orlowsky-hotel-seaside-dining-oceanfront-candidasa.webp", alt: "Seaside oceanfront dining at Orlowsky Discovery Hotel" },
];

export function DiningPreview() {
  const { locale } = useLanguage();
  const isRu = locale === "ru";

  const tableUrl = buildWhatsAppUrl(isRu
    ? "Здравствуйте! Хочу забронировать столик в ресторане."
    : "Hello! I'd like to book a table at the restaurant.");
  // Menu browsing, room service, and delivery orders all go through one GuestPro page.
  const menuUrl = "https://secure.guestpro.net/odch/concierge/room-dining";

  return (
    <FadeIn>
      <section className="bg-sand py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Heading */}
          <SectionHeading
            label={isRu ? "Ресторан" : "Restaurant & Bar"}
            heading={isRu ? "Ресторан на берегу океана" : "Oceanfront Dining"}
          />

          {/* Slideshow + menu-first content share one continuous ivory rounded frame */}
          <div className="bg-ivory rounded-md overflow-hidden">
            <RoomSlideshow
              images={SLIDES}
              className="w-full aspect-[16/9]"
              sizes="(max-width: 896px) 100vw, 896px"
              autoAdvanceMs={4000}
            />

            {/* Menu is the single primary action; a table reservation sits below as a quiet link */}
            <div className="px-6 md:px-8 py-11 md:py-12 flex flex-col items-center text-center gap-4">
              <Utensils size={20} className="text-brand-teal" />
              <h3 className="font-serif text-2xl md:text-3xl font-light text-charcoal">
                {isRu ? "Наше меню" : "Our Menu"}
              </h3>
              <p className="text-stone text-sm leading-relaxed max-w-md">
                {isRu
                  ? "Свежие морепродукты и балийская кухня — в ресторане, в номер или бесплатной доставкой по Чандидасе."
                  : "Fresh seafood and Balinese cuisine — dine in, room service, or free delivery within Candidasa."}
              </p>
              <SecondaryButton href={menuUrl} external className="mt-2">
                {isRu ? "Смотреть Меню" : "View Menu"}
              </SecondaryButton>
              <a
                href={tableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 font-sans text-xs font-medium text-deep-teal underline underline-offset-4 decoration-deep-teal/40 hover:decoration-deep-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 rounded-sm transition-colors"
              >
                {isRu ? "Забронировать Столик" : "Book a Table"}
              </a>
            </div>
          </div>

        </div>
      </section>
    </FadeIn>
  );
}
