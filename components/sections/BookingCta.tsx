"use client"; // Uses useLanguage for content translation

import type { ReactNode } from "react";
import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import type { BookingCtaData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface BookingCtaProps {
  data: BookingCtaData;
  /** Rendered between the subtext and the button — the home page puts the
      "Why Book Direct" perks here, so the reasons sit right above the CTA. */
  children?: ReactNode;
}

export function BookingCta({ data, children }: BookingCtaProps) {
  const { t } = useLanguage();

  return (
    <section id="booking" className="pt-6 md:pt-32 pb-6 md:pb-32 bg-deep-teal">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="font-serif font-medium text-2xl md:text-5xl text-white text-balance">
            {t(data.heading)}
          </h2>
          <p className="mt-4 text-sm md:text-lg text-white/80 leading-relaxed">
            {t(data.subtext)}
          </p>
          {children && <div className="mt-10 md:mt-14">{children}</div>}
          <div className={children ? "mt-10 md:mt-14" : "mt-8"}>
            <SecondaryButton
              href={data.bookingUrl}
              external
              data-cta-location="booking_band"
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
