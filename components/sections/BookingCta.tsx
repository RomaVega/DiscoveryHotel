"use client"; // Uses useLanguage for content translation

import type { ReactNode } from "react";
import { FadeIn } from "@/components/common/FadeIn";
import { MobileBreaks } from "@/components/common/MobileBreaks";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import type { BookingCtaData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import type { CtaLocation } from "@/lib/track";

interface BookingCtaProps {
  data: BookingCtaData;
  /** Rendered between the subtext and the button — the home page puts the
      "Why Book Direct" perks here, so the reasons sit right above the CTA. */
  children?: ReactNode;
  /** Defaults to the room band's `booking_band`; a blog post's offer band passes `blog_band`. */
  ctaLocation?: CtaLocation;
}

export function BookingCta({ data, children, ctaLocation = "booking_band" }: BookingCtaProps) {
  const { t } = useLanguage();
  // A plain band (heading, one line, button) keeps the 24px phone padding every
  // CTA band uses. With the perks inside it is a full section ~900px tall, and at
  // 24px its heading and button sat against the band's edges — so it takes the
  // 48px of the /offers BookDirect section, which shows the same perks.
  const phonePadding = children ? "pt-12 pb-12" : "pt-6 pb-6";

  return (
    <section id="booking" className={cn(phonePadding, "md:pt-32 md:pb-32 bg-deep-teal")}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="font-serif font-medium text-4xl md:text-5xl text-white text-balance">
            <MobileBreaks text={t(data.heading)} />
          </h2>
          <p className="mt-4 text-lg text-white/80 leading-relaxed">
            {t(data.subtext)}
          </p>
          {children && <div className="mt-10 md:mt-14">{children}</div>}
          <div data-hides-booking-bar className={children ? "mt-10 md:mt-14" : "mt-8"}>
            <SecondaryButton
              href={data.bookingUrl}
              external
              data-cta-location={ctaLocation}
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
