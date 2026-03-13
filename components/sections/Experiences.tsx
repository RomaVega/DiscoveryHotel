"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { ExperiencesData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface ExperiencesProps {
  data: ExperiencesData;
}

export function Experiences({ data }: ExperiencesProps) {
  const { t } = useLanguage();

  return (
    <section id="experiences" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-ivory">
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
              <Link href={item.href} className="group block">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-serif text-2xl font-light">
                      {t(item.title)}
                    </h3>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed md:opacity-0 md:translate-y-2 transition-all duration-300 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                      {t(item.description)}
                    </p>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
