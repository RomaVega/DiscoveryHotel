"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import type { BookingCtaData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface BookingCtaProps {
  data: BookingCtaData;
}

export function BookingCta({ data }: BookingCtaProps) {
  const { t } = useLanguage();

  return (
    <section id="booking" className="pt-6 md:pt-32 pb-6 md:pb-32 bg-cta-teal">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="font-serif font-light text-2xl md:text-5xl text-white">
            {t(data.heading)}
          </h2>
          <p className="mt-4 text-sm md:text-lg text-white/70 leading-relaxed">
            {t(data.subtext)}
          </p>
          <div className="mt-8">
            <SecondaryButton
              href={data.bookingUrl}
              external
              className="border-white text-white hover:bg-white/10 hover:border-white/80"
            >
              {t(data.fallbackCta)}
            </SecondaryButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
