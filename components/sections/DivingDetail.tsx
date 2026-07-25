"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import type { DivingPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { getWhatsAppNumber, buildWhatsAppUrl } from "@/lib/whatsapp";

interface DivingDetailProps {
  data: DivingPageData;
}

export function DivingDetail({ data }: DivingDetailProps) {
  const { t, locale } = useLanguage();
  const isRu = locale === "ru";
  const bookText = isRu ? "Забронировать" : "Book Now";
  const helpUrl = buildWhatsAppUrl(
    isRu
      ? "Здравствуйте! Не могу выбрать погружение — помогите, пожалуйста, подобрать подходящее по опыту."
      : "Hello! I'm not sure which dive to choose — could you help me find one that suits my experience?"
  );

  return (
    <>
      {/* ── Poetic lead-in ── */}
      {data.intro && (
        <section className="py-16 md:py-24 bg-ivory">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <FadeIn>
              <div className="w-px h-12 bg-brand-teal mx-auto mb-8" />
              <p className="font-serif text-xl md:text-2xl font-light text-charcoal leading-relaxed">
                {t(data.intro)}
              </p>
              <div className="w-px h-12 bg-brand-teal mx-auto mt-8" />
            </FadeIn>
          </div>
        </section>
      )}

    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        {/* Programs */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
            {t({ en: "Dive Programs", ru: "Программы дайвинга" })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {data.programs.map((program, i) => {
              const msg = encodeURIComponent(isRu
                ? `Здравствуйте! Хочу забронировать программу дайвинга: ${typeof program.name === "object" ? program.name.ru : program.name}`
                : `Hello! I'd like to book the diving program: ${typeof program.name === "object" ? program.name.en : program.name}`
              );
              return (
                <div key={i} className="bg-ivory p-6 shadow-sm flex flex-col rounded-md">
                  <h3 className="font-serif text-2xl font-semibold text-charcoal">{t(program.name)}</h3>
                  <p className="mt-1 text-xs text-brand-teal font-sans uppercase tracking-wider">{t(program.level)}</p>
                  <p className="mt-3 text-stone text-sm leading-relaxed flex-1">{t(program.description)}</p>
                  {(program.duration || program.price) && (
                    <div className="mt-4 pt-4 border-t border-sand flex items-center justify-between">
                      {program.duration && <span className="text-xs text-stone font-sans">{program.duration}</span>}
                      {program.price && <span className="font-sans font-semibold text-brand-teal">{program.price}</span>}
                    </div>
                  )}
                  <div className="mt-4 flex justify-center">
                    <SecondaryButton href={`https://wa.me/${getWhatsAppNumber()}?text=${msg}`} external>
                      {bookText}
                    </SecondaryButton>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Dive Sites */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
            {t({ en: "Dive Sites", ru: "Места для дайвинга" })}
          </h2>
          {/* One site per row, matching the car-rental card structure */}
          <div className="flex flex-col gap-6">
            {data.diveSites.map((site, i) => {
              const msg = encodeURIComponent(isRu
                ? `Здравствуйте! Интересует дайвинг: ${typeof site.name === "object" ? site.name.ru : site.name}`
                : `Hello! I'd like to dive at: ${typeof site.name === "object" ? site.name.en : site.name}`
              );
              return (
                <div key={i} className="bg-ivory shadow-sm p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 rounded-md">
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl font-semibold text-charcoal">{t(site.name)}</h3>
                    <p className="text-stone text-sm mt-2 leading-relaxed">{t(site.description)}</p>
                  </div>
                  <div className="flex justify-center sm:block">
                    <SecondaryButton href={`https://wa.me/${getWhatsAppNumber()}?text=${msg}`} external>
                      {bookText}
                    </SecondaryButton>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>

    {/* ── "Not sure where to start?" help CTA ── */}
    {data.helpCta && (
      <section className="py-16 md:py-24 bg-cta-teal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif text-2xl md:text-4xl font-light text-white">
              {t(data.helpCta.heading)}
            </h2>
            <p className="mt-4 text-white/80 text-base md:text-lg leading-relaxed">
              {t(data.helpCta.text)}
            </p>
            <div className="mt-8">
              <SecondaryButton
                href={helpUrl}
                external
                className="border-white text-white hover:bg-white/10 hover:border-white/80"
              >
                {t(data.helpCta.button)}
              </SecondaryButton>
            </div>
          </FadeIn>
        </div>
      </section>
    )}
    </>
  );
}
