"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { SpaPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { Clock } from "lucide-react";

interface SpaDetailProps {
  data: SpaPageData;
}

export function SpaDetail({ data }: SpaDetailProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        {/* Hours & Note */}
        <FadeIn>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 text-charcoal mb-4">
              <Clock size={20} className="text-brand-teal" />
              <span className="font-sans text-sm">{data.hours}</span>
            </div>
            <p className="text-stone text-sm italic max-w-2xl mx-auto">{t(data.note)}</p>
          </div>
        </FadeIn>

        {/* Programs */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
            {t({ en: "Signature Programs", ru: "Авторские программы" })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {data.programs.map((program, i) => (
              <div key={i} className="bg-ivory p-6 shadow-sm flex flex-col">
                <h3 className="font-serif text-xl font-semibold text-charcoal">
                  {t(program.name)}
                </h3>
                <p className="mt-2 text-stone text-sm leading-relaxed flex-1">
                  {t(program.description)}
                </p>
                <div className="mt-4 pt-4 border-t border-sand flex items-center justify-between">
                  <span className="text-xs text-stone font-sans">{program.duration}</span>
                  <span className="font-sans font-semibold text-brand-teal">{program.price}</span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Ayurvedic Treatments */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
            {t({ en: "Ayurvedic Treatments", ru: "Аюрведические процедуры" })}
          </h2>
          <div className="bg-ivory shadow-sm overflow-hidden mb-20">
            <div className="divide-y divide-sand">
              {data.ayurvedicTreatments.map((treatment, i) => (
                <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div className="flex-1">
                    <h3 className="font-sans font-semibold text-charcoal text-sm">{t(treatment.name)}</h3>
                    <p className="text-stone text-xs mt-1">{t(treatment.description)}</p>
                  </div>
                  <span className="text-xs text-stone font-sans shrink-0">{treatment.duration}</span>
                  <span className="font-sans font-semibold text-brand-teal shrink-0 text-sm">{treatment.price}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Balinese Treatments */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
            {t({ en: "Traditional Balinese", ru: "Традиционные балийские процедуры" })}
          </h2>
          <div className="bg-ivory shadow-sm overflow-hidden">
            <div className="divide-y divide-sand">
              {data.balineseTreatments.map((treatment, i) => (
                <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div className="flex-1">
                    <h3 className="font-sans font-semibold text-charcoal text-sm">{t(treatment.name)}</h3>
                    <p className="text-stone text-xs mt-1">{t(treatment.description)}</p>
                  </div>
                  <span className="text-xs text-stone font-sans shrink-0">{treatment.duration}</span>
                  <span className="font-sans font-semibold text-brand-teal shrink-0 text-sm">{treatment.price}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
