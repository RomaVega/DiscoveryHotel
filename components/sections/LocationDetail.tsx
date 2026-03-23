"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import type { LocationPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { MapPin, Clock, Navigation } from "lucide-react";

interface LocationDetailProps {
  data: LocationPageData;
}

export function LocationDetail({ data }: LocationDetailProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        {/* Nearby Attractions */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
            {t({ en: "Nearby Attractions", ru: "Достопримечательности поблизости" })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {data.nearbyAttractions.map((attraction, i) => (
              <div key={i} className="bg-ivory p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-brand-teal" />
                  <span className="text-xs text-stone font-sans">{t(attraction.distance)}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">{t(attraction.name)}</h3>
                <p className="mt-2 text-stone text-sm leading-relaxed">{t(attraction.description)}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Getting Here */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
            {t({ en: "Getting Here", ru: "Как добраться" })}
          </h2>
          <div className="space-y-6">
            {data.gettingHere.map((route, i) => (
              <div key={i} className="bg-ivory p-6 shadow-sm flex items-start gap-4">
                <Navigation size={20} className="text-brand-teal shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-sans font-semibold text-charcoal">{t(route.from)}</h3>
                    <span className="flex items-center gap-1 text-xs text-stone">
                      <Clock size={12} /> {route.duration}
                    </span>
                  </div>
                  <p className="mt-2 text-stone text-sm leading-relaxed">{t(route.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
