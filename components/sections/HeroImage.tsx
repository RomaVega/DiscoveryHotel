"use client"; // Uses framer-motion for hero animation and video element

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Pause, Play } from "lucide-react";
import type { HeroData } from "@/lib/types";

interface HeroImageProps {
  hero: HeroData;
}

export function HeroImage({ hero }: HeroImageProps) {
  const [paused, setPaused] = useState(false);

  const toggleVideo = () => {
    const video = document.querySelector<HTMLVideoElement>("#hero-video");
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
          id="hero-video"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
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

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="font-serif font-semibold tracking-wide text-shadow-strong text-center">
            <span className="block text-[7.5vw] md:text-[3.25rem] lg:text-[4rem] mb-3 uppercase text-shadow-strong">
              {hero.titleLine1}
            </span>
            <span className="block text-[7.5vw] md:text-[3.25rem] lg:text-[4rem] leading-tight uppercase whitespace-nowrap text-shadow-strong">
              {hero.titleLine2}
            </span>
            <div className="mt-4 w-fit mx-auto">
              <span className="block text-[5.5vw] md:text-[2rem] lg:text-[2.75rem] tracking-[0.4em] uppercase font-semibold text-shadow-strong">
                {hero.titleLine3}
              </span>
              <motion.div
                className="mt-3 flex justify-between pr-[0.65rem] md:pr-[0.8rem] lg:pr-[1.1rem]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" className="text-[#e8c05a] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
                ))}
              </motion.div>
            </div>
          </h1>

          <p className="mt-6 font-serif italic font-medium text-2xl md:text-3xl text-white/85 max-w-xl mx-auto leading-relaxed text-shadow-subtitle">
            {hero.subtitle}
          </p>

          <a
            href={hero.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block bg-transparent hover:bg-white/10 text-white border border-brand-teal hover:border-brand-teal/80 rounded-sm font-sans font-semibold px-10 py-4 tracking-wide uppercase text-sm transition-all duration-300 animate-border-glow focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            {hero.cta}
          </a>
        </motion.div>
      </div>

      {/* Video pause button */}
      {hero.video && (
        <button
          onClick={toggleVideo}
          aria-label={paused ? "Play video" : "Pause video"}
          className="absolute bottom-8 right-8 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
      )}

    </section>
  );
}
