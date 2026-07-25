"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import imageLoader from "@/lib/image-loader";
import { useLanguage } from "@/lib/language-context";
import type { LocalizedString } from "@/lib/types";

interface PageHeroProps {
  image: string;
  imageAlt: string;
  /**
   * Optional desktop-only (≥lg) override. When set, `image` is used on
   * mobile and `imageDesktop` on desktop via a <picture> element, so the
   * browser downloads only the source matching the viewport. Because
   * <picture> shares one alt across sources, `imageAlt` must describe both.
   */
  imageDesktop?: string;
  /** Extra classes for the hero <img> — e.g. a viewport-specific object-position
   * like "lg:object-[50%_25%]" to reframe a portrait crop on desktop. */
  imageClassName?: string;
  heading: LocalizedString;
  subtext?: LocalizedString;
  noOverlay?: boolean;
}

// Mirrors next/image's default deviceSizes so the CDN serves a right-sized,
// format-negotiated (AVIF/WebP) variant for each viewport × DPR.
const HERO_WIDTHS = [640, 828, 1080, 1200, 1920, 2048, 3840];
const heroSrcSet = (src: string) =>
  HERO_WIDTHS.map((w) => `${imageLoader({ src, width: w, quality: 75 })} ${w}w`).join(", ");

export function PageHero({ image, imageAlt, imageDesktop, imageClassName, heading, subtext, noOverlay }: PageHeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen w-full overflow-hidden bg-parchment">
      {imageDesktop ? (
        // Art-directed hero: next/image can't do media-based art direction, and a
        // display:none second <Image> would still be downloaded. <picture> with a
        // media source makes the browser fetch ONLY the matching image.
        <picture>
          <source media="(min-width: 1024px)" srcSet={heroSrcSet(imageDesktop)} sizes="100vw" />
          {/* Raw <img> required as the <picture> fallback; still CDN-optimized via imageLoader srcSet. */}
          <img
            src={imageLoader({ src: image, width: 1920, quality: 75 })}
            srcSet={heroSrcSet(image)}
            sizes="100vw"
            alt={imageAlt}
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover ${imageClassName ?? ""}`}
          />
        </picture>
      ) : (
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className={`object-cover ${imageClassName ?? ""}`}
        />
      )}
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
