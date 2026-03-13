"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { WelcomeData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface WelcomeProps {
  data: WelcomeData;
}

export function Welcome({ data }: WelcomeProps) {
  const { t } = useLanguage();

  return (
    <section className="pt-12 md:pt-24 pb-12 md:pb-24 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <FadeIn>
            <SectionHeading
              label={t(data.label)}
              heading={t(data.heading)}
              centered={false}
            />
            <p className="text-stone text-lg leading-relaxed -mt-6">
              {t(data.description)}
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="relative aspect-[3/2] md:aspect-[4/5] w-full">
              <Image
                src={data.image}
                alt={data.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
