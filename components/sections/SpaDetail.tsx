"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { StatsStrip } from "@/components/common/StatsStrip";
import type { SpaPageData, SpaTreatment } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { getWhatsAppNumber, buildWhatsAppUrl } from "@/lib/whatsapp";

interface SpaDetailProps {
  data: SpaPageData;
}

function TreatmentCard({ treatment, bookText, whatsappBase }: {
  treatment: SpaTreatment;
  bookText: string;
  whatsappBase: string;
}) {
  const { t, locale } = useLanguage();
  const msg = encodeURIComponent(
    locale === "ru"
      ? `Здравствуйте! Хочу записаться на процедуру: ${typeof treatment.name === "object" ? treatment.name.ru : treatment.name}`
      : `Hello! I'd like to book the treatment: ${typeof treatment.name === "object" ? treatment.name.en : treatment.name}`
  );

  return (
    <div className="bg-ivory shadow-sm p-6 rounded-md sm:flex sm:items-center sm:gap-8">
      <div className="sm:flex-1">
        {/* text-base, not text-sm. The treatments were a step smaller than the
            programs in both title and body — not a deliberate hierarchy, just two
            card types written separately. The list people actually read most was
            set smallest on the page, and its 12px body sat below the 16px base the
            typography rules give. Programs keep one step of prominence (text-lg),
            which is the nudge a flagship deserves rather than the gap this was. */}
        <h3 className="font-sans font-normal text-charcoal text-base">{t(treatment.name)}</h3>
        <p className="text-stone text-sm mt-1 leading-relaxed">{t(treatment.description)}</p>
        <div className="mt-3 flex items-baseline justify-between sm:justify-start sm:gap-4">
          {treatment.duration && (
            <span className="order-2 text-xs text-stone/70 font-sans">{treatment.duration}</span>
          )}
          {treatment.price && (
            <span className="order-1 font-sans font-semibold text-accent-text text-lg">{treatment.price}</span>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-center sm:mt-0 sm:block">
        <SecondaryButton href={`${whatsappBase}${msg}`} external>
          {bookText}
        </SecondaryButton>
      </div>
    </div>
  );
}

export function SpaDetail({ data }: SpaDetailProps) {
  const { t, locale } = useLanguage();
  const isRu = locale === "ru";
  const bookText = isRu ? "Записаться на Сеанс" : "Book Treatment";
  const whatsappBase = `https://wa.me/${getWhatsAppNumber()}?text=`;
  const helpUrl = buildWhatsAppUrl(
    isRu
      ? "Здравствуйте! Не могу выбрать спа-процедуру — помогите, пожалуйста, подобрать подходящую."
      : "Hello! I'm not sure which spa treatment to choose — could you help me find one that's right for me?"
  );

  return (
    <div>
      {/* ── Stats strip ── */}
      <StatsStrip items={[
        { label: t({ en: "Hours", ru: "Часы работы" }), value: data.hours },
        { label: t({ en: "Therapists", ru: "Терапевты" }), value: t({ en: "Kerala-Certified", ru: "Сертифицированы в Керале" }) },
        { label: t({ en: "Early Booking", ru: "Раннее бронирование" }), value: t({ en: "10% Discount", ru: "Скидка 10%" }) },
      ]} />

    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">

        {/* Programs */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-12">
            {t({ en: "Signature Programs", ru: "Авторские программы" })}
          </h2>
          <div className="flex flex-col gap-6 mb-20">
            {data.programs.map((program, i) => {
              const msg = encodeURIComponent(
                isRu
                  ? `Здравствуйте! Хочу записаться на программу: ${typeof program.name === "object" ? program.name.ru : program.name}`
                  : `Hello! I'd like to book the program: ${typeof program.name === "object" ? program.name.en : program.name}`
              );
              return (
                <div key={i} className="bg-ivory shadow-sm p-6 rounded-md sm:flex sm:items-center sm:gap-8">
                  <div className="sm:flex-1">
                    {/* font-sans, matching the treatment cards below and the description text.
                        The page had two card-title fonts — Cormorant here, Inter there —
                        so a program and a treatment read as different kinds of thing when
                        they are the same kind of thing. text-lg rather than the serif's
                        text-2xl: Inter at 600 carries far more weight per point than
                        Cormorant, so matching the point size would have made these
                        louder than the section headings above them. */}
                    <h3 className="font-sans font-normal text-charcoal text-lg">{t(program.name)}</h3>
                    <p className="mt-2 text-stone text-sm leading-relaxed">{t(program.description)}</p>
                    <div className="mt-3 flex items-baseline justify-between sm:justify-start sm:gap-4">
                      <span className="order-2 text-xs text-stone/70 font-sans">{program.duration}</span>
                      <span className="order-1 font-sans font-semibold text-accent-text text-lg">{program.price}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center sm:mt-0 sm:block">
                    <SecondaryButton href={`${whatsappBase}${msg}`} external>
                      {program.bookLabel ? t(program.bookLabel) : bookText}
                    </SecondaryButton>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Ayurvedic Treatments */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-12">
            {t({ en: "Ayurvedic Treatments", ru: "Аюрведические процедуры" })}
          </h2>
          <div className="flex flex-col gap-6 mb-20">
            {data.ayurvedicTreatments.map((treatment, i) => (
              <TreatmentCard key={i} treatment={treatment} bookText={bookText} whatsappBase={whatsappBase} />
            ))}
          </div>
        </FadeIn>

        {/* Balinese Treatments */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-medium text-charcoal text-center mb-12">
            {t({ en: "Traditional Balinese", ru: "Традиционные балийские процедуры" })}
          </h2>
          <div className="flex flex-col gap-6">
            {data.balineseTreatments.map((treatment, i) => (
              <TreatmentCard key={i} treatment={treatment} bookText={bookText} whatsappBase={whatsappBase} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>

    {/* ── "Not sure which treatment?" help CTA ── */}
    {data.helpCta && (
      <section className="pt-6 md:pt-32 pb-6 md:pb-32 bg-deep-teal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif font-medium text-2xl md:text-5xl text-white text-balance">
              {t(data.helpCta.heading)}
            </h2>
            <p className="mt-4 text-sm md:text-lg text-white/80 leading-relaxed">
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
    </div>
  );
}
