"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import type { CarRentalPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { Check } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface CarRentalDetailProps {
  data: CarRentalPageData;
}

export function CarRentalDetail({ data }: CarRentalDetailProps) {
  const { t, locale } = useLanguage();
  const isRu = locale === "ru";
  const ctaUrl = buildWhatsAppUrl(isRu
    ? "Здравствуйте! Хочу арендовать автомобиль / мотоцикл."
    : "Hello! I'd like to arrange a car or bike rental.");

  return (
    <div>
    {/* ── Motivational lead-in ── */}
    {data.intro && (
      <section className="py-16 md:py-24 bg-ivory">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="w-px h-12 bg-brand-teal mx-auto mb-8" />
            <p className="font-serif text-xl md:text-2xl font-light text-charcoal leading-relaxed">
              {t(data.intro)}
            </p>
            <div className="w-px h-12 bg-brand-teal mx-auto mt-8" />
          </FadeIn>
        </div>
      </section>
    )}
    <section className="pt-6 pb-6 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        {/* Vehicles */}
        <FadeIn>
          <div className="flex flex-col gap-6 md:mb-16">
            {data.vehicles.map((vehicle, i) => {
              const vehicleName = typeof vehicle.title === "string" ? vehicle.title : vehicle.title.en;
              const bookUrl = buildWhatsAppUrl(isRu
                ? `Здравствуйте! Хочу арендовать: ${typeof vehicle.title === "string" ? vehicle.title : vehicle.title.ru}.`
                : `Hello! I'd like to rent: ${vehicleName}.`);
              return (
                <div key={i} className="bg-ivory shadow-sm p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 rounded-md">
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl font-semibold text-charcoal">{t(vehicle.title)}</h3>
                    <p className="text-stone text-sm mt-2 leading-relaxed">{t(vehicle.description)}</p>
                    <div className="mt-2">
                      <span className="font-sans font-semibold text-accent-text text-sm">{t(vehicle.price)}</span>
                    </div>
                  </div>
                  <div className="flex justify-center sm:block">
                    <SecondaryButton href={bookUrl} external>
                      {t({ ru: "Забронировать", en: "Book Now" })}
                    </SecondaryButton>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Terms */}
        {data.terms && data.terms.length > 0 && (
          <FadeIn>
            <div className="bg-ivory p-8 shadow-sm rounded-md">
              <h3 className="font-serif text-xl font-semibold text-charcoal mb-4">
                {t({ en: "Rental Terms", ru: "Условия аренды" })}
              </h3>
              <div className="space-y-3">
                {data.terms.map((term, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={16} className="text-brand-teal shrink-0 mt-0.5" />
                    <span className="text-stone text-sm">{t(term)}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>

      {/* ── CTA ── */}
      <section className="pt-6 md:pt-32 pb-6 md:pb-32 bg-deep-teal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif font-medium text-2xl md:text-5xl text-white text-balance">
              {t({ ru: "Готовы Объездить Восточный Бали?", en: "Ready to Ride East Bali?" })}
            </h2>
            <p className="mt-4 text-sm md:text-lg text-white/80 leading-relaxed">
              {t({
                ru: "Напишите нам — мы подберём транспорт и расскажем о лучших маршрутах в Чандидасе.",
                en: "Message us and we'll arrange the perfect vehicle for your Bali adventure in Candidasa.",
              })}
            </p>
            <div className="mt-8">
              <SecondaryButton
                href={ctaUrl}
                external
                className="border-white text-white hover:bg-white/10 hover:border-white/80"
              >
                {t({ ru: "Написать Нам", en: "Message Us Now" })}
              </SecondaryButton>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
