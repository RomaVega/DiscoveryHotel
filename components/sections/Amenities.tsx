"use client"; // Uses useLanguage for translation

import {
  Accessibility, Activity, Ban, Bell, Bike, Bus, Car, Coffee, Coins,
  ConciergeBell, GlassWater, Hand, Map, Package, PlaneLanding, Shield,
  Shirt, Sparkles, Sun, Tv, Umbrella, UtensilsCrossed, WashingMachine,
  Waves, Wifi,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { AmenitiesData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

// Keep this map in sync with the `icon` values used in content/home.json under amenities.items.
// Adding a new amenity with a different icon? Add the icon to both the import above and this map.
const iconMap: Record<string, LucideIcon> = {
  Accessibility, Activity, Ban, Bell, Bike, Bus, Car, Coffee, Coins,
  ConciergeBell, GlassWater, Hand, Map, Package, PlaneLanding, Shield,
  Shirt, Sparkles, Sun, Tv, Umbrella, UtensilsCrossed, WashingMachine,
  Waves, Wifi,
};

interface AmenitiesProps {
  data: AmenitiesData;
}

export function Amenities({ data }: AmenitiesProps) {
  const { t } = useLanguage();

  return (
    <section id="amenities" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            label={t(data.label)}
            heading={t(data.heading)}
          />
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-7">
          {data.items.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <FadeIn key={i} delay={Math.min(i, 5) * 0.07} className={item.hideMobile ? "hidden md:flex" : item.hideDesktop ? "md:hidden" : undefined}>
                <div className="flex items-center gap-4">
                  {Icon && (
                    <Icon size={20} strokeWidth={1.2} className="text-brand-teal shrink-0" />
                  )}
                  <span className="font-sans text-sm text-charcoal">
                    {t(item.title)}
                  </span>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
