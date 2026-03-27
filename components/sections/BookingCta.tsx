"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import type { BookingCtaData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface BookingCtaProps {
  data: BookingCtaData;
}

export function BookingCta({ data }: BookingCtaProps) {
  const { t } = useLanguage();

  return (
    <section id="booking" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-brand-teal">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="font-serif font-light text-3xl md:text-5xl text-white">
            {t(data.heading)}
          </h2>
          <p className="mt-4 text-lg text-white/70 leading-relaxed">
            {t(data.subtext)}
          </p>
          <div className="mt-8">
            <a
              href={data.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-transparent hover:bg-white/10 border border-white hover:border-white/80 text-white font-sans font-semibold px-5 py-2 rounded-full tracking-wide uppercase text-xs transition-all duration-300"
            >
              {t(data.fallbackCta)}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
