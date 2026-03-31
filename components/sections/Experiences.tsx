"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { ExperiencesData, ExperienceCard } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface ExperiencesProps {
  data: ExperiencesData;
}

function CardInner({ item, label }: { item: ExperienceCard; label: string }) {
  const { t } = useLanguage();
  return (
    <>
      <div className="relative aspect-video shrink-0 overflow-hidden">
        <Image
          src={item.image}
          alt={t(item.imageAlt)}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="p-5 md:p-8 flex flex-col flex-1">
        <h3 className="font-serif text-2xl font-semibold text-charcoal">{t(item.title)}</h3>
        <p className="mt-2 text-stone leading-relaxed flex-1">{t(item.description)}</p>
        <div className="mt-6 flex justify-center md:justify-start">
          <span className="inline-block bg-transparent border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white hover:scale-[1.04] active:scale-[0.97] font-sans font-semibold px-5 py-2 rounded-full tracking-wide text-xs transition-all duration-300">
            {label}
          </span>
        </div>
      </div>
    </>
  );
}

export function Experiences({ data }: ExperiencesProps) {
  const { t } = useLanguage();

  return (
    <section id="experiences" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            label={t(data.label)}
            heading={t(data.heading)}
            subtext={t(data.subtext)}
          />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {data.items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="bg-ivory shadow-md group h-full flex flex-col overflow-hidden">
                  <CardInner item={item} label={t({ en: "See More", ru: "Подробнее" })} />
                </a>
              ) : (
                <Link href={item.href} className="bg-ivory shadow-md group h-full flex flex-col overflow-hidden">
                  <CardInner item={item} label={t({ en: "See More", ru: "Подробнее" })} />
                </Link>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
