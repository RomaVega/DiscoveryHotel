"use client"; // Uses RoomSlideshow with controlled navigation and thumbnail grid

import { useState } from "react";
import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { RoomSlideshow } from "@/components/common/RoomSlideshow";
import type { GalleryPreviewData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface GalleryPreviewProps {
  data: GalleryPreviewData;
  defaultExpanded?: boolean;
  hideHeading?: boolean;
}

export function GalleryPreview({ data, hideHeading = false }: GalleryPreviewProps) {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  const images = data.images.map((img) => ({ src: img.src, alt: img.alt }));

  return (
    <section id="gallery" className="py-8 md:py-16 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        {!hideHeading && (
          <FadeIn>
            <SectionHeading label={t(data.label)} heading={t(data.heading)} />
          </FadeIn>
        )}

        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <RoomSlideshow
              images={images}
              sizes="(max-width: 672px) 100vw, 672px"
              className="aspect-[4/3] shadow-lg"
              current={current}
              onNavigate={setCurrent}
            />
          </FadeIn>

          {/* Thumbnail grid */}
          <div
            className="mt-2 grid gap-1"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(68px, 1fr))" }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Photo ${i + 1}: ${img.alt}`}
                className={cn(
                  "relative overflow-hidden focus-visible:ring-2 focus-visible:ring-brand-teal transition-opacity duration-150 aspect-[4/3]",
                  i === current
                    ? "ring-2 ring-brand-teal opacity-100"
                    : "opacity-55 hover:opacity-85"
                )}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
