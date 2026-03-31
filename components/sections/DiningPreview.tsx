"use client"; // Uses useLanguage for locale-aware text, RoomSlideshow for photo gallery

import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { RoomSlideshow } from "@/components/common/RoomSlideshow";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { useLanguage } from "@/lib/language-context";
import { UtensilsCrossed, ShoppingBag } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const SLIDES = [
  { src: "/images/restaurant-bar/orlowsky-hotel-oceanfront-dining-candidasa.png",       alt: "Oceanfront dining at Orlowsky Discovery Hotel, Candidasa" },
  { src: "/images/restaurant-bar/orlowsky-hotel-restaurant-bar-dining-candidasa.jpg",   alt: "Restaurant and bar dining area at Orlowsky Hotel" },
  { src: "/images/restaurant-bar/orlowsky-hotel-bar-tropical-drinks-candidasa.jpg",     alt: "Bar with tropical drinks at Orlowsky Hotel Candidasa" },
  { src: "/images/restaurant-bar/orlowsky-hotel-seaside-dining-candidasa.png",          alt: "Seaside dining terrace at Orlowsky Hotel Candidasa" },
  { src: "/images/restaurant-bar/orlowsky-hotel-restaurant-bar-courtyard-candidasa.jpg",alt: "Restaurant bar courtyard at Orlowsky Discovery Hotel" },
  { src: "/images/restaurant-bar/orlowsky-hotel-international-cuisine-bali.png",        alt: "International cuisine at Orlowsky Hotel Bali" },
  { src: "/images/restaurant-bar/orlowsky-hotel-fresh-seafood-appetizer-candidasa.png", alt: "Fresh seafood appetizer at Orlowsky Hotel restaurant" },
  { src: "/images/restaurant-bar/orlowsky-hotel-restaurant-bar-candidasa-bali.jpg",     alt: "Restaurant and bar at Orlowsky Hotel Candidasa Bali" },
  { src: "/images/restaurant-bar/orlowsky-hotel-restaurant-interior-candidasa.jpg",     alt: "Restaurant interior at Orlowsky Hotel Candidasa" },
  { src: "/images/restaurant-bar/orlowsky-hotel-beach-gazebo-ocean-view-candidasa.jpg", alt: "Beach gazebo with ocean view at Orlowsky Hotel Candidasa" },
  { src: "/images/restaurant-bar/orlowsky-hotel-restaurant-dining-setup-candidasa.jpg", alt: "Dining table setup at Orlowsky Hotel restaurant" },
  { src: "/images/restaurant-bar/orlowsky-hotel-seaside-dining-oceanfront-candidasa.png", alt: "Seaside oceanfront dining at Orlowsky Discovery Hotel" },
];

export function DiningPreview() {
  const { locale } = useLanguage();
  const isRu = locale === "ru";

  const tableUrl = buildWhatsAppUrl(isRu
    ? "Здравствуйте! Хочу забронировать столик в ресторане."
    : "Hello! I'd like to book a table at the restaurant.");
  const roomUrl = "https://secure.guestpro.net/odch/concierge/room-dining";

  return (
    <FadeIn>
      <section className="bg-sand py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Heading */}
          <SectionHeading
            label={isRu ? "Ресторан" : "Restaurant & Bar"}
            heading={isRu ? "Ресторан на берегу океана" : "Oceanfront Dining"}
          />

          {/* Slideshow */}
          <RoomSlideshow
            images={SLIDES}
            className="w-full aspect-[16/9] mb-8"
            sizes="(max-width: 896px) 100vw, 896px"
            autoAdvanceMs={4000}
          />

          {/* Two cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-charcoal/10 border border-charcoal/10">

            {/* Book a Table */}
            <div className="p-6 md:p-8 flex flex-col items-center gap-4 text-center">
              <UtensilsCrossed size={18} className="text-brand-teal" />
              <div>
                <h3 className="font-serif text-xl font-light text-charcoal">
                  {isRu ? "Забронировать столик" : "Book a Table"}
                </h3>
                <p className="text-stone text-xs mt-1 leading-relaxed">
                  {isRu
                    ? <>Свежие морепродукты и балийская кухня у моря.<br />Открыто ежедневно 07:00–22:00.</>
                    : <>Fresh seafood and Balinese cuisine by the sea.<br />Open daily 07:00–22:00.</>}
                </p>
              </div>
              <SecondaryButton href={tableUrl} external className="mt-auto">
                {isRu ? "Написать в WhatsApp" : "Book via WhatsApp"}
              </SecondaryButton>
            </div>

            {/* Room Dining */}
            <div className="p-6 md:p-8 flex flex-col items-center gap-4 text-center">
              <ShoppingBag size={18} className="text-brand-teal" />
              <div>
                <h3 className="font-serif text-xl font-light text-charcoal">
                  {isRu ? "Доставка в номер" : "Room Dining"}
                </h3>
                <p className="text-stone text-xs mt-1 leading-relaxed">
                  {isRu
                    ? <>Закажите еду прямо в номер.<br />Онлайн-заказ доступен в любое время.</>
                    : <>Order food directly to your room.<br />Available online at any time.</>}
                </p>
              </div>
              <SecondaryButton href={roomUrl} external className="mt-auto">
                {isRu ? "Заказать онлайн" : "Order Online"}
              </SecondaryButton>
            </div>

          </div>

        </div>
      </section>
    </FadeIn>
  );
}
