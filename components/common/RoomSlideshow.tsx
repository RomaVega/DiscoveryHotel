"use client"; // Uses useState, useEffect for slideshow controls

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SlideImage {
  src: string;
  alt: string;
}

interface RoomSlideshowProps {
  images: SlideImage[];
  sizes?: string;
  className?: string;
  autoAdvanceMs?: number;
  current?: number;
  onNavigate?: (i: number) => void;
}

export function RoomSlideshow({
  images,
  sizes = "100vw",
  className,
  autoAdvanceMs = 3000,
  current: controlledCurrent,
  onNavigate,
}: RoomSlideshowProps) {
  const [internalCurrent, setInternalCurrent] = useState(0);
  const current = controlledCurrent ?? internalCurrent;
  const setCurrent = onNavigate ?? setInternalCurrent;

  const [loaded, setLoaded] = useState<Record<number, boolean>>({ 0: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paused = useRef(false);

  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (images.length <= 1 || paused.current) return;
    const next = (current + 1) % images.length;
    const advance = () => setCurrent(next);
    if (loaded[next]) {
      timerRef.current = setTimeout(advance, autoAdvanceMs);
    } else {
      timerRef.current = setTimeout(() => {
        timerRef.current = setTimeout(advance, 200);
      }, autoAdvanceMs);
    }
  }, [images.length, autoAdvanceMs, current, loaded, setCurrent]);

  useEffect(() => {
    scheduleNext();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, scheduleNext]);

  const prev = useCallback(() => {
    paused.current = true;
    setCurrent((current - 1 + images.length) % images.length);
  }, [images.length, setCurrent, current]);

  const next = useCallback(() => {
    paused.current = true;
    setCurrent((current + 1) % images.length);
  }, [images.length, setCurrent, current]);

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  }, [next, prev]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    },
    [prev, next]
  );

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={images[0].src} alt={images[0].alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden group", className)}
      onMouseEnter={() => { paused.current = true; if (timerRef.current) clearTimeout(timerRef.current); }}
      onMouseLeave={() => { paused.current = false; scheduleNext(); }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="region"
      aria-label="Room photo slideshow"
    >
      {/* Preload next slide */}
      <div className="absolute inset-0 opacity-0 pointer-events-none" aria-hidden="true">
        <Image
          src={images[(current + 1) % images.length].src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
          onLoad={() => setLoaded((prev) => ({ ...prev, [(current + 1) % images.length]: true }))}
        />
      </div>

      {/* Slides */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Image
            src={images[current].src}
            alt={images[current].alt}
            fill
            sizes={sizes}
            priority={current === 0}
            className="object-cover"
            onLoad={() => setLoaded((prev) => ({ ...prev, [current]: true }))}
          />
        </motion.div>
      </AnimatePresence>

      {/* Prev arrow */}
      <button
        onClick={prev}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-black/30 hover:bg-black/55 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronLeft size={18} strokeWidth={2} />
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-black/30 hover:bg-black/55 text-white rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronRight size={18} strokeWidth={2} />
      </button>

      {/* Dots — always on mobile, hidden on desktop when thumbnails handle navigation */}
      {(!onNavigate || true) && (
        <div className={cn("absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10", onNavigate && "lg:hidden")} role="tablist">
          {images.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Photo ${i + 1} of ${images.length}`}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === current ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="absolute top-3 right-3 z-10 text-white/80 text-xs font-sans tabular-nums bg-black/25 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}
