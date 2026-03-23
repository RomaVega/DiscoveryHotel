"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import type { WeddingsPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { Check } from "lucide-react";

interface WeddingsDetailProps {
  data: WeddingsPageData;
}

export function WeddingsDetail({ data }: WeddingsDetailProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        <div className="space-y-20">
          {data.packages.map((pkg, i) => (
            <FadeIn key={i}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start`}>
                <div className={`relative aspect-[4/3] overflow-hidden shadow-lg ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <Image
                    src={pkg.image}
                    alt={t(pkg.imageAlt)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="font-serif text-3xl font-light text-charcoal">{t(pkg.title)}</h2>
                  <p className="mt-4 text-stone leading-relaxed">{t(pkg.description)}</p>
                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {pkg.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <Check size={16} className="text-brand-teal shrink-0 mt-0.5" />
                          <span className="text-charcoal text-sm">{t(feature)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
