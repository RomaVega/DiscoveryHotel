"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import type { LocalizedString } from "@/lib/types";

interface PageHeroProps {
  image: string;
  imageAlt: string;
  heading: LocalizedString;
  subtext?: LocalizedString;
  noOverlay?: boolean;
}

export function PageHero({ image, imageAlt, heading, subtext, noOverlay }: PageHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {!noOverlay && <div className="absolute inset-0 bg-black/40" />}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`font-serif text-4xl md:text-5xl lg:text-6xl font-light ${noOverlay ? "text-shadow-tight" : "text-shadow-strong"}`}
        >
          {t(heading)}
        </motion.h1>
        {subtext && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`mt-4 max-w-2xl font-sans text-base md:text-lg text-white/90 leading-relaxed ${noOverlay ? "text-shadow-tight" : "text-shadow-strong"}`}
          >
            {t(subtext)}
          </motion.p>
        )}
      </div>
    </section>
  );
}
