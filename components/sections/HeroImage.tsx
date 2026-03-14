"use client"; // Uses framer-motion for hero animation and video element

import { useState, useRef } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const { t, tl } = useLanguage();

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
    <section className="relative h-screen w-full overflow-hidden">
      {hero.video ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={hero.image}
          className="absolute inset-0 h-full w-full object-cover"
        >
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        {/* Logo */}
        <motion.div {...fadeUp(0.2)}>
          <Image
            src="/images/logo/logo-dark.svg"
            alt="Orlowsky Discovery Hotel logo"
            width={90}
            height={90}
            priority
            className="mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
          />
        </motion.div>

        {/* Title block */}
        <h1 className="font-serif text-shadow-subtle text-center">
          <motion.span
            {...fadeUp(0.3)}
            className="block text-3xl md:text-5xl lg:text-7xl italic font-light"
          >
            {hero.titleLine1}
          </motion.span>

          <motion.span
            {...fadeUp(0.45)}
            className="block text-3xl md:text-5xl lg:text-7xl italic font-light mt-3 leading-tight"
          >
            {hero.titleLine2}
          </motion.span>

          <motion.span
            {...fadeUp(0.55)}
            className="block text-sm md:text-base tracking-[0.3em] uppercase font-light mt-3"
          >
            {hero.titleLine3}
          </motion.span>
        </h1>

        {/* Star divider */}
        <motion.div
          {...fadeUp(0.65)}
          className="mt-6 flex items-center gap-4 text-amber-400"
        >
          <span className="block h-px w-10 bg-white/30" />
          {"★ ★ ★ ★".split(" ").map((star, i) => (
            <span key={i} className="text-sm md:text-base">{star}</span>
          ))}
          <span className="block h-px w-10 bg-white/30" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.75)}
          className="mt-5 font-sans font-light text-xs md:text-sm tracking-[0.2em] uppercase text-white/60"
        >
          {t(hero.subtitle)}
        </motion.p>

        {/* CTA */}
        <motion.a
          {...fadeUp(0.9)}
          href={hero.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block border border-white/30 hover:border-white/60 bg-transparent hover:bg-white/5 text-white font-sans font-light tracking-[0.15em] uppercase text-xs md:text-sm px-10 py-4 transition-all duration-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
        >
          {t(hero.cta)}
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reducedMotion ? undefined : { delay: 1.5, duration: 0.8 }}
      >
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-white/40">
          {tl.hero.scroll}
        </span>
        <motion.span
          className="block w-px h-8 bg-white/30 origin-top"
          initial={reducedMotion ? undefined : { scaleY: 0 }}
          animate={reducedMotion ? undefined : { scaleY: [0, 1, 0] }}
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  ease: "easeInOut",
                  delay: 1.8,
                }
          }
        />
      </motion.div>

      {/* Video pause button */}
      {hero.video && (
        <button
          onClick={toggleVideo}
          aria-label={paused ? tl.hero.playVideo : tl.hero.pauseVideo}
          className="absolute bottom-8 right-8 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
      )}
    </section>
  );
}
