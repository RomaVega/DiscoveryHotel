"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import type { ExcursionsPageData, ExcursionSection } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { getWhatsAppNumber } from "@/lib/whatsapp";

interface ExcursionsDetailProps {
  data: ExcursionsPageData;
}

function ExcursionGroup({ section }: { section: ExcursionSection }) {
  const { t, locale } = useLanguage();
  const items = section.items ?? section.highlights ?? [];

  const bookingText = locale === "ru" ? "Забронировать" : "Book Now";
  const whatsappBase = `https://wa.me/${getWhatsAppNumber()}?text=`;

  return (
    <div>
      <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal text-center mb-3">
        {t(section.title)}
      </h2>
      {section.description && (
        <p className="text-stone text-sm text-center mb-10 max-w-2xl mx-auto leading-relaxed">
          {t(section.description)}
        </p>
      )}
      {items.length > 0 && (
        <div className="flex flex-col gap-6">
          {items.map((item, i) => {
            const msg = encodeURIComponent(
              locale === "ru"
                ? `Здравствуйте! Хочу забронировать экскурсию: ${typeof item.name === "object" ? item.name.ru : item.name}`
                : `Hello! I'd like to book the excursion: ${typeof item.name === "object" ? item.name.en : item.name}`
            );
            return (
              <div key={i} className="bg-ivory shadow-sm p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-semibold text-charcoal">{t(item.name)}</h3>
                  <p className="text-stone text-sm mt-2 leading-relaxed">{t(item.description)}</p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {item.duration && (
                      <span className="text-xs text-stone/70 font-sans">{t(item.duration)}</span>
                    )}
                    {item.price && (
                      <span className="font-sans font-semibold text-brand-teal text-sm">{t(item.price)}</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-center sm:block">
                  <a
                    href={`${whatsappBase}${msg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-block font-sans text-xs font-semibold tracking-wide border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white px-5 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap"
                  >
                    {bookingText}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ExcursionsDetail({ data }: ExcursionsDetailProps) {
  const sections = [
    data.sightseeing,
    data.waterActivities,
    data.trekking,
    data.cycling,
    data.organizedTours,
  ].filter(Boolean) as ExcursionSection[];

  return (
    <section className="pt-6 pb-6 md:py-28 bg-sand">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col gap-16 md:gap-24">
          {sections.map((section, i) => (
            <FadeIn key={i}>
              <ExcursionGroup section={section} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
