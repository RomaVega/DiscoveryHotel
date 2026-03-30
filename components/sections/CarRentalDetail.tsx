"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import type { CarRentalPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { Check } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WhiteButton } from "@/components/common/WhiteButton";

interface CarRentalDetailProps {
  data: CarRentalPageData;
}

export function CarRentalDetail({ data }: CarRentalDetailProps) {
  const { t, tl } = useLanguage();
  const ctaUrl = buildWhatsAppUrl(tl.carRental.whatsapp);

  return (
    <div>
    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        {/* Vehicles */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {data.vehicles.map((vehicle, i) => (
              <div key={i} className="bg-ivory p-6 shadow-sm flex flex-col">
                <h3 className="font-serif text-xl font-semibold text-charcoal">{t(vehicle.title)}</h3>
                <p className="mt-2 text-stone text-sm leading-relaxed flex-1">{t(vehicle.description)}</p>
                <div className="mt-4 pt-4 border-t border-sand">
                  <span className="font-sans font-semibold text-brand-teal">{t(vehicle.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Terms */}
        {data.terms && data.terms.length > 0 && (
          <FadeIn>
            <div className="bg-ivory p-8 shadow-sm">
              <h3 className="font-serif text-xl font-semibold text-charcoal mb-4">
                {tl.carRental.rentalTerms}
              </h3>
              <div className="space-y-3">
                {data.terms.map((term, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={16} className="text-brand-teal shrink-0 mt-0.5" />
                    <span className="text-stone text-sm">{t(term)}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>

      {/* ── CTA ── */}
      <section className="pt-12 md:pt-32 pb-12 md:pb-32 bg-deep-teal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif font-light text-3xl md:text-5xl text-white">
              {tl.carRental.ctaHeading}
            </h2>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              {tl.carRental.ctaSubtext}
            </p>
            <div className="mt-8">
              <WhiteButton href={ctaUrl} external>
                {tl.carRental.messageUs}
              </WhiteButton>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
