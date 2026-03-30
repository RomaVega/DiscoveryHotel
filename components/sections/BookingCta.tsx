"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import { WhiteButton } from "@/components/common/WhiteButton";
import type { BookingCtaData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface BookingCtaProps {
  data: BookingCtaData;
}

export function BookingCta({ data }: BookingCtaProps) {
  const { t } = useLanguage();

  return (
    <section id="booking" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-deep-teal">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="font-serif font-light text-3xl md:text-5xl text-white">
            {t(data.heading)}
          </h2>
          <p className="mt-4 text-lg text-white/70 leading-relaxed">
            {t(data.subtext)}
          </p>
          <div className="mt-8">
            <WhiteButton href={data.bookingUrl} external>
              {t(data.fallbackCta)}
            </WhiteButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
