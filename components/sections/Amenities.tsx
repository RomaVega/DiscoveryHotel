"use client"; // Uses useLanguage for translation and useState for the collapse toggle

import { useState } from "react";
import {
  Accessibility, Activity, Ban, Bell, Bike, Bus, Car, Coffee, Coins, Compass,
  ConciergeBell, Fish, GlassWater, Hand, KeyRound, Map, Package, PlaneLanding, Shield,
  Shirt, Sparkles, Sun, Tv, Umbrella, UtensilsCrossed, WashingMachine,
  Waves, Wifi,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import type { AmenitiesData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

// Keep this map in sync with the `icon` values used in content/home.json under amenities.items.
// Adding a new amenity with a different icon? Add the icon to both the import above and this map.
const iconMap: Record<string, LucideIcon> = {
  Accessibility, Activity, Ban, Bell, Bike, Bus, Car, Coffee, Coins, Compass,
  ConciergeBell, Fish, GlassWater, Hand, KeyRound, Map, Package, PlaneLanding, Shield,
  Shirt, Sparkles, Sun, Tv, Umbrella, UtensilsCrossed, WashingMachine,
  Waves, Wifi,
};

interface AmenitiesProps {
  data: AmenitiesData;
}

/**
 * A slash is a line-break opportunity, so "Аренда Авто/Мото" breaks after the
 * slash and orphans "Мото" — the compound reads as one term and should stay
 * whole. A word joiner removes that opportunity, leaving the space as the only
 * break, so it wraps to "Аренда / Авто/Мото" instead.
 */
const keepSlashCompoundsWhole = (s: string) => s.replace(/\/(?=\S)/g, "/⁠");

/**
 * At 4 columns every label fits on one line, so rows are a uniform 48px pitch.
 * At 2 columns they do not: the text column is only ~93px at 320px, which wraps
 * 4 of 24 English labels and 10 of 24 Russian ones — no realistic wording fits
 * ~7 Cyrillic characters. Cells therefore reserve two lines below `md` (see
 * `min-h-10`), making every row the same height whichever labels happen to wrap.
 *
 * That puts the mobile pitch at 68px (40px cell + 28px gap), so this caps three
 * full rows plus the whole of row four, which the gradient below then fades.
 * Rendering that last row complete and dimming it reads as intentional; clipping
 * it through the middle of the words reads as broken.
 *
 * Mobile only. At 2 columns the list runs 12 rows and genuinely needs folding;
 * at 4 columns it is 6 rows and ~260px, which is not bulky enough to justify
 * putting a click between the reader and a factual question like "is there
 * parking?". Amenities are scanned as a checklist, so hiding half of one costs
 * more than the height it saves.
 *
 * Capping the height rather than dropping items keeps every amenity in the DOM
 * and out of `display:none`, so the full list stays available to crawlers and
 * assistive tech in either state.
 */
const COLLAPSED_HEIGHT = "max-h-[244px] md:max-h-none";

export function Amenities({ data }: AmenitiesProps) {
  const { t, tl } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  // Roughly what fits in the collapsed height on mobile — below this the cap
  // hides nothing and a toggle would be noise.
  const hasHidden = data.items.length > 10;

  return (
    <section id="amenities" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            label={t(data.label)}
            heading={t(data.heading)}
          />
        </FadeIn>

        <div className={`relative ${expanded ? "" : `${COLLAPSED_HEIGHT} overflow-hidden`}`}>
          <div id="amenities-grid" className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-7">
          {data.items.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <FadeIn key={i} delay={Math.min(i, 5) * 0.07} className={item.hideMobile ? "hidden md:flex" : item.hideDesktop ? "md:hidden" : undefined}>
                {/* min-h reserves the second line a wrapped label needs, so rows
                    share one height. Held until `lg`, not `md`: the 4-column grid
                    starts at md but its columns are still narrow enough at 768px
                    to wrap. Only past lg does every label fit one line unaided. */}
                <div className="flex items-center gap-4 min-h-10 lg:min-h-0">
                  {Icon && (
                    <Icon size={20} strokeWidth={1.2} className="text-brand-teal shrink-0" />
                  )}
                  <span className="font-sans text-sm text-charcoal">
                    {keepSlashCompoundsWhole(t(item.title))}
                  </span>
                </div>
              </FadeIn>
            );
          })}
          </div>

          {/* Fades the half-row into the section background so the cut reads as a
              soft horizon. pointer-events-none so it never blocks the row beneath. */}
          {!expanded && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-ivory md:hidden"
            />
          )}
        </div>

        {hasHidden && (
          <div className="mt-10 text-center md:hidden">
            <SecondaryButton
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls="amenities-grid"
            >
              {expanded ? tl.amenities.showLess : tl.amenities.showAll}
            </SecondaryButton>
          </div>
        )}
      </div>
    </section>
  );
}
