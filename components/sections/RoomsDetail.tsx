"use client"; // Uses useLanguage for content translation

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { RoomSlideshow } from "@/components/common/RoomSlideshow";
import type { RoomsPageData, RoomDetail } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import {
  Waves, BedDouble, ChefHat, Flame, Sofa, Tv, Wind, Lock, Wine,
  Coffee, Shirt, Sparkles, ShowerHead, Check, Bath,
  Refrigerator, Microwave, UtensilsCrossed, Thermometer,
  Droplets, Layers, SprayCan, Mountain, TreePine, Eye, Sunrise,
  DoorOpen, Armchair, Wifi, Landmark, Scissors,
  type LucideIcon,
} from "lucide-react";

function amenityIcon(text: string): LucideIcon {
  const t = text.toLowerCase();
  if (t.includes("refrigerator") || t.includes("fridge")) return Refrigerator;
  if (t.includes("microwave")) return Microwave;
  if (t.includes("stovetop") || t.includes("oven")) return Flame;
  if (t.includes("kettle")) return Coffee;
  if (t.includes("kitchenware") || t.includes("dining table") || t.includes("utensil")) return UtensilsCrossed;
  if (t.includes("kitchen")) return ChefHat;
  if (t.includes("hairdryer") || t.includes("hair dryer")) return Scissors;
  if (t.includes("toiletries") || t.includes("amenities")) return SprayCan;
  if (t.includes("towel") || t.includes("bathrobe") || t.includes("robe")) return Layers;
  if (t.includes("toilet paper")) return Droplets;
  if (t.includes("shower")) return ShowerHead;
  if (t.includes("bath")) return Bath;
  if (t.includes("sea view") || t.includes("ocean view")) return Sunrise;
  if (t.includes("pool view")) return Waves;
  if (t.includes("garden view")) return TreePine;
  if (t.includes("mountain view")) return Mountain;
  if (t.includes("landmark view")) return Landmark;
  if (t.includes("view")) return Eye;
  if (t.includes("pool") || t.includes("swim")) return Waves;
  if (t.includes("entrance") || t.includes("door")) return DoorOpen;
  if (t.includes("terrace") || t.includes("balcony") || t.includes("patio")) return Sunrise;
  if (t.includes("air con") || t.includes("fan")) return Thermometer;
  if (t.includes("tv") || t.includes("television")) return Tv;
  if (t.includes("minibar") || t.includes("bar")) return Wine;
  if (t.includes("safe") || t.includes("deposit")) return Lock;
  if (t.includes("wifi") || t.includes("wi-fi") || t.includes("internet")) return Wifi;
  if (t.includes("desk") || t.includes("seating") || t.includes("lounge") || t.includes("living")) return Armchair;
  if (t.includes("wardrobe") || t.includes("closet")) return Shirt;
  if (t.includes("iron")) return Shirt;
  if (t.includes("coffee") || t.includes("tea") || t.includes("breakfast")) return Coffee;
  if (t.includes("housekeeping") || t.includes("cleaning")) return Sparkles;
  if (t.includes("bedroom") || t.includes("bed")) return BedDouble;
  if (t.includes("sofa")) return Sofa;
  if (t.includes("wind")) return Wind;
  return Check;
}

function RoomCard({ room, reverse, t, isRu }: {
  room: RoomDetail;
  reverse: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (s: any) => string;
  isRu: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);
  const images = room.images?.map((s) => ({ src: s.src, alt: t(s.alt) })) ?? [];

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0 lg:items-start">

      {/* ── Block 1: Title + stats + description (desktop: col 2 row 1) ── */}
      <div className={`lg:col-start-2 lg:row-start-1 ${reverse ? "lg:col-start-1" : ""}`}>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal mb-6">{t(room.title)}</h2>

        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-charcoal/10">
          <div>
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-stone mb-0.5">{isRu ? "Площадь" : "Size"}</p>
            <p className="font-serif text-lg text-charcoal">{room.size} m²</p>
          </div>
          <div className="w-px h-8 bg-charcoal/10" />
          <div>
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-stone mb-0.5">{isRu ? "Спальни" : "Bedrooms"}</p>
            <p className="font-serif text-lg text-charcoal">{room.bedrooms ?? 1}</p>
          </div>
          {room.bathrooms && (
            <>
              <div className="w-px h-8 bg-charcoal/10" />
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-stone mb-0.5">{isRu ? "Ванные" : "Bathrooms"}</p>
                <p className="font-serif text-lg text-charcoal">{room.bathrooms}</p>
              </div>
            </>
          )}
        </div>

        <p className="text-stone leading-relaxed text-[15px]">{t(room.description)}</p>
      </div>

      {/* ── Block 2: Slideshow + thumbnails + book (desktop: col 1 rows 1–2) ── */}
      <div className={`flex flex-col mt-8 lg:mt-0 lg:col-start-1 lg:row-start-1 lg:row-span-2 ${reverse ? "lg:col-start-2" : ""}`}>
        {images.length > 1 ? (
          <RoomSlideshow
            images={images}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/3] shadow-lg -mx-6 lg:mx-0"
            current={current}
            onNavigate={setCurrent}
          />
        ) : (
          <div className="relative aspect-[4/3] overflow-hidden shadow-lg -mx-6 lg:mx-0">
            <Image src={room.image} alt={t(room.imageAlt)} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        )}

        {/* Thumbnail grid — desktop only */}
        {images.length > 1 && (
          <div
            ref={thumbRef}
            className="hidden lg:grid mt-2 gap-1"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(68px, 1fr))" }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Photo ${i + 1}: ${img.alt}`}
                className={cn(
                  "relative overflow-hidden focus-visible:ring-2 focus-visible:ring-brand-teal transition-opacity duration-150",
                  "aspect-[4/3]",
                  i === current ? "ring-2 ring-brand-teal opacity-100" : "opacity-55 hover:opacity-85"
                )}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Book button — desktop only in left col */}
        <div className="hidden lg:flex flex-1 items-center justify-center mt-8">
          <SecondaryButton href={room.href} external>
            {isRu ? "Забронировать" : "Book This Room"}
          </SecondaryButton>
        </div>
      </div>

      {/* ── Block 3: Key features + amenities + book (desktop: col 2 row 2) ── */}
      <div className={`mt-6 lg:col-start-2 lg:row-start-2 ${reverse ? "lg:col-start-1" : ""}`}>
        {room.keyFeatures && room.keyFeatures.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {room.keyFeatures.map((f, fi) => (
              <span key={fi} className="border border-charcoal/20 text-stone font-sans text-[11px] tracking-wide px-3 py-1 rounded-full">
                {t(f)}
              </span>
            ))}
          </div>
        )}

        {room.amenityGroups && room.amenityGroups.length > 0 ? (
          <div className="mt-8 space-y-5">
            {room.amenityGroups.map((group, gi) => (
              <div key={gi}>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-stone mb-2.5">{t(group.label)}</p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {group.items.map((item, ii) => {
                    const Icon = amenityIcon(typeof item === "object" ? item.en : item);
                    return (
                      <li key={ii} className="flex items-center gap-2 text-charcoal">
                        <Icon size={13} strokeWidth={1.4} className="text-brand-teal shrink-0" />
                        <span className="text-sm leading-relaxed">{t(item)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : room.amenities && room.amenities.length > 0 ? (
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
        ) : null}

        {/* Book button — mobile only */}
        <div className="lg:hidden flex justify-center mt-8">
          <SecondaryButton href={room.href} external>
            {isRu ? "Забронировать" : "Book This Room"}
          </SecondaryButton>
        </div>
      </div>

    </div>
  );
}

interface RoomsDetailProps {
  data: RoomsPageData;
}

export function RoomsDetail({ data }: RoomsDetailProps) {
  const { t, locale } = useLanguage();
  const isRu = locale === "ru";

  return (
    <section>
      {data.rooms.map((r, i) => (
        <div key={i} className={i % 2 === 0 ? "bg-white" : "bg-sand"}>
          <div className="max-w-7xl mx-auto px-6 pt-6 pb-10 md:py-32">
            <FadeIn>
              <RoomCard room={r} reverse={false} t={t} isRu={isRu} />
            </FadeIn>
          </div>
        </div>
      ))}
    </section>
  );
}
