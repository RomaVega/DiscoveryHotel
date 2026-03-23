"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/common/FadeIn";
import { useLanguage } from "@/lib/language-context";
import type { ExperiencesHubData } from "@/lib/types";

interface ExperiencesHubProps {
  data: ExperiencesHubData;
}

export function ExperiencesHub({ data }: ExperiencesHubProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-32 bg-sand">
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
  );
}
