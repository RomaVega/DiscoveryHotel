"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { LocalizedLink as Link } from "@/components/common/LocalizedLink";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { RoomSlideshow } from "@/components/common/RoomSlideshow";
import type { RoomsPreviewData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface RoomsPreviewProps {
  data: RoomsPreviewData;
}

export function RoomsPreview({ data }: RoomsPreviewProps) {
  const { t } = useLanguage();

  return (
    <section id="rooms" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            label={t(data.label)}
            heading={t(data.heading)}
            subtext={t(data.subtext)}
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.rooms.map((room, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-ivory shadow-md group h-full flex flex-col overflow-hidden rounded-md">
                {room.images && room.images.length > 1 ? (
                  <RoomSlideshow
                    images={room.images.map((s) => ({
                      src: s.src,
                      alt: typeof s.alt === "string" ? s.alt : s.alt.en,
                    }))}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="aspect-video shrink-0"
                  />
                ) : (
                  <div className="relative aspect-video shrink-0 overflow-hidden">
                    <Image
                      src={room.image}
                      alt={room.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-5 md:p-8 flex flex-col flex-1">
                  <Link href="/rooms" className="group/text flex-1">
                    <h3 className="font-sans text-lg font-normal text-charcoal group-hover/text:text-accent-text transition-colors duration-200">
                      {t(room.title)}
                    </h3>
                    <p className="mt-2 text-stone leading-relaxed">
                      {t(room.description)}
                    </p>
                  </Link>
                  {/* Same footer as the offer cards: rate and CTA share one
                      baseline above a hairline, so the two things a guest
                      decides on sit together. Stacks below `sm`, where a long
                      RU button label and a price will not share a 360px row. */}
                  <div className="mt-6 pt-5 border-t border-charcoal/10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    {room.price ? (
                      <p className="font-sans text-lg font-semibold text-accent-text leading-none">
                        {t(room.price)}
                      </p>
                    ) : (
                      <span />
                    )}
                    <div className="flex justify-center sm:block">
                      <SecondaryButton href={room.href} external>
                        {t(room.cta ?? { en: "Book This Room", ru: "Забронировать Номер" })}
                      </SecondaryButton>
                    </div>
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
