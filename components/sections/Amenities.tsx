"use client"; // Uses useLanguage for content translation

import {
  UtensilsCrossed,
  Sparkles,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { AmenitiesData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Sparkles,
  Waves,
  Wifi,
};

interface AmenitiesProps {
  data: AmenitiesData;
}

export function Amenities({ data }: AmenitiesProps) {
  const { t } = useLanguage();

  return (
    <section id="amenities" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            label={t(data.label)}
            heading={t(data.heading)}
          />
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {data.items.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center bg-ivory/60 border border-charcoal/5 px-3 py-6 md:px-6 md:py-10">
                  {Icon && (
                    <Icon
                      size={28}
                      strokeWidth={1.2}
                      className="mx-auto text-brand-teal mb-5"
                    />
                  )}
                  <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-charcoal">
                    {t(item.title)}
                  </h3>
                  <p className="mt-3 text-stone text-sm leading-relaxed">
                    {t(item.description)}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
