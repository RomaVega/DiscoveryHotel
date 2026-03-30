"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import type { SpaPageData, SpaTreatment } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { getWhatsAppNumber } from "@/lib/whatsapp";

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
    <div className="bg-ivory shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
      <div className="flex-1">
        <h3 className="font-sans font-semibold text-charcoal text-sm">{t(treatment.name)}</h3>
        <p className="text-stone text-xs mt-1 leading-relaxed">{t(treatment.description)}</p>
        <div className="flex flex-wrap gap-4 mt-2">
          {treatment.duration && (
            <span className="text-xs text-stone/70 font-sans">{treatment.duration}</span>
          )}
          {treatment.price && (
            <span className="font-sans font-semibold text-brand-teal text-sm">{treatment.price}</span>
          )}
        </div>
      </div>
      <div className="flex justify-center sm:block">
        <SecondaryButton
          href={`${whatsappBase}${msg}`}
          external
          className="shrink-0 whitespace-nowrap py-2.5"
        >
          {bookText}
        </SecondaryButton>
      </div>
    </div>
  );
}

export function SpaDetail({ data }: SpaDetailProps) {
  const { t, tl, locale } = useLanguage();
  const isRu = locale === "ru";
  const bookText = tl.common.bookNow;
  const whatsappBase = `https://wa.me/${getWhatsAppNumber()}?text=`;

  return (
    <div>
      {/* ── Stats strip ── */}
      <div className="bg-deep-teal py-10 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 divide-x divide-white/15">
          <div className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {tl.spa.hours}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">{data.hours}</p>
          </div>
          <div className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {tl.spa.therapists}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">
              {tl.spa.keralaCertified}
            </p>
          </div>
          <div className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {tl.spa.earlyBooking}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">
              {tl.spa.earlyBookingDiscount}
            </p>
          </div>
        </div>
      </div>

    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">

        {/* Programs */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
            {tl.spa.signaturePrograms}
          </h2>
          <div className="flex flex-col gap-6 mb-20">
            {data.programs.map((program, i) => {
              const msg = encodeURIComponent(
                isRu
                  ? `Здравствуйте! Хочу записаться на программу: ${typeof program.name === "object" ? program.name.ru : program.name}`
                  : `Hello! I'd like to book the program: ${typeof program.name === "object" ? program.name.en : program.name}`
              );
              return (
                <div key={i} className="bg-ivory shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-semibold text-charcoal">{t(program.name)}</h3>
                    <p className="mt-2 text-stone text-sm leading-relaxed">{t(program.description)}</p>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <span className="text-xs text-stone/70 font-sans">{program.duration}</span>
                      <span className="font-sans font-semibold text-brand-teal text-sm">{program.price}</span>
                    </div>
                  </div>
                  <div className="flex justify-center sm:block">
                    <SecondaryButton
                      href={`${whatsappBase}${msg}`}
                      external
                      className="shrink-0 whitespace-nowrap py-2.5"
                    >
                      {bookText}
                    </SecondaryButton>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Ayurvedic Treatments */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
            {tl.spa.ayurvedicTreatments}
          </h2>
          <div className="flex flex-col gap-6 mb-20">
            {data.ayurvedicTreatments.map((treatment, i) => (
              <TreatmentCard key={i} treatment={treatment} bookText={bookText} whatsappBase={whatsappBase} />
            ))}
          </div>
        </FadeIn>

        {/* Balinese Treatments */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
            {tl.spa.balineseTitle}
          </h2>
          <div className="flex flex-col gap-6">
            {data.balineseTreatments.map((treatment, i) => (
              <TreatmentCard key={i} treatment={treatment} bookText={bookText} whatsappBase={whatsappBase} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
    </div>
  );
}
