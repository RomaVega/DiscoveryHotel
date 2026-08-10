"use client"; // Filter state + lightbox (useState, keyboard nav, Dialog)

import { useCallback, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryCategory, GalleryPreviewData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface GalleryMosaicProps {
  data: GalleryPreviewData;
}

type Filter = GalleryCategory | "all";

// Pill order; only categories that actually appear are shown.
const CATEGORY_ORDER: GalleryCategory[] = [
  "villas-rooms",
  "dining-bar",
  "grounds-pool",
  "beach-sea",
];

export function GalleryMosaic({ data }: GalleryMosaicProps) {
  const { t, tl } = useLanguage();
  const [filter, setFilter] = useState<Filter>("all");
  const [index, setIndex] = useState<number | null>(null);

  const images = data.images;
  const shown = filter === "all" ? images : images.filter((img) => img.category === filter);
  const tabs: Filter[] = [
    "all",
    ...CATEGORY_ORDER.filter((c) => images.some((img) => img.category === c)),
  ];

  const open = index !== null;
  const current = open ? shown[index] : null;

  const step = useCallback(
    (dir: 1 | -1) =>
      setIndex((i) => (i === null ? i : (i + dir + shown.length) % shown.length)),
    [shown.length]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  };

  return (
    <section id="gallery" className="py-8 md:py-16 bg-sand">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8">
        {/* ── Filter pills ── */}
        {tabs.length > 1 && (
          <div
            role="group"
            aria-label={tl.gallery.filterAria}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12"
          >
            {tabs.map((tab) => {
              const activeTab = tab === filter;
              return (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={activeTab}
                  onClick={() => { setFilter(tab); setIndex(null); }}
                  className={cn(
                    "font-sans font-medium text-xs md:text-sm tracking-wide px-4 py-2 rounded-full border transition-colors duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-sand",
                    activeTab
                      // charcoal on the teal fill (7.21:1); white was 2.41:1.
                      ? "bg-brand-teal border-brand-teal text-charcoal"
                      // stone was 3.43:1 on the sand ground behind these pills.
                      : "bg-transparent border-charcoal/15 text-charcoal/70 hover:border-brand-teal hover:text-accent-text"
                  )}
                >
                  {tl.gallery.filters[tab]}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Masonry (CSS columns) ── */}
        <div className="columns-2 md:columns-3 xl:columns-4 gap-3 md:gap-4">
          {shown.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full mb-3 md:mb-4 overflow-hidden rounded-md shadow-sm break-inside-avoid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width ?? 1200}
                height={img.height ?? 900}
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="w-full h-auto transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      <Dialog open={open} onOpenChange={(o) => { if (!o) setIndex(null); }}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPopup
            onKeyDown={onKeyDown}
            onClick={() => setIndex(null)}
            className="text-white"
            aria-label={t(data.heading)}
          >
            <DialogTitle className="sr-only">{t(data.heading)}</DialogTitle>

            {/* Top bar: counter + close */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 shrink-0">
              <span aria-live="polite" className="font-sans text-sm text-white/80 tabular-nums">
                {open ? `${index + 1} / ${shown.length}` : ""}
              </span>
              <DialogClose
                aria-label={tl.gallery.closeLightbox}
                className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X size={22} strokeWidth={1.6} />
              </DialogClose>
            </div>

            {/* Image stage */}
            <div className="relative flex-1 min-h-0 px-4 sm:px-12 md:px-20 pb-4">
              {current && (
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              )}

              {shown.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); step(-1); }}
                    aria-label={tl.gallery.previousImage}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded-full p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ChevronLeft size={24} strokeWidth={1.6} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); step(1); }}
                    aria-label={tl.gallery.nextImage}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded-full p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ChevronRight size={24} strokeWidth={1.6} />
                  </button>
                </>
              )}
            </div>

            {/* Caption */}
            {current && (
              <p className="shrink-0 px-6 pb-5 pt-1 text-center font-sans text-xs md:text-sm text-white/70 max-w-3xl mx-auto leading-relaxed">
                {current.alt}
              </p>
            )}
          </DialogPopup>
        </DialogPortal>
      </Dialog>
    </section>
  );
}
