"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SpotlightCard } from "@/components/aceternity/spotlight-card";
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
              <SpotlightCard>
                <a
                  href={room.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block relative aspect-[4/3] overflow-hidden"
                >
                  <Image
                    src={room.image}
                    alt={room.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-serif text-2xl font-semibold drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                      {t(room.title)}
                    </h3>
                    <p className="mt-2 text-sm text-white/95 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                      {t(room.description)}
                    </p>
                    <span className="mt-4 inline-block border border-white/60 hover:border-white hover:scale-[1.04] active:scale-[0.97] text-white font-sans font-semibold px-6 py-2 rounded-full tracking-wide text-xs transition-all duration-300">
                      See More
                    </span>
                  </div>
                </a>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
