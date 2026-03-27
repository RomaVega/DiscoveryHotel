"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { RoomSlideshow } from "@/components/common/RoomSlideshow";
import type { RoomsPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import {
  Waves, BedDouble, ChefHat, Flame, Sofa, Tv, Wind, Lock, Wine,
  Coffee, Droplets, Shirt, Fan, Sparkles, CloudRain, ShowerHead, Leaf,
  Check, type LucideIcon,
} from "lucide-react";

function amenityIcon(text: string): LucideIcon {
  const t = text.toLowerCase();
  if (t.includes("pool") || t.includes("swim")) return Waves;
  if (t.includes("bedroom") || t.includes("bed")) return BedDouble;
  if (t.includes("kitchenette")) return Flame;
  if (t.includes("kitchen")) return ChefHat;
  if (t.includes("lounge") || t.includes("living")) return Sofa;
  if (t.includes("tv") || t.includes("television")) return Tv;
  if (t.includes("air con")) return Wind;
  if (t.includes("safe")) return Lock;
  if (t.includes("minibar") || t.includes("bar")) return Wine;
  if (t.includes("coffee") || t.includes("tea")) return Coffee;
  if (t.includes("water")) return Droplets;
  if (t.includes("iron")) return Shirt;
  if (t.includes("hairdryer") || t.includes("hair dryer")) return Fan;
  if (t.includes("housekeeping") || t.includes("cleaning")) return Sparkles;
  if (t.includes("rain shower")) return CloudRain;
  if (t.includes("shower")) return ShowerHead;
  if (t.includes("garden") || t.includes("terrace") || t.includes("view")) return Leaf;
  if (t.includes("wardrobe") || t.includes("closet")) return Shirt;
  return Check;
}

interface RoomsDetailProps {
  data: RoomsPageData;
}

export function RoomsDetail({ data }: RoomsDetailProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-20 md:space-y-32">
          {data.rooms.map((room, i) => (
            <FadeIn key={i}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                {room.images && room.images.length > 1 ? (
                  <RoomSlideshow
                    images={room.images.map((s) => ({ src: s.src, alt: t(s.alt) }))}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`aspect-[4/3] shadow-lg ${i % 2 === 1 ? "lg:order-2" : ""}`}
                  />
                ) : (
                  <div className={`relative aspect-[4/3] overflow-hidden shadow-lg ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <Image
                      src={room.image}
                      alt={t(room.imageAlt)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal">
                    {t(room.title)}
                  </h2>
                  <p className="mt-4 text-stone leading-relaxed">
                    {t(room.description)}
                  </p>

                  {room.amenities && room.amenities.length > 0 && (
                    <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
                      {room.amenities.map((a, j) => {
                        const Icon = amenityIcon(typeof a === "object" ? a.en : a);
                        return (
                          <li key={j} className="flex items-center gap-2.5 text-charcoal">
                            <Icon size={15} strokeWidth={1.4} className="text-brand-teal shrink-0" />
                            <span className="text-sm leading-relaxed">{t(a)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {room.highlights && room.highlights.length > 0 && (
                    <ul className="mt-6 space-y-2.5">
                      {room.highlights.map((h, j) => {
                        const Icon = amenityIcon(typeof h === "object" ? h.en : h);
                        return (
                          <li key={j} className="flex items-center gap-2.5 text-charcoal">
                            <Icon size={15} strokeWidth={1.4} className="text-brand-teal shrink-0" />
                            <span className="text-sm leading-relaxed">{t(h)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <div className="mt-8 flex justify-center">
                    <SecondaryButton
                      href={room.href}
                      external
                      className="bg-brand-teal text-white hover:bg-deep-teal hover:text-white border-brand-teal"
                    >
                      {t({ en: "Book This Room", ru: "Забронировать" })}
                    </SecondaryButton>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
