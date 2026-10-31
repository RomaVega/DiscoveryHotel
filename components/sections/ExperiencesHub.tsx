"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { ExperienceTile } from "@/components/common/ExperienceTile";
import { useLanguage } from "@/lib/language-context";
import { longestTitleLine } from "@/lib/typography";
import { getWhatsAppNumber } from "@/lib/whatsapp";
import type { ExperiencesHubData } from "@/lib/types";
import { MobileBreaks } from "@/components/common/MobileBreaks";

interface ExperiencesHubProps {
  data: ExperiencesHubData;
}

export function ExperiencesHub({ data }: ExperiencesHubProps) {
  const { t } = useLanguage();
  const fitChars = Math.max(...data.categories.map((cat) => longestTitleLine(t(cat.title))));

  const ctaMsg = encodeURIComponent(t({
    ru: "Здравствуйте! Хочу узнать подробнее о доступных экскурсиях и впечатлениях.",
    en: "Hello! I'd like to find out more about available experiences and tours.",
  }));

  return (
    <div>
      {/* ── Pull quote ── */}
      <FadeIn>
        <div className="bg-ivory py-16 md:py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-px h-10 bg-brand-teal mx-auto mb-7" />
            <p className="font-serif text-xl md:text-2xl font-light text-charcoal leading-relaxed italic">
              {t({
                ru: "Настоящий Восточный Бали: уединённые храмы, вулканы на рассвете и редкие рифы вдали от туристов.",
                en: "Discover authentic East Bali: secluded temples, breathtaking volcano sunrises, and pristine reefs far from the tourist crowds.",
              })}
            </p>
            <div className="w-px h-10 bg-brand-teal mx-auto mt-7" />
          </div>
        </div>
      </FadeIn>

      {/* ── Cards grid ── */}
      <section className="pt-16 pb-6 md:py-24 bg-sand">
        <div className="max-w-7xl mx-auto px-6">
          {/* The same tiles as the home page's Experiences section. */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {data.categories.map((cat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <ExperienceTile item={cat} title={t(cat.title)} imageAlt={t(cat.imageAlt)} fitChars={fitChars} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pt-6 md:pt-32 pb-6 md:pb-32 bg-deep-teal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif font-medium text-4xl md:text-5xl text-white text-balance">
              <MobileBreaks text={t({ ru: "Готовы Исследовать\nВосточный Бали?", en: "Ready to Explore East Bali?" })} />
            </h2>
            <p className="mt-4 text-lg text-white/80 leading-relaxed">
              {t({
                ru: "Свяжитесь с нами — мы подберём экскурсии и впечатления специально для вас.",
                en: "Get in touch and we'll arrange the perfect experiences for your stay.",
              })}
            </p>
            <div data-hides-booking-bar className="mt-8">
              <SecondaryButton
                href={`https://wa.me/${getWhatsAppNumber()}?text=${ctaMsg}`}
                external
                className="border-white text-white hover:bg-white/10 hover:border-white/80"
              >
                {t({ ru: "Спланировать Поездку", en: "Plan My Trip" })}
              </SecondaryButton>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
