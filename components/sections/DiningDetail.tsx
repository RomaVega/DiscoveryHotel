"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { StatsStrip } from "@/components/common/StatsStrip";
import type { DiningPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { UtensilsCrossed, ShoppingBag } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// Atmospheric hotel images cycled across feature sections
const FEATURE_IMAGES = [
  "/images/restaurant/seaside-dining.jpg",
  "/images/restaurant/international-cuisine.png",
  "/images/restaurant/buffet.jpg",
  "/images/restaurant/bar-drinks-and-coctails.jpg",
  "/images/restaurant/room-service.png",
  "/images/restaurant/chef-specials.jpg",
  "/images/restaurant/cultural-performance.jpg",
  "/images/restaurant/celebration-menu.jpeg",
];

interface DiningDetailProps {
  data: DiningPageData;
}

export function DiningDetail({ data }: DiningDetailProps) {
  const { t, locale } = useLanguage();
  const isRu = locale === "ru";

  const tableUrl = buildWhatsAppUrl(isRu
    ? "Здравствуйте! Хочу забронировать столик в ресторане."
    : "Hello! I'd like to book a table at the restaurant.");
  const roomUrl = "https://secure.guestpro.net/odch/concierge/room-dining";

  return (
    <div>
      {/* ── Stats strip ── */}
      <StatsStrip items={[
        { label: t({ en: "Hours", ru: "Часы работы" }), value: data.hours },
        { label: t({ en: "Capacity", ru: "Вместимость" }), value: data.capacity },
        { label: t({ en: "Location", ru: "Расположение" }), value: "Candidasa, Bali" },
      ]} />

      {/* ── CTAs ── */}
      <FadeIn>
        <div className="bg-ivory py-20 px-6 text-center border-t border-charcoal/8">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-stone mb-6">
            {isRu ? "Ресторан" : "Dining"}
          </p>
          <h2 className="font-serif font-light text-3xl md:text-4xl text-charcoal mb-3">
            {isRu ? "Как Вы Хотите Отужинать?" : "How Would You Like to Dine?"}
          </h2>
          <p className="text-stone text-sm leading-relaxed mb-10">
            {isRu
              ? "Забронируйте столик или закажите в номер — мы на связи."
              : "Reserve a table at the restaurant or order directly to your room."}
          </p>
          <div className="flex flex-row flex-wrap items-center justify-center gap-4">
            <SecondaryButton href={tableUrl} external>
              {t({ ru: "Забронировать столик", en: "Book a Table" })}
            </SecondaryButton>
            <SecondaryButton href={roomUrl} external>
              {t({ ru: "Доставка в номер", en: "In-Room Dining" })}
            </SecondaryButton>
          </div>
        </div>
      </FadeIn>

      {/* ── Alternating image + text features (Option 1) ── */}
      <div>
        <div className="space-y-0">
          {data.features.map((feature, i) => {
            const bg = i % 2 === 0 ? "bg-sand" : "bg-ivory";
            return (
              <FadeIn key={i}>
                <div className={`${bg} flex flex-col lg:flex-row items-stretch ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  {/* Image */}
                  <div className="relative aspect-[4/3] lg:w-1/2 lg:aspect-auto lg:min-h-[420px] overflow-hidden">
                    <Image
                      src={FEATURE_IMAGES[i % FEATURE_IMAGES.length]}
                      alt={t(feature.title)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  {/* Text */}
                  <div className="lg:w-1/2 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-14">
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-charcoal leading-tight">
                      {t(feature.title)}
                    </h3>
                    <div className="w-8 h-px bg-brand-teal my-7" />
                    <p className="text-stone leading-relaxed text-[15px]">
                      {t(feature.description)}
                    </p>
                    {i === 5 && (
                      <a
                        href="https://secure.guestpro.net/odch/concierge/room-dining"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-block font-sans text-sm font-semibold text-brand-teal hover:text-deep-teal underline underline-offset-4 transition-colors"
                      >
                        {isRu ? "Открыть полное меню →" : "View Full Digital Menu →"}
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* ── Menu highlights — printed menu typography (Option 2) ── */}
      {data.menuHighlights && data.menuHighlights.length > 0 && (
        <FadeIn>
          <div className="bg-ivory py-16 md:py-20 px-6 border-t border-charcoal/8">
            {/* Section title */}
            <div className="flex items-center justify-center gap-6 mb-16">
              <span className="flex-1 max-w-[120px] h-px bg-charcoal/15" />
              <h2 className="font-serif text-sm tracking-[0.35em] uppercase text-stone">
                {isRu ? "Меню" : "Menu"}
              </h2>
              <span className="flex-1 max-w-[120px] h-px bg-charcoal/15" />
            </div>

            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
              {data.menuHighlights.map((section, i) => (
                <div key={i}>
                  <h3 className="font-serif text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4 pb-3 border-b border-charcoal/10">
                    {t(section.title)}
                  </h3>
                  <ul className="space-y-2.5">
                    {section.items.map((item, j) => (
                      <li key={j} className="font-serif text-[15px] text-charcoal/80 leading-snug">
                        {t(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

    </div>
  );
}
