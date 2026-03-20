"use client"; // Uses useEffect + useRef for rAF-driven marquee

import { useEffect, useRef, useCallback, useState } from "react";
import { Star } from "lucide-react";
import type { Review } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface ReviewScrollerProps {
  reviews: Review[];
}

function SourceBadge({ source }: { source: Review["source"] }) {
  if (source === "booking") {
    return (
      <span className="inline-flex items-center gap-1 font-sans text-[10px] font-semibold tracking-wide text-[#003580]">
        <span className="w-3.5 h-3.5 rounded-sm bg-[#003580] flex items-center justify-center shrink-0">
          <span className="text-white font-bold" style={{ fontSize: 8, lineHeight: 1 }}>B</span>
        </span>
        Booking.com
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-sans text-[10px] font-semibold tracking-wide text-[#4285F4]">
      <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
      Google
    </span>
  );
}

function ReviewCard({ review, t }: { review: Review; t: (v: Review["text"]) => string }) {
  const author = t(review.author);
  const text = t(review.text);

  return (
    <article
      className="shrink-0 w-72 bg-ivory rounded-sm border border-charcoal/8 px-6 py-5 flex flex-col gap-3 select-none"
      aria-label={`Review by ${author}`}
    >
      <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < review.rating ? "text-brand-teal fill-brand-teal" : "text-charcoal/15 fill-charcoal/15"}
          />
        ))}
      </div>

      <p className="font-sans text-[13px] leading-relaxed text-charcoal/80 line-clamp-4">
        &ldquo;{text}&rdquo;
      </p>

      <div className="flex items-end justify-between gap-2 pt-1 border-t border-charcoal/8">
        <div className="min-w-0">
          <p className="font-sans text-xs font-semibold text-charcoal truncate">{author}</p>
          {review.country && (
            <p className="font-sans text-[10px] text-stone/70 mt-0.5 truncate">{review.country} · {review.date}</p>
          )}
        </div>
        <SourceBadge source={review.source} />
      </div>
    </article>
  );
}

/** Pixels per second — mobile is faster since less visible at once */
const SPEED_DESKTOP = 60;
const SPEED_MOBILE = 65;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ReviewScroller({ reviews }: ReviewScrollerProps) {
  const { t } = useLanguage();
  // Start with original order (matches SSR), shuffle after hydration
  const [shuffled, setShuffled] = useState<Review[]>(reviews);
  useEffect(() => { setShuffled(shuffle(reviews)); }, [reviews]);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const xRef = useRef(0);

  const dragStartXRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    pausedRef.current = true;
    dragStartXRef.current = e.clientX;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!pausedRef.current) return;
    const delta = e.clientX - dragStartXRef.current;
    dragStartXRef.current = e.clientX;
    const setWidth = setRef.current?.offsetWidth ?? 0;
    if (!setWidth) return;
    xRef.current += delta;
    if (xRef.current > 0) xRef.current -= setWidth;
    if (xRef.current <= -setWidth) xRef.current += setWidth;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
  }, []);

  const handleMouseUp = useCallback(() => { pausedRef.current = false; }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    pausedRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - dragStartXRef.current;
    dragStartXRef.current = e.touches[0].clientX;
    const setWidth = setRef.current?.offsetWidth ?? 0;
    if (!setWidth) return;
    xRef.current += delta;
    if (xRef.current > 0) xRef.current -= setWidth;
    if (xRef.current <= -setWidth) xRef.current += setWidth;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
  }, []);

  const handleTouchEnd = useCallback(() => { pausedRef.current = false; }, []);

  // Non-passive native listener — prevents browser horizontal scroll/navigation during swipe
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let startX = 0;
    let startY = 0;
    let isHorizontal: boolean | null = null;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isHorizontal = null;
    };
    const onMove = (e: TouchEvent) => {
      if (isHorizontal === null) {
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);
        isHorizontal = dx > dy;
      }
      if (isHorizontal) e.preventDefault();
    };
    track.addEventListener("touchstart", onStart, { passive: true });
    track.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      track.removeEventListener("touchstart", onStart);
      track.removeEventListener("touchmove", onMove);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const set = setRef.current;
    if (!track || !set) return;

    let rafId: number;
    let lastTime = 0;

    const tick = (time: number) => {
      if (lastTime === 0) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!pausedRef.current) {
        const speed = window.innerWidth < 768 ? SPEED_MOBILE : SPEED_DESKTOP;
        // Measure each frame in case of resize
        const setWidth = set.offsetWidth;
        xRef.current -= speed * dt;
        // When we've scrolled past one full set, wrap around
        if (xRef.current <= -setWidth) {
          xRef.current += setWidth;
        }
        track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section className="py-16 md:py-20 bg-sand overflow-hidden" aria-label="Guest reviews">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="font-sans text-xs tracking-widest uppercase text-brand-teal mb-3">
          Guest Reviews
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal">
          What Our Guests Say
        </h2>
      </div>

      {/* Track — two identical sets; JS scrolls by exact measured pixel width */}
      <div
        ref={trackRef}
        className="flex"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{ willChange: "transform", cursor: "grab" }}
        aria-hidden="true"
      >
        <div ref={setRef} className="flex gap-5 shrink-0 pr-5">
          {shuffled.map((review, i) => (
            <ReviewCard key={i} review={review} t={t} />
          ))}
        </div>
        <div className="flex gap-5 shrink-0 pr-5">
          {shuffled.map((review, i) => (
            <ReviewCard key={`dup-${i}`} review={review} t={t} />
          ))}
        </div>
      </div>

      {/* Screen-reader accessible static list */}
      <ul className="sr-only">
        {shuffled.map((review, i) => (
          <li key={i}>
            {t(review.author)}, {review.rating}/5: {t(review.text)}
          </li>
        ))}
      </ul>
    </section>
  );
}
