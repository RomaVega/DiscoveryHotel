"use client"; // Uses useLanguage for content translation

import Image from "next/image";
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
        onLoad={() => window.dispatchEvent(new CustomEvent("hero-ready"))}
      />
      {!noOverlay && <div className="absolute inset-0 bg-black/40" />}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h1 className={`font-serif text-4xl md:text-5xl lg:text-6xl font-light ${noOverlay ? "text-shadow-tight" : "text-shadow-strong"}`}>
          {t(heading)}
        </h1>
        {subtext && (
          <p className={`mt-4 max-w-2xl font-sans text-base md:text-lg text-white/90 leading-relaxed ${noOverlay ? "text-shadow-tight" : "text-shadow-strong"}`}>
            {t(subtext)}
          </p>
        )}
      </div>
    </section>
  );
}
