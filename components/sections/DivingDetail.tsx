"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import type { DivingPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface DivingDetailProps {
  data: DivingPageData;
}

export function DivingDetail({ data }: DivingDetailProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        {/* Programs */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
            {t({ en: "Dive Programs", ru: "Программы дайвинга" })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {data.programs.map((program, i) => (
              <div key={i} className="bg-ivory p-6 shadow-sm flex flex-col">
                <h3 className="font-serif text-xl font-semibold text-charcoal">{t(program.name)}</h3>
                <p className="mt-1 text-xs text-brand-teal font-sans uppercase tracking-wider">{t(program.level)}</p>
                <p className="mt-3 text-stone text-sm leading-relaxed flex-1">{t(program.description)}</p>
                {(program.duration || program.price) && (
                  <div className="mt-4 pt-4 border-t border-sand flex items-center justify-between">
                    {program.duration && <span className="text-xs text-stone font-sans">{program.duration}</span>}
                    {program.price && <span className="font-sans font-semibold text-brand-teal">{program.price}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Dive Sites */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
            {t({ en: "Dive Sites", ru: "Места для дайвинга" })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.diveSites.map((site, i) => (
              <div key={i} className="bg-ivory p-6 shadow-sm">
                <h3 className="font-serif text-lg font-semibold text-charcoal">{t(site.name)}</h3>
                <p className="mt-2 text-stone text-sm leading-relaxed">{t(site.description)}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
