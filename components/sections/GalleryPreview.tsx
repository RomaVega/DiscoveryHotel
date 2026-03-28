"use client"; // Uses lightbox state, keyboard navigation, and touch swipe

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import type { GalleryPreviewData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface GalleryPreviewProps {
  data: GalleryPreviewData;
  defaultExpanded?: boolean;
  hideHeading?: boolean;
}

export function GalleryPreview({ data, defaultExpanded = false, hideHeading = false }: GalleryPreviewProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right
  const [expanded, setExpanded] = useState(defaultExpanded);
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { t, tl } = useLanguage();

  const total = data.images.length;

  const openLightbox = (index: number) => { setDirection(0); setLightboxIndex(index); };

  const closeLightbox = () => {
    const idx = lightboxIndex;
    setLightboxIndex(null);
    // Return focus to the image button that opened the lightbox
    setTimeout(() => { triggerRefs.current[idx!]?.focus(); }, 0);
  };

  // Move focus into lightbox when it opens
  useEffect(() => {
    if (lightboxIndex !== null) {
      setTimeout(() => { closeBtnRef.current?.focus(); }, 50);
    }
  }, [lightboxIndex]);

  const goNext = useCallback(() => {
    setDirection(1);
    setLightboxIndex((i) => (i !== null ? (i + 1) % total : null));
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setLightboxIndex((i) => (i !== null ? (i - 1 + total) % total : null));
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, goNext, goPrev]);

  const currentImage = lightboxIndex !== null ? data.images[lightboxIndex] : null;

  const slideVariants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -60, opacity: 0 }),
  };

  return (
    <section id="gallery" ref={sectionRef} className="pt-6 md:pt-32 pb-6 md:pb-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        {!hideHeading && (
          <FadeIn>
            <SectionHeading label={t(data.label)} heading={t(data.heading)} />
          </FadeIn>
        )}

        <div className="relative">
          <div
            className={cn(
              "grid grid-cols-1 gap-1 overflow-hidden transition-all duration-700 ease-in-out",
              "md:grid-cols-4 md:auto-rows-[210px]",
              expanded ? "max-h-[9999px]" : "max-h-[420px] md:max-h-[680px]"
            )}
          >
            {data.images.map((img, i) => {
              const isBig = i % 5 === 0;
              return (
                <FadeIn key={img.src} delay={Math.min(i, 5) * 0.1}>
                  <button
                    ref={(el) => { triggerRefs.current[i] = el; }}
                    onClick={() => openLightbox(i)}
                    className={cn(
                      "relative w-full h-full group focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2",
                      "aspect-[4/3] md:aspect-auto",
                      isBig ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"
                    )}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
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
              );
            })}
          </div>

          {/* Peek gradient */}
          {!expanded && (
            <div
              className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-ivory via-ivory/60 to-transparent pointer-events-none"
              style={{
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)",
              }}
            />
          )}
        </div>

      </div>

      {/* Lightbox */}
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
            {/* Backdrop */}
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
              {/* Image container — swipeable on mobile */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={lightboxIndex}
                    className="absolute inset-0"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(_e, info) => {
                      if (info.offset.x < -50) goNext();
                      else if (info.offset.x > 50) goPrev();
                    }}
                  >
                    <Image
                      src={currentImage.src}
                      alt={currentImage.alt}
                      fill
                      sizes="(max-width: 512px) 90vw, 512px"
                      className="object-cover pointer-events-none"
                      draggable={false}
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
                ref={closeBtnRef}
                onClick={closeLightbox}
                aria-label={tl.gallery.closeLightbox}
                className="absolute top-2 right-2 md:-top-4 md:-right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white text-charcoal shadow-lg hover:bg-white/90 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-teal"
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
