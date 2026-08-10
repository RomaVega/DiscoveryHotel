"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import type { OffersData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface SpecialOffersProps {
  data: OffersData;
  hideHeading?: boolean;
}

export function SpecialOffers({ data, hideHeading }: SpecialOffersProps) {
  const { t, tl } = useLanguage();
  const activeOffers = data.offers.filter((o) => o.active);

  if (activeOffers.length === 0) return null;

  return (
    <section id="offers" className="pt-6 md:pt-32 pb-6 md:pb-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        {!hideHeading && (
          <FadeIn>
            <SectionHeading
              label={t(data.label)}
              heading={t(data.heading)}
            />
          </FadeIn>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {activeOffers.map((offer, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-sand shadow-md group h-full flex flex-col overflow-hidden rounded-md">
                <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={offer.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 md:p-8 flex flex-col flex-1">
                  <h3 className="font-serif text-2xl font-semibold text-charcoal">
                    {t(offer.title)}
                  </h3>
                  <p className="mt-2 text-stone leading-relaxed flex-1">
                    {t(offer.description)}
                  </p>
                  {/* Footer mirrors the spa treatment row: the price and the CTA
                      sit on one baseline instead of stacking, so the two things
                      a guest actually decides on are adjacent. flex-1 on the
                      description above pins this to the card bottom, which keeps
                      the footers aligned across a row of uneven descriptions.
                      Stacked below `sm` (button centred) exactly as SpaDetail
                      does — a long RU CTA label plus a price will not share a
                      360px row. */}
                  <div className="mt-6 pt-5 border-t border-charcoal/10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      {/* deep-teal, not brand-teal: brand-teal is 2.1:1 on sand
                          and an 18px semibold price is not WCAG "large text",
                          so it failed AA. deep-teal measures 5.4:1 here. */}
                      <p className="font-sans text-lg font-semibold text-deep-teal leading-none">
                        {t(offer.price)}
                      </p>
                      {offer.validity && (
                        <p className="mt-1.5 font-sans text-xs text-stone leading-snug">
                          {t(offer.validity)}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-center sm:block">
                      <SecondaryButton href="https://secure.guestpro.net/odch" external>
                        {tl.offers.bookThisOffer}
                      </SecondaryButton>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
