"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import type { EventsPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { Check } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface EventsDetailProps {
  data: EventsPageData;
}

export function EventsDetail({ data }: EventsDetailProps) {
  const { t, locale } = useLanguage();
  const isRu = locale === "ru";

  const ctaUrl = buildWhatsAppUrl(isRu
    ? "Здравствуйте! Хочу обсудить организацию мероприятия в вашем отеле."
    : "Hello! I'd like to discuss planning an event at your venue.");

  return (
    <div>
      {/* ── Venue stats strip ── */}
      <div className="bg-cta-teal py-10 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 divide-x divide-white/15">
          <div className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {isRu ? "Вместимость" : "Capacity"}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">
              {isRu ? "До 200 гостей" : "Up to 200 guests"}
            </p>
          </div>
          <div className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {isRu ? "Стили церемоний" : "Ceremony Styles"}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">
              {isRu ? "Европейский · Балийский" : "European · Balinese"}
            </p>
          </div>
          <div className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {isRu ? "Расположение" : "Location"}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">Candidasa, Bali</p>
          </div>
        </div>
      </div>

    <section className="pt-6 pb-6 md:pt-32 md:pb-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {data.services.map((service, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-ivory shadow-md overflow-hidden h-full flex flex-col">
                <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={t(service.imageAlt)}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-cover${i === 2 ? " brightness-125" : ""}`}
                  />
                </div>
                <div className="p-5 md:p-8 flex flex-col flex-1">
                  <h2 className="font-serif text-2xl font-semibold text-charcoal">{t(service.title)}</h2>
                  <p className="mt-2 text-stone leading-relaxed text-sm flex-1">{t(service.description)}</p>
                  <div className="mt-6 flex justify-center">
                    <a
                      href={ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-transparent border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white hover:scale-[1.04] active:scale-[0.97] font-sans font-semibold px-5 py-2 rounded-full tracking-wide uppercase text-xs transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
                    >
                      {isRu ? "Забронировать" : "Book Now"}
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Venue Features */}
        {data.venueFeatures && data.venueFeatures.length > 0 && (
          <FadeIn>
            <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-8">
              {t({ en: "What We Offer", ru: "Что мы предлагаем" })}
            </h2>
            <div className="bg-ivory p-8 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.venueFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check size={16} className="text-brand-teal shrink-0" />
                    <span className="text-charcoal text-sm">{t(feature)}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>

      {/* ── CTA ── */}
      <section className="pt-6 md:pt-32 pb-6 md:pb-32 bg-cta-teal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif font-light text-2xl md:text-5xl text-white">
              {isRu ? "Начните Планировать Торжество" : "Start Planning Your Celebration"}
            </h2>
            <p className="mt-4 text-sm md:text-lg text-white/70 leading-relaxed">
              {isRu
                ? "Поделитесь вашей идеей — мы создадим незабываемое мероприятие на нашей площадке у океана в Чандидасе."
                : "Share your vision — we'll design an unforgettable event at our oceanfront venue in Candidasa."}
            </p>
            <div className="mt-8">
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent hover:bg-white/10 border border-white hover:border-white/80 text-white font-sans font-semibold px-5 py-2 rounded-full tracking-wide uppercase text-xs transition-all duration-300"
              >
                {isRu ? "Написать нам" : "Message Us Now"}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
