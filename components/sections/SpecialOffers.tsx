"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import type { OffersData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface SpecialOffersProps {
  data: OffersData;
}

export function SpecialOffers({ data }: SpecialOffersProps) {
  const { t, tl } = useLanguage();
  const activeOffers = data.offers.filter((o) => o.active);

  if (activeOffers.length === 0) return null;

  return (
    <section id="offers" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            label={t(data.label)}
            heading={t(data.heading)}
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeOffers.map((offer, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-ivory group h-full flex flex-col overflow-hidden">
                <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={offer.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-5 md:p-8 flex flex-col flex-1">
                  <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-teal mb-3">
                    {tl.offers.specialOffer}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-charcoal">
                    {t(offer.title)}
                  </h3>
                  <p className="mt-2 text-stone leading-relaxed flex-1">
                    {t(offer.description)}
                  </p>
                  <p className="mt-4 font-sans text-lg font-semibold text-brand-teal">
                    {t(offer.price)}
                  </p>
                  <div className="mt-6">
                    <PrimaryButton
                      href="https://secure.guestpro.net/odch"
                      external
                    >
                      {tl.offers.bookThisOffer}
                    </PrimaryButton>
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
