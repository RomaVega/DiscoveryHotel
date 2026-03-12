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

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Star key={i} size={16} fill="currentColor" className="text-brand-teal" />
            ))}
          </div>

          <h1 className="font-serif font-light text-5xl md:text-7xl tracking-wide">
            {hero.title}
          </h1>

          <p className="mt-4 font-sans text-lg md:text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>

          <a
            href={hero.ctaHref}
            className="mt-8 inline-block bg-brand-teal hover:bg-deep-teal text-white font-sans font-semibold px-8 py-3 tracking-wide uppercase text-sm transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
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
          className="absolute bottom-8 right-8 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 text-white/70 hover:text-white hover:bg-black/50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          {paused ? <Play size={18} /> : <Pause size={18} />}
        </button>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/80" />
        </div>
      </motion.div>
    </section>
  );
}
