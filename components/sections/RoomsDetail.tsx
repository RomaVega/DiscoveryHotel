"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import type { RoomsPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface RoomsDetailProps {
  data: RoomsPageData;
}

export function RoomsDetail({ data }: RoomsDetailProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-20 md:space-y-32">
          {data.rooms.map((room, i) => (
            <FadeIn key={i}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                <div className={`relative aspect-[4/3] overflow-hidden shadow-lg ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <Image
                    src={room.image}
                    alt={t(room.imageAlt)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal">
                    {t(room.title)}
                  </h2>
                  <p className="mt-4 text-stone leading-relaxed">
                    {t(room.description)}
                  </p>

                  {room.amenities && room.amenities.length > 0 && (
                    <ul className="mt-6 grid grid-cols-2 gap-2">
                      {room.amenities.map((a, j) => (
                        <li key={j} className="flex items-start gap-2 text-charcoal">
                          <span className="text-brand-teal mt-1">•</span>
                          <span className="text-sm leading-relaxed">{t(a)}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {room.highlights && room.highlights.length > 0 && (
                    <ul className="mt-6 space-y-2">
                      {room.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-3 text-charcoal">
                          <span className="text-brand-teal mt-1">•</span>
                          <span className="text-sm leading-relaxed">{t(h)}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-8 flex justify-center">
                    <a
                      href={room.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-transparent border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white font-sans font-semibold px-6 py-3 rounded-full tracking-wide text-xs transition-all duration-300"
                    >
                      {t({ en: "Book This Room", ru: "Забронировать" })}
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
