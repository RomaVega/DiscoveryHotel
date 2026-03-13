"use client"; // Uses lightbox state and keyboard navigation

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { GalleryPreviewData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface GalleryPreviewProps {
  data: GalleryPreviewData;
}

export function GalleryPreview({ data }: GalleryPreviewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { t, tl } = useLanguage();

  const total = data.images.length;
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  // Stable callbacks for prev/next buttons — use functional update to avoid stale closure
  const goNext = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % total : null)),
    [total]
  );
  const goPrev = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + total) % total : null)),
    [total]
  );

  // Keyboard navigation — uses functional update directly, no dependency on goNext/goPrev
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i !== null ? (i + 1) % total : null));
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i !== null ? (i - 1 + total) % total : null));
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, total]);

  const currentImage =
    lightboxIndex !== null ? data.images[lightboxIndex] : null;

  return (
    <section id="gallery" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading label={t(data.label)} heading={t(data.heading)} />
        </FadeIn>

        <div className="relative">
          <div
            className={cn(
              "grid grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden transition-all duration-700 ease-in-out",
              expanded ? "max-h-[9999px]" : "max-h-[420px] md:max-h-[680px]"
            )}
          >
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
            <div
              className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-ivory via-ivory/60 to-transparent pointer-events-none"
              style={{
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to top, black 40%, transparent 100%)",
              }}
            />
          )}
        </div>

        <FadeIn>
          <div className="mt-12 text-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-block bg-brand-teal hover:bg-deep-teal text-white font-sans font-semibold px-8 py-3 rounded-sm tracking-wide uppercase text-sm transition-colors duration-300"
            >
              {expanded ? tl.gallery.showLess : tl.gallery.showMore}
            </button>
          </div>
        </FadeIn>
      </div>

      {/* Compact Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && currentImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={currentImage.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop with blur */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={closeLightbox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Card */}
            <motion.div
              className="relative z-10 w-[90vw] max-w-lg bg-white/5 border border-white/10 p-3 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Image container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={lightboxIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={currentImage.src}
                      alt={currentImage.alt}
                      fill
                      sizes="(max-width: 512px) 90vw, 512px"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-between pt-3 px-1">
                <button
                  onClick={goPrev}
                  aria-label={tl.gallery.previousImage}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors duration-200"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="font-sans text-xs tracking-[0.15em] text-white/40 uppercase">
                  {lightboxIndex + 1} / {total}
                </span>

                <button
                  onClick={goNext}
                  aria-label={tl.gallery.nextImage}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors duration-200"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Close button */}
              <button
                onClick={closeLightbox}
                aria-label={tl.gallery.closeLightbox}
                className="absolute top-2 right-2 md:-top-4 md:-right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white text-charcoal shadow-lg hover:bg-white/90 transition-colors duration-200"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
