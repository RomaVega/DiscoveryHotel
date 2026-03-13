"use client"; // Uses Dialog state for lightbox

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryPreviewData } from "@/lib/types";

interface GalleryPreviewProps {
  data: GalleryPreviewData;
}

export function GalleryPreview({ data }: GalleryPreviewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % data.images.length);
    }
  }, [lightboxIndex, data.images.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + data.images.length) % data.images.length
      );
    }
  }, [lightboxIndex, data.images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, goNext, goPrev]);

  const currentImage =
    lightboxIndex !== null ? data.images[lightboxIndex] : null;

  return (
    <section id="gallery" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading label={data.label} heading={data.heading} />
        </FadeIn>

        <div className="relative">
          <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden transition-all duration-700 ease-in-out ${expanded ? "max-h-[9999px]" : "max-h-[420px] md:max-h-[680px]"}`}>
            {data.images.map((img, i) => (
              <FadeIn key={img.src} delay={Math.min(i, 5) * 0.1}>
                <button
                  onClick={() => openLightbox(i)}
                  className="relative aspect-square group w-full focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <ZoomIn
                      size={28}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>

          {/* Peek gradient */}
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-ivory via-ivory/60 to-transparent pointer-events-none" style={{ backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", maskImage: "linear-gradient(to top, black 40%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)" }} />
          )}
        </div>

        <FadeIn>
          <div className="mt-12 text-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-block bg-brand-teal hover:bg-deep-teal text-white font-sans font-semibold px-8 py-3 rounded-sm tracking-wide uppercase text-sm transition-colors duration-300"
            >
              {expanded ? "Show Less" : "Show More"}
            </button>
          </div>
        </FadeIn>
      </div>

      {/* Lightbox */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && closeLightbox()}
      >
        <DialogContent
          showCloseButton={false}
          className="fixed inset-4 sm:inset-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-5xl h-[calc(100vh-4rem)] sm:h-[calc(100vh-8rem)] sm:max-w-5xl p-0 bg-black/95 border-none rounded-none ring-0 gap-0"
        >
          <DialogTitle className="sr-only">
            {currentImage?.alt ?? "Gallery image"}
          </DialogTitle>

          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {currentImage && (
            <div className="relative w-full h-full">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          )}

          {/* Navigation */}
          <button
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 font-sans text-sm text-white/50">
            {lightboxIndex !== null ? lightboxIndex + 1 : 0} / {data.images.length}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
