"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import type { TransferPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { Check } from "lucide-react";

interface TransferDetailProps {
  data: TransferPageData;
}

export function TransferDetail({ data }: TransferDetailProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        {/* Features */}
        <FadeIn>
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {data.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-charcoal">
                <Check size={16} className="text-brand-teal" />
                <span className="font-sans text-sm">{t(feature)}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Main Routes Table */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-8">
            {t({ en: "Airport & Resort Transfers", ru: "Трансферы из аэропорта" })}
          </h2>
          <div className="bg-ivory shadow-sm overflow-hidden mb-16">
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-sand font-sans text-xs uppercase tracking-wider text-stone">
              <span>{t({ en: "Destination", ru: "Направление" })}</span>
              <span className="text-center">{t({ en: "One Way", ru: "В одну сторону" })}</span>
              <span className="text-center">{t({ en: "Round Trip", ru: "Туда и обратно" })}</span>
            </div>
            <div className="divide-y divide-sand">
              {data.routes.map((route, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 p-4">
                  <span className="font-sans text-sm text-charcoal">{t(route.destination)}</span>
                  <span className="font-sans text-sm text-brand-teal text-center font-semibold">{route.oneWay}</span>
                  <span className="font-sans text-sm text-brand-teal text-center font-semibold">{route.roundTrip}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Local Routes */}
        {data.localRoutes && data.localRoutes.length > 0 && (
          <FadeIn>
            <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-8">
              {t({ en: "Local Transfers", ru: "Местные трансферы" })}
            </h2>
            <div className="bg-ivory shadow-sm overflow-hidden mb-16">
              <div className="divide-y divide-sand">
                {data.localRoutes.map((route, i) => (
                  <div key={i} className="flex items-center justify-between p-4">
                    <span className="font-sans text-sm text-charcoal">{t(route.destination)}</span>
                    <span className="font-sans text-sm text-brand-teal font-semibold">{route.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Other Destinations */}
        {data.otherDestinations && data.otherDestinations.length > 0 && (
          <FadeIn>
            <div className="bg-ivory p-6 shadow-sm text-center">
              <p className="text-stone text-sm mb-4">
                {t({ en: "Also available — contact us for pricing:", ru: "Также доступно — свяжитесь с нами для уточнения цены:" })}
              </p>
              <p className="text-charcoal text-sm leading-relaxed">
                {data.otherDestinations.map((d) => t(d)).join(" · ")}
              </p>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
