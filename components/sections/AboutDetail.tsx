"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import type { AboutPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface AboutDetailProps {
  data: AboutPageData;
}

export function AboutDetail({ data }: AboutDetailProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        <div className="space-y-20">
          {data.sections.map((section, i) => (
            <FadeIn key={i}>
              <div className={`grid grid-cols-1 ${section.image ? "lg:grid-cols-2 gap-8 md:gap-12 items-center" : ""}`}>
                {section.image && (
                  <div className={`relative aspect-[4/3] overflow-hidden shadow-lg ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <Image
                      src={section.image}
                      alt={section.imageAlt || ""}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className={section.image && i % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="font-serif text-3xl font-light text-charcoal">{t(section.title)}</h2>
                  <p className="mt-4 text-stone leading-relaxed">{t(section.description)}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
