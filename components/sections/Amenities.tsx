"use client"; // Uses useState for show/hide and useLanguage for translation

import { useState, useRef } from "react";
import {
  Waves, Wifi, UtensilsCrossed, Sparkles, Umbrella, Coffee,
  Ban, Droplets, Droplet, Leaf, RefreshCw, Shirt, Wind, Info,
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
  Ban, Droplets, Droplet, Leaf, RefreshCw, Shirt, Wind, Info,
  Thermometer, Activity, MapPin, Monitor, CloudRain, Flame,
  Phone, PhoneCall, Accessibility, Home, Layers, Briefcase,
  Car, Shield, RefreshCcw, Bell, Wine, Zap, Star, Building2,
  Bike, Map, Plug, Bus, Package, Hand, Sun, Tv,
  Bath, GlassWater, ShowerHead, PlaneLanding, WashingMachine,
  Pipette, CupSoda, Newspaper, ConciergeBell,
};

const VISIBLE_COUNT = 6;

interface AmenitiesProps {
  data: AmenitiesData;
}

export function Amenities({ data }: AmenitiesProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const items = data.items;
  const visibleItems = expanded ? items : items.slice(0, VISIBLE_COUNT);

  return (
    <section id="amenities" ref={sectionRef} className="pt-12 md:pt-32 pb-12 md:pb-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            label={t(data.label)}
            heading={t(data.heading)}
          />
        </FadeIn>

        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {visibleItems.map((item, i) => {
              const Icon = iconMap[item.icon];
              return (
                <FadeIn key={i} delay={Math.min(i, 5) * 0.07}>
                  <div className="flex flex-col items-center text-center bg-ivory/60 border border-charcoal/5 px-3 py-5 rounded-sm">
                    {Icon && (
                      <Icon size={22} strokeWidth={1.3} className="text-brand-teal mb-3" />
                    )}
                    <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal leading-snug">
                      {t(item.title)}
                    </span>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* Gradient mask when collapsed */}
          {!expanded && items.length > VISIBLE_COUNT && (
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sand via-sand/80 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Show more / less */}
        {items.length > VISIBLE_COUNT && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                const wasExpanded = expanded;
                setExpanded((v) => !v);
                if (wasExpanded) {
                  setTimeout(() => sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                }
              }}
              className="inline-block bg-transparent border border-brand-teal text-brand-teal hover:border-deep-teal hover:text-deep-teal hover:scale-[1.04] active:scale-[0.97] font-sans font-semibold px-8 py-3 rounded-full tracking-wide uppercase text-xs transition-all duration-300"
            >
              {expanded ? "Show Less" : "See All"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
