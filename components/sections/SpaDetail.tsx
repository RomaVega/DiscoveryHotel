"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
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
        <a
          href={`${whatsappBase}${msg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-block font-sans text-xs font-semibold tracking-wide border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white px-5 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap"
        >
          {bookText}
        </a>
      </div>
    </div>
  );
}

export function SpaDetail({ data }: SpaDetailProps) {
  const { t, locale } = useLanguage();
  const isRu = locale === "ru";
  const bookText = isRu ? "Забронировать" : "Book Now";
  const whatsappBase = `https://wa.me/${getWhatsAppNumber()}?text=`;

  return (
    <div>
      {/* ── Stats strip ── */}
      <div className="bg-cta-teal py-10 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 divide-x divide-white/15">
          <div className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {isRu ? "Часы работы" : "Hours"}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">{data.hours}</p>
          </div>
          <div className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {isRu ? "Терапевты" : "Therapists"}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">
              {isRu ? "Сертифицированы в Керале" : "Kerala-Certified"}
            </p>
          </div>
          <div className="text-center px-6">
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              {isRu ? "Раннее бронирование" : "Early Booking"}
            </p>
            <p className="font-serif text-xl md:text-2xl font-light text-white">
              {isRu ? "Скидка 10%" : "10% Discount"}
            </p>
          </div>
        </div>
      </div>

    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">

        {/* Programs */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
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
                <div key={i} className="bg-ivory shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl font-semibold text-charcoal">{t(program.name)}</h3>
                    <p className="mt-2 text-stone text-sm leading-relaxed">{t(program.description)}</p>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <span className="text-xs text-stone/70 font-sans">{program.duration}</span>
                      <span className="font-sans font-semibold text-brand-teal text-sm">{program.price}</span>
                    </div>
                  </div>
                  <div className="flex justify-center sm:block">
                    <a
                      href={`${whatsappBase}${msg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-block font-sans text-xs font-semibold tracking-wide border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white px-5 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap"
                    >
                      {bookText}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Ayurvedic Treatments */}
        <FadeIn>
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
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
          <h2 className="font-serif text-3xl font-light text-charcoal text-center mb-12">
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
    </div>
  );
}
