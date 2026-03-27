"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import type { AboutPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

const SECTION_IMAGES = [
  "/images/gallery/g1.jpg",
  "/images/gallery/g4.jpg",
  "/images/gallery/g7.jpg",
];

interface AboutDetailProps {
  data: AboutPageData;
}

export function AboutDetail({ data }: AboutDetailProps) {
  const { t } = useLanguage();

  return (
    <div>
      {/* ── Pull quote ── */}
      {data.intro && (
        <FadeIn>
          <div className="bg-ivory py-16 md:py-24 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-px h-12 bg-brand-teal mx-auto mb-8" />
              <p className="font-serif text-2xl md:text-3xl font-light text-charcoal leading-relaxed">
                {t(data.intro)}
              </p>
              <div className="w-px h-12 bg-brand-teal mx-auto mt-8" />
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── Stats strip ── */}
      {data.stats && data.stats.length > 0 && (
        <div className="bg-cta-teal py-10 px-6">
          <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/15">
            {data.stats.map((stat, i) => (
              <div key={i} className="text-center px-4 md:px-6">
                <p className="font-serif text-2xl md:text-3xl font-light text-white">{stat.value}</p>
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mt-1.5">{t(stat.label)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Alternating image + text sections ── */}
      <div className="bg-sand">
        <div className="space-y-0">
          {data.sections.map((section, i) => {
            const img = section.image ?? SECTION_IMAGES[i % SECTION_IMAGES.length];
            const imgAlt = section.imageAlt ? t(section.imageAlt) : t(section.title);
            return (
              <FadeIn key={i}>
                <div className={`flex flex-col lg:flex-row items-stretch ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  {/* Image */}
                  <div className="relative aspect-[4/3] lg:w-1/2 lg:aspect-auto lg:min-h-[480px] overflow-hidden">
                    <Image
                      src={img}
                      alt={imgAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  {/* Text */}
                  <div className="lg:w-1/2 bg-ivory flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal leading-tight">
                      {t(section.title)}
                    </h2>
                    <div className="w-8 h-px bg-brand-teal my-7" />
                    <p className="text-stone leading-relaxed text-[15px]">
                      {t(section.description)}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
