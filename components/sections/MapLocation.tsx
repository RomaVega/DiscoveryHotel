"use client"; // Uses useLanguage for translated labels

import { MapPin, Navigation } from "lucide-react";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import type { ContactData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface MapLocationProps {
  contact: ContactData;
}

export function MapLocation({ contact }: MapLocationProps) {
  const { tl } = useLanguage();
  const { lat, lng } = contact.coordinates;
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <section id="location" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            label={tl.map.label}
            heading={tl.map.heading}
            subtext={tl.map.subtext}
          />
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Map */}
            <div className="md:col-span-2 relative aspect-[16/9] md:aspect-[2/1] border border-charcoal/10 overflow-hidden">
              <iframe
                src={embedUrl}
                title="Orlowsky Discovery Hotel location on Google Maps"
                className="absolute inset-0 w-full h-full border-0 grayscale-[0.3] contrast-[0.95]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Address card */}
            <div className="bg-ivory p-8 border border-charcoal/5 h-full flex flex-col justify-center">
              <div className="flex items-start gap-3 mb-6">
                <MapPin
                  size={20}
                  className="text-brand-teal shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-charcoal mb-2">
                    {tl.map.address}
                  </h3>
                  {contact.address.map((line) => (
                    <p key={line} className="text-stone text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <SecondaryButton
                href={contact.googleMapsUrl}
                external
                className="inline-flex items-center justify-center gap-2 hover:bg-transparent hover:text-deep-teal hover:border-deep-teal"
              >
                <Navigation size={16} />
                {tl.map.viewOnMaps}
              </SecondaryButton>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
