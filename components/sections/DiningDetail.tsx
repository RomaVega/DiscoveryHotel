"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import type { DiningPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { UtensilsCrossed, ShoppingBag } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// Atmospheric hotel images cycled across feature sections
const FEATURE_IMAGES = [
  "/images/gallery/g9.jpg",
  "/images/gallery/g5.jpg",
  "/images/gallery/g2.jpg",
  "/images/gallery/g10.jpg",
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
  const roomUrl = buildWhatsAppUrl(isRu
    ? "Здравствуйте! Хочу заказать доставку еды в номер."
    : "Hello! I'd like to order room dining.");

  return (
    <div>
      {/* ── Stats strip (Option 3) ── */}
      <div className="bg-brand-teal py-10 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 divide-x divide-white/15">
          <div className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {isRu ? "Часы работы" : "Hours"}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">{data.hours}</p>
          </div>
          <div className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {isRu ? "Вместимость" : "Capacity"}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">{data.capacity}</p>
          </div>
          <div className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {isRu ? "Расположение" : "Location"}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">Candidasa, Bali</p>
          </div>
        </div>
      </div>

      {/* ── CTAs ── */}
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-charcoal/10 border-t border-charcoal/8">
            <a
              href={tableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sand flex flex-col items-center text-center gap-5 py-24 px-10 group hover:bg-ivory transition-colors duration-300"
            >
              <UtensilsCrossed size={22} className="text-brand-teal" />
              <div>
                <p className="font-serif text-2xl text-charcoal">
                  {isRu ? "Забронировать столик" : "Book a Table"}
                </p>
                <p className="text-stone text-sm mt-2 leading-relaxed">
                  {isRu ? "Сделать бронирование" : "Make a Reservation"}
                </p>
              </div>
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-teal group-hover:text-deep-teal transition-colors duration-200">
                {isRu ? "Написать →" : "Message →"}
              </span>
            </a>

            <a
              href={roomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sand flex flex-col items-center text-center gap-5 py-24 px-10 group hover:bg-ivory transition-colors duration-300"
            >
              <ShoppingBag size={22} className="text-brand-teal" />
              <div>
                <p className="font-serif text-2xl text-charcoal">
                  {isRu ? "Доставка в номер" : "Room Dining"}
                </p>
                <p className="text-stone text-sm mt-2 leading-relaxed">
                  {isRu ? "Заказать онлайн прямо в номер" : "Order Online to Your Room"}
                </p>
              </div>
              <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-teal group-hover:text-deep-teal transition-colors duration-200">
                {isRu ? "Заказать →" : "Order →"}
              </span>
            </a>
        </div>
      </FadeIn>

      {/* ── Alternating image + text features (Option 1) ── */}
      <div>
        <div className="space-y-0">
          {data.features.map((feature, i) => {
            const bg = i % 2 === 0 ? "bg-ivory" : "bg-sand";
            return (
              <FadeIn key={i}>
                <div className={`flex flex-col lg:flex-row items-stretch ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
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
                  <div className={`lg:w-1/2 ${bg} flex flex-col justify-center px-10 md:px-16 lg:px-20 py-14`}>
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-charcoal leading-tight">
                      {t(feature.title)}
                    </h3>
                    <div className="w-8 h-px bg-brand-teal my-7" />
                    <p className="text-stone leading-relaxed text-[15px]">
                      {t(feature.description)}
                    </p>
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
