"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
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
    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        {/* Vehicles */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {data.vehicles.map((vehicle, i) => (
              <div key={i} className="bg-ivory p-6 shadow-sm flex flex-col">
                <h3 className="font-serif text-xl font-semibold text-charcoal">{t(vehicle.title)}</h3>
                <p className="mt-2 text-stone text-sm leading-relaxed flex-1">{t(vehicle.description)}</p>
                <div className="mt-4 pt-4 border-t border-sand">
                  <span className="font-sans font-semibold text-brand-teal">{t(vehicle.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Terms */}
        {data.terms && data.terms.length > 0 && (
          <FadeIn>
            <div className="bg-ivory p-8 shadow-sm">
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
      <section className="pt-12 md:pt-32 pb-12 md:pb-32 bg-deep-teal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif font-light text-3xl md:text-5xl text-white">
              {isRu ? "Готовы объездить Восточный Бали?" : "Ready to Ride East Bali?"}
            </h2>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              {isRu
                ? "Напишите нам — мы подберём транспорт и расскажем о лучших маршрутах из Кандидасы."
                : "Message us and we'll arrange the perfect vehicle for your Bali adventure from Candidasa."}
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
