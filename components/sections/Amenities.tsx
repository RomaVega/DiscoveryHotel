"use client"; // Uses useLanguage for translation

import {
  Waves, Wifi, UtensilsCrossed, Sparkles, Umbrella, Coffee,
  Ban, Coins, Droplets, Droplet, Leaf, RefreshCw, Shirt, Wind, Info,
  Thermometer, Activity, MapPin, Monitor, CloudRain, Flame,
  Phone, PhoneCall, Accessibility, Home, Layers, Briefcase,
  Car, Shield, RefreshCcw, Bell, Wine, Zap, Star, Building2,
  Bike, Map, Plug, Bus, Package, Hand, Sun, Tv,
  Bath, GlassWater, ShowerHead, PlaneLanding, WashingMachine,
  Pipette, CupSoda, Newspaper, ConciergeBell,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { AmenitiesData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

const iconMap: Record<string, LucideIcon> = {
  Waves, Wifi, UtensilsCrossed, Sparkles, Umbrella, Coffee,
  Ban, Coins, Droplets, Droplet, Leaf, RefreshCw, Shirt, Wind, Info,
  Thermometer, Activity, MapPin, Monitor, CloudRain, Flame,
  Phone, PhoneCall, Accessibility, Home, Layers, Briefcase,
  Car, Shield, RefreshCcw, Bell, Wine, Zap, Star, Building2,
  Bike, Map, Plug, Bus, Package, Hand, Sun, Tv,
  Bath, GlassWater, ShowerHead, PlaneLanding, WashingMachine,
  Pipette, CupSoda, Newspaper, ConciergeBell,
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
