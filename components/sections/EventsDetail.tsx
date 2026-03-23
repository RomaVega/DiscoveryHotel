"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import type { EventsPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { Check } from "lucide-react";

interface EventsDetailProps {
  data: EventsPageData;
}

export function EventsDetail({ data }: EventsDetailProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        {/* Services */}
        <div className="space-y-16 mb-20">
          {data.services.map((service, i) => (
            <FadeIn key={i}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center`}>
                <div className={`relative aspect-[4/3] overflow-hidden shadow-lg ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <Image
                    src={service.image}
                    alt={t(service.imageAlt)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="font-serif text-3xl font-light text-charcoal">{t(service.title)}</h2>
                  <p className="mt-4 text-stone leading-relaxed">{t(service.description)}</p>
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
  );
}
