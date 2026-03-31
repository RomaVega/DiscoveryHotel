"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { useLanguage } from "@/lib/language-context";
import { getWhatsAppNumber } from "@/lib/whatsapp";
import type { ExperiencesHubData } from "@/lib/types";

interface ExperiencesHubProps {
  data: ExperiencesHubData;
}

export function ExperiencesHub({ data }: ExperiencesHubProps) {
  const { t } = useLanguage();

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.categories.map((cat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Link href={cat.href} className="bg-ivory shadow-md group h-full flex flex-col overflow-hidden">
                  <div className="relative aspect-video shrink-0 overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={t(cat.imageAlt)}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="p-5 md:p-6 flex flex-col flex-1">
                    <h3 className="font-serif text-xl font-semibold text-charcoal">{t(cat.title)}</h3>
                    <p className="mt-2 text-stone text-sm leading-relaxed flex-1">{t(cat.description)}</p>
                    <span className="mt-4 inline-block text-brand-teal font-sans text-xs tracking-wide">
                      {t({ en: "Learn More →", ru: "Подробнее →" })}
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pt-6 md:pt-32 pb-6 md:pb-32 bg-cta-teal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif font-light text-2xl md:text-5xl text-white">
              {t({ ru: "Готовы Исследовать Восточный Бали?", en: "Ready to Explore East Bali?" })}
            </h2>
            <p className="mt-4 text-sm md:text-lg text-white/70 leading-relaxed">
              {t({
                ru: "Свяжитесь с нами — мы подберём экскурсии и впечатления специально для вас.",
                en: "Get in touch and we'll arrange the perfect experiences for your stay.",
              })}
            </p>
            <div className="mt-8">
              <SecondaryButton
                href={`https://wa.me/${getWhatsAppNumber()}?text=${ctaMsg}`}
                external
                className="border-white text-white hover:bg-white/10 hover:border-white/80"
              >
                {t({ ru: "Написать нам", en: "Message Us" })}
              </SecondaryButton>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
