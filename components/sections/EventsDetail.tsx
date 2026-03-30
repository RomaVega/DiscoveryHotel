"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { StatsStrip } from "@/components/common/StatsStrip";
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
      <StatsStrip items={[
        { label: t({ en: "Capacity", ru: "Вместимость" }), value: t({ en: "Up to 200 guests", ru: "До 200 гостей" }) },
        { label: t({ en: "Ceremony Styles", ru: "Стили церемоний" }), value: t({ en: "European · Balinese", ru: "Европейский · Балийский" }) },
        { label: t({ en: "Location", ru: "Расположение" }), value: "Candidasa, Bali" },
      ]} />

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
                    <SecondaryButton href={ctaUrl} external>
                      {t({ ru: "Забронировать", en: "Book Now" })}
                    </SecondaryButton>
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
              {t({ ru: "Начните Планировать Торжество", en: "Start Planning Your Celebration" })}
            </h2>
            <p className="mt-4 text-sm md:text-lg text-white/70 leading-relaxed">
              {t({
                ru: "Поделитесь вашей идеей — мы создадим незабываемое мероприятие на нашей площадке у океана в Чандидасе.",
                en: "Share your vision — we'll design an unforgettable event at our oceanfront venue in Candidasa.",
              })}
            </p>
            <div className="mt-8">
              <SecondaryButton
                href={ctaUrl}
                external
                className="border-white text-white hover:bg-white/10 hover:border-white/80"
              >
                {t({ ru: "Написать нам", en: "Message Us Now" })}
              </SecondaryButton>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
