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

  // Hide content as soon as the page leaves scrollY 0; restore only after the user
  // has been back at the top for ~250ms. The delay absorbs iOS overscroll bounces
  // and URL-bar collapse twitches that briefly report scrollY === 0 mid-scroll —
  // without it, the 500ms fade-in re-triggers and the content visibly reappears.
  useEffect(() => {
    let showTimer = 0;
    const onScroll = () => {
      clearTimeout(showTimer);
      if (window.scrollY > 0) setScrolled(true);
      else showTimer = window.setTimeout(() => setScrolled(false), 250);
    };
    onScroll(); // sync initial state on reload
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(showTimer);
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
    <section className="relative h-[110svh] w-full overflow-hidden bg-black">
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
        className={`relative z-10 flex h-[100svh] flex-col items-center justify-center px-6 text-center text-white ${!scrolled ? "transition-opacity duration-500" : ""} ${scrolled || !appeared ? "opacity-0 pointer-events-none" : "opacity-100"}`}
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
          className="absolute bottom-10 md:bottom-10 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.4 }}
        >
          <svg width="28" height="16" viewBox="0 0 28 16" fill="none" aria-hidden="true">
            <polyline points="2,2 14,13 26,2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          </svg>
        </m.div>
      </div>

      {/* Video pause button — always visible on desktop, shown after scroll on mobile */}
      {hero.video && (
        <button
          onClick={toggleVideo}
          aria-label={paused ? tl.hero.playVideo : tl.hero.pauseVideo}
          className="absolute bottom-8 right-8 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
      )}
      {/* Mobile: pause button appears after hero text fades on scroll */}
      <div className={`md:hidden ${scrolled ? "block" : "hidden"}`}>
        {hero.video && (
          <button
            onClick={toggleVideo}
            aria-label={paused ? tl.hero.playVideo : tl.hero.pauseVideo}
            className="absolute bottom-8 right-8 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        )}
      </div>
    </section>
  );
}
