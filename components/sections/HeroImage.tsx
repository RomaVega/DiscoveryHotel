"use client"; // Uses framer-motion for hero animation, video element, and scroll listener

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { Pause, Play } from "lucide-react";
import type { HeroData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface HeroImageProps {
  hero: HeroData;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";


export function HeroImage({ hero }: HeroImageProps) {
  const [paused, setPaused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [appeared, setAppeared] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAppeared(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Hide content the instant the page leaves scrollY 0; restore ONLY once scrolling
  // has fully stopped at the top. iOS momentum scroll fires `scroll` events with
  // scrollY === 0 well before motion visibly stops, so a timer-based check would
  // re-show the hero mid-glide. `scrollend` fires only after the scroller settles
  // (including iOS momentum + rubber-band), which is exactly what we want.
  useEffect(() => {
    const hideIfScrolled = () => {
      if (window.scrollY > 0) setScrolled(true);
    };
    const showIfAtTop = () => {
      if (window.scrollY === 0) setScrolled(false);
    };
    hideIfScrolled(); // sync initial state on reload

    window.addEventListener("scroll", hideIfScrolled, { passive: true });

    const supportsScrollEnd = "onscrollend" in window;
    const scrollEndType = "scrollend" as keyof WindowEventMap;

    if (supportsScrollEnd) {
      window.addEventListener(scrollEndType, showIfAtTop);
      return () => {
        window.removeEventListener("scroll", hideIfScrolled);
        window.removeEventListener(scrollEndType, showIfAtTop);
      };
    }

    // Fallback for browsers without scrollend (older Safari): wait until scroll
    // events have been quiet for 500ms with scrollY === 0.
    let idleTimer = 0;
    const scheduleShow = () => {
      clearTimeout(idleTimer);
      if (window.scrollY === 0) {
        idleTimer = window.setTimeout(() => {
          if (window.scrollY === 0) setScrolled(false);
        }, 500);
      }
    };
    window.addEventListener("scroll", scheduleShow, { passive: true });
    return () => {
      window.removeEventListener("scroll", hideIfScrolled);
      window.removeEventListener("scroll", scheduleShow);
      clearTimeout(idleTimer);
    };
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Render only the device-appropriate video so we never download both clips at once.
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  useLayoutEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  // Warm-then-rewind: let the video autoplay invisibly to warm the decoder pipeline
  // and fetch eagerly. Once 6 frames are painted (decoder hot), pause and seek back
  // to 0, then reveal + play — so visible playback always starts at frame 0 with no
  // mid-stream jump. Mutate opacity via DOM ref to avoid a React re-render.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let revealed = false;
    let handle = 0;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      v.style.opacity = "1";
      if (v.paused) v.play().catch(() => {});
    };
    const timer = setTimeout(reveal, 2500); // safety fallback
    if (typeof v.requestVideoFrameCallback === "function") {
      let count = 0;
      const cb = () => {
        count++;
        if (count >= 6) {
          v.pause();
          v.currentTime = 0;
          requestAnimationFrame(reveal); // ensure seek lands before opacity flip
          return;
        }
        handle = v.requestVideoFrameCallback(cb);
      };
      handle = v.requestVideoFrameCallback(cb);
    }
    return () => {
      clearTimeout(timer);
      if (handle && typeof v.cancelVideoFrameCallback === "function") v.cancelVideoFrameCallback(handle);
    };
  }, []);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const { t, tl } = useLanguage();

  // Measure all title lines, find the widest, then stretch the narrower ones via letter-spacing.
  // Must wait for the serif webfont — measuring against fallback-font metrics produces wrong widths.
  useLayoutEffect(() => {
    const sync = () => {
      [line1Ref, line2Ref, line3Ref].forEach(r => { if (r.current) r.current.style.letterSpacing = ""; });
      const refs = [line1Ref, line2Ref].map(r => r.current).filter(Boolean) as HTMLSpanElement[];
      const widths = refs.map(el => el.getBoundingClientRect().width);
      const max = Math.max(...widths);
      refs.forEach((el, i) => {
        const diff = max - widths[i];
        const chars = (el.textContent ?? "").length;
        if (diff > 0 && chars > 0) el.style.letterSpacing = `${diff / chars}px`;
      });
    };
    document.fonts?.ready.then(sync).catch(() => sync());
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);


  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); setPaused(false); }
    else { video.pause(); setPaused(true); }
  };

  return (
    <section className="relative h-svh w-full overflow-hidden bg-black">
      {/* Always-on poster layer. Acts as SSR fallback before isMobile resolves and as the
          poster the video sits over once it mounts. One <Image> means one LCP fetch.
          isMobile is null on SSR/before layout-effect; falls back to desktop poster. */}
      <Image
        src={isMobile && hero.imageMobile ? hero.imageMobile : (hero.imagePoster ?? hero.image)}
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {hero.video && (
        <video
          ref={videoRef}
          autoPlay muted loop playsInline preload="auto"
          style={{ opacity: 0, willChange: "opacity", transform: "translateZ(0)" }}
          className="absolute inset-0 h-full w-full object-cover"
        >
          {/* Browser picks the first matching source at parse time, so the <video>
              renders in SSR and only the device-appropriate clip is fetched. */}
          {hero.videoMobile && (
            <source
              src={`${BASE_PATH}${hero.videoMobile}`}
              media="(max-width: 767px)"
              type="video/mp4"
            />
          )}
          <source src={`${BASE_PATH}${hero.video}`} type="video/mp4" />
        </video>
      )}

      {/* Soft cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />

      {/* Content — fades in on mount, disappears instantly on scroll.
          will-change + translateZ promote the overlay to its own GPU layer up-front, so the
          fade-in is pure compositor work and doesn't contend with the video decoder's HW
          acceleration kick-in (which happens in the same ~500ms window). */}
      <div
        style={{ willChange: "opacity", transform: "translateZ(0)" }}
        className={`relative z-10 flex h-svh flex-col items-center justify-center px-6 text-center text-white ${!scrolled ? "transition-opacity duration-500" : ""} ${scrolled || !appeared ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        {/* Logo */}
        <Image
          src="/images/logo/logo-dark.webp"
          alt="Orlowsky Discovery Hotel logo"
          width={140}
          height={140}
          priority
          className="w-24 h-24 md:w-[96px] md:h-[96px] lg:w-[108px] lg:h-[108px] mb-4 md:mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
        />

        {/* Title block */}
        <h1 className="font-serif text-shadow-strong text-center">
          <span className="block text-[2.25rem] md:text-[2.25rem] lg:text-[2.5rem] tracking-[0.22em] uppercase font-light leading-none">
            <span ref={line1Ref}>{hero.titleLine1}</span>
          </span>

          <span className="block text-[2.625rem] md:text-[2.625rem] lg:text-[2.875rem] italic font-light mt-3 md:mt-3 leading-snug">
            <span ref={line2Ref}>{hero.titleLine2}</span>
          </span>

          {hero.titleLine4 && (
            <span className="block text-[2.625rem] md:text-[2.625rem] lg:text-[2.875rem] italic font-light mt-1 md:mt-2 leading-snug">
              <span ref={line3Ref}>{hero.titleLine4}</span>
            </span>
          )}

          <div className="w-fit mx-auto mt-10 md:mt-10">
            <span className="block text-xl md:text-xl lg:text-xl tracking-[0.3em] uppercase font-semibold">
              {hero.titleLine3}
            </span>

            {/* Stars aligned to width of titleLine3 */}
            <div className="relative">
              <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 block h-px w-8 bg-white/30" />
              <div
                className="mt-2 flex justify-between text-sm md:text-base translate-x-[1px] pr-[0.34rem] md:pr-[0.45rem] lg:pr-[0.56rem]"
                style={{ color: "#C9A84C" }}
              >
                {"★ ★ ★ ★".split(" ").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 block h-px w-8 bg-white/30" />
            </div>
          </div>
        </h1>

        {/* Subtitle */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="font-sans font-light text-sm md:text-sm tracking-[0.2em] uppercase text-white/95 text-shadow-strong">
            Cottages &amp; Villas
          </p>
          <p className="font-sans font-light text-xs md:text-xs tracking-[0.18em] uppercase text-white/80 text-shadow-strong">
            Bar&nbsp;·&nbsp;Restaurant&nbsp;·&nbsp;Ayurvedic Spa
          </p>
        </div>

        {/* CTA */}
        <a
          href={hero.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 md:mt-10 inline-block bg-black/15 hover:bg-black/30 text-white border border-white/60 hover:border-white rounded-full font-sans font-light px-8 py-3 tracking-[0.22em] uppercase text-xs transition-all duration-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
        >
          {t(hero.cta)}
        </a>
      </div>

      {/* Scroll indicator */}
      <div className={`${!scrolled ? "transition-opacity duration-500" : ""} ${scrolled || !appeared ? "opacity-0" : ""}`}>
        <m.div
          className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.4 }}
        >
          <svg width="28" height="16" viewBox="0 0 28 16" fill="none" aria-hidden="true">
            <polyline points="2,2 14,13 26,2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          </svg>
        </m.div>
      </div>

      {/* Video pause toggle — quiet by default, brightens on hover/focus so it
          stays noticeable to a new visitor without competing with hero content. */}
      {hero.video && (
        <button
          onClick={toggleVideo}
          aria-label={paused ? tl.hero.playVideo : tl.hero.pauseVideo}
          className="absolute bottom-6 right-8 -mr-2 md:bottom-8 z-10 p-2 text-white opacity-40 hover:opacity-100 transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-brand-teal drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
        >
          {paused ? <Play size={24} /> : <Pause size={24} />}
        </button>
      )}
    </section>
  );
}
