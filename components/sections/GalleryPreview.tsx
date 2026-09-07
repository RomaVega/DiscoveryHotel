"use client"; // Uses RoomSlideshow with controlled navigation and thumbnail grid

import { useState } from "react";
import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { RoomSlideshow } from "@/components/common/RoomSlideshow";
import type { GalleryPreviewData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

/** Thumbnail strip columns. The visible photo count is trimmed to a multiple. */
const THUMB_COLUMNS = 5;

interface GalleryPreviewProps {
  data: GalleryPreviewData;
  defaultExpanded?: boolean;
  hideHeading?: boolean;
  /** Hide the thumbnail strip on desktop (≥lg); kept on mobile for tap navigation. */
  hideDesktopThumbnails?: boolean;
}

export function GalleryPreview({ data, hideHeading = false, hideDesktopThumbnails = false }: GalleryPreviewProps) {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  // The strip is a fixed 5-wide grid, so it shows whole rows only: a trailing
  // partial row reads as a dropped tile rather than as a deliberate edit. The
  // trim is home-only — GalleryMosaic on /gallery reads the same array and
  // still shows every photo — and it re-derives itself, so adding photos can
  // never reintroduce the orphan. Guarded for a set smaller than one row.
  const whole = Math.floor(data.images.length / THUMB_COLUMNS) * THUMB_COLUMNS;
  const images = data.images
    .slice(0, whole || data.images.length)
    .map((img) => ({ src: img.src, alt: img.alt }));

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
              className="aspect-[4/3] shadow-lg rounded-md overflow-hidden"
              current={current}
              onNavigate={setCurrent}
            />
          </FadeIn>

          {/* Thumbnail grid */}
          {/* Fixed 5 columns, not auto-fill: auto-fill re-flowed the row width
              with the viewport (3 tracks at 320px, 5 at 414px, 9 at 768px), so
              any photo count left an orphan tile at some widths. */}
          <div className={cn("mt-2 grid grid-cols-5 gap-1", hideDesktopThumbnails && "lg:hidden")}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Photo ${i + 1}: ${img.alt}`}
                className={cn(
                  "relative overflow-hidden rounded-sm focus-visible:ring-2 focus-visible:ring-brand-teal transition-opacity duration-150 aspect-[4/3]",
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
