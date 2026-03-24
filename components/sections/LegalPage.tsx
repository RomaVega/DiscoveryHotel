"use client"; // Uses useLanguage for content translation

import { useLanguage } from "@/lib/language-context";
import type { LegalPageData } from "@/lib/types";

interface LegalPageProps {
  data: LegalPageData;
}

export function LegalPage({ data }: LegalPageProps) {
  const { t } = useLanguage();

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-sand">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-serif text-4xl font-light text-charcoal text-center mb-4">
          {t(data.heading)}
        </h1>
        <p className="text-center text-stone text-sm mb-12">
          {t({ en: "Last updated", ru: "Последнее обновление" })}: {data.lastUpdated}
        </p>

        <div className="space-y-8">
          {data.sections.map((section, i) => (
            <div key={i}>
              <h2 className="font-sans font-semibold text-charcoal text-lg mb-3">{t(section.title)}</h2>
              <p className="text-stone text-sm leading-relaxed whitespace-pre-line">{t(section.content)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
