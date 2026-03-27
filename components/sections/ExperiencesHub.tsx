"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/common/FadeIn";
import { useLanguage } from "@/lib/language-context";
import type { ExperiencesHubData } from "@/lib/types";

const WHATSAPP = "6282236655582";

interface ExperiencesHubProps {
  data: ExperiencesHubData;
}

export function ExperiencesHub({ data }: ExperiencesHubProps) {
  const { t, locale } = useLanguage();
  const isRu = locale === "ru";

  const ctaMsg = encodeURIComponent(isRu
    ? "Здравствуйте! Хочу узнать подробнее о доступных экскурсиях и впечатлениях."
    : "Hello! I'd like to find out more about available experiences and tours.");

  return (
    <div>
      {/* ── Pull quote ── */}
      <FadeIn>
        <div className="bg-ivory py-16 md:py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-px h-10 bg-brand-teal mx-auto mb-7" />
            <p className="font-serif text-xl md:text-2xl font-light text-charcoal leading-relaxed italic">
              {isRu
                ? "Восточный Бали — это не туристические маршруты. Это храмы без толп, вулканы на рассвете и риф, который мало кто видел."
                : "East Bali is not a tourist trail. It is temples without crowds, volcanoes at dawn, and a reef few have seen."}
            </p>
            <div className="w-px h-10 bg-brand-teal mx-auto mt-7" />
          </div>
        </div>
      </FadeIn>

      {/* ── Cards grid ── */}
      <section className="py-16 md:py-24 bg-sand">
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
      <section className="pt-12 md:pt-32 pb-12 md:pb-32 bg-cta-teal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif font-light text-3xl md:text-5xl text-white">
              {isRu ? "Готовы исследовать Восточный Бали?" : "Ready to Explore East Bali?"}
            </h2>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              {isRu
                ? "Свяжитесь с нами — мы подберём экскурсии и впечатления специально для вас."
                : "Get in touch and we'll arrange the perfect experiences for your stay."}
            </p>
            <div className="mt-8">
              <a
                href={`https://wa.me/${WHATSAPP}?text=${ctaMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent hover:bg-white/10 border border-white hover:border-white/80 text-white font-sans font-semibold px-5 py-2 rounded-full tracking-wide uppercase text-xs transition-all duration-300"
              >
                {isRu ? "Написать нам" : "Message Us"}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
