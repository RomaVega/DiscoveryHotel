"use client"; // Uses framer-motion for hero animation, video element, and scroll listener

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import type { HeroData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface HeroImageProps {
  hero: HeroData;
}

export function HeroImage({ hero }: HeroImageProps) {
  const [paused, setPaused] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const pauseBtnRef = useRef<HTMLDivElement>(null);
  const isHiddenRef = useRef(false);

  // One-way hide: text shows on load, fades on first scroll, never returns
  useEffect(() => {
    const hide = () => {
      if (isHiddenRef.current) return;
      if (window.scrollY <= 3) return;
      isHiddenRef.current = true;
      if (contentRef.current) {
        contentRef.current.style.transition = "opacity 0.3s ease-out";
        contentRef.current.style.opacity = "0";
        contentRef.current.style.pointerEvents = "none";
      }
      if (indicatorRef.current) {
        indicatorRef.current.style.transition = "opacity 0.3s ease-out";
        indicatorRef.current.style.opacity = "0";
      }
      if (pauseBtnRef.current) pauseBtnRef.current.style.display = "block";
      window.removeEventListener("scroll", hide);
    };
    window.addEventListener("scroll", hide, { passive: true });
    return () => window.removeEventListener("scroll", hide);
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const { t, tl } = useLanguage();


  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  // Measure all title lines, find the widest, then stretch the narrower ones via letter-spacing.
  useLayoutEffect(() => {
    const sync = () => {
      // Reset all including line3 to clear any residual inline style
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
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const fadeUp = (delay: number) =>
    reducedMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.8,
            delay,
            ease: [0.25, 0.1, 0.25, 1] as const,
          },
        };

  const toggleVideo = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setPaused(false);
      } else {
        video.pause();
        setPaused(true);
      }
    }
  };

  return (
    <section className="relative h-[100svh] md:h-[100vh] w-full overflow-hidden bg-black">
      {hero.video ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={hero.image}
          className="absolute inset-0 h-full w-full object-cover"
        >
          {hero.videoMobile && (
            <>
              <source src={hero.videoMobile.replace(".mp4", ".webm")} type="video/webm" media="(max-width: 767px)" />
              <source src={hero.videoMobile} type="video/mp4" media="(max-width: 767px)" />
            </>
          )}
          <source src={hero.video.replace(".mp4", ".webm")} type="video/webm" />
          <source src={hero.video} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Fallback image for video poster */}
      {hero.video && (
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover -z-10"
        />
      )}

      {/* Soft cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex h-[100svh] md:h-[100vh] flex-col items-center justify-center px-6 text-center text-white"
      >
        {/* Logo */}
        <motion.div {...fadeUp(0.2)}>
          <Image
            src="/images/logo/logo-dark.svg"
            alt="Orlowsky Discovery Hotel logo"
            width={140}
            height={140}
            priority
            className="w-24 h-24 md:w-[120px] md:h-[120px] mb-4 md:mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
          />
        </motion.div>

        {/* Title block */}
        <h1 className="font-serif text-shadow-strong text-center">
          <motion.span
            {...fadeUp(0.3)}
            className="block text-[2.25rem] md:text-[2.75rem] lg:text-[3.5rem] tracking-[0.22em] uppercase font-light leading-none"
          >
            <span ref={line1Ref}>{hero.titleLine1}</span>
          </motion.span>

          <motion.span
            {...fadeUp(0.45)}
            className="block text-[2.625rem] md:text-[3rem] lg:text-[3.75rem] italic font-light mt-3 md:mt-3 leading-snug"
          >
            <span ref={line2Ref}>{hero.titleLine2}</span>
          </motion.span>

          {hero.titleLine4 && (
            <motion.span
              {...fadeUp(0.55)}
              className="block text-[2.625rem] md:text-[3rem] lg:text-[3.75rem] italic font-light mt-1 md:mt-2 leading-snug"
            >
              <span ref={line3Ref}>{hero.titleLine4}</span>
            </motion.span>
          )}

          <div className="w-fit mx-auto mt-10 md:mt-10">
            <motion.span
              {...fadeUp(0.55)}
              className="block text-xl md:text-xl lg:text-2xl tracking-[0.3em] uppercase font-semibold"
            >
              {hero.titleLine3}
            </motion.span>

            {/* Stars aligned to width of titleLine3 */}
            <div className="relative">
              <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 block h-px w-8 bg-white/30" />
              <motion.div
                {...fadeUp(0.65)}
                className="mt-2 flex justify-between text-sm md:text-base translate-x-[1px] pr-[0.34rem] md:pr-[0.45rem] lg:pr-[0.56rem]" style={{ color: "#C9A84C" }}
              >
                {"★ ★ ★ ★".split(" ").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </motion.div>
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 block h-px w-8 bg-white/30" />
            </div>
          </div>
        </h1>

        {/* Subtitle */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <motion.p
            {...fadeUp(0.75)}
            className="font-sans font-light text-sm md:text-sm tracking-[0.2em] uppercase text-white/95 text-shadow-strong"
          >
            Cottages &amp; Villas
          </motion.p>
          <motion.p
            {...fadeUp(0.85)}
            className="font-sans font-light text-xs md:text-xs tracking-[0.18em] uppercase text-white/80 text-shadow-strong"
          >
            Bar&nbsp;·&nbsp;Restaurant&nbsp;·&nbsp;Ayurvedic Spa
          </motion.p>
        </div>

        {/* CTA */}
        <motion.a
          {...fadeUp(0.9)}
          href={hero.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 md:mt-20 inline-block bg-black/15 hover:bg-black/30 text-white border border-white/60 hover:border-white rounded-full font-sans font-light px-10 py-3.5 tracking-[0.25em] uppercase text-xs transition-all duration-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
        >
          {t(hero.cta)}
        </motion.a>
      </div>


      {/* Scroll indicator */}
      <div ref={indicatorRef}>
        <motion.div
          className="absolute bottom-10 md:bottom-10 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1.8, duration: 0.8 },
            y: { delay: 1.8, duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.4 },
          }}
        >
          <svg width="28" height="16" viewBox="0 0 28 16" fill="none" aria-hidden="true">
            <polyline points="2,2 14,13 26,2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          </svg>
        </motion.div>
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
      {/* Mobile: pause button appears after text fades */}
      <div ref={pauseBtnRef} style={{ display: "none" }} className="md:hidden">
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
