import { MapPin, Navigation } from "lucide-react";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { ContactData } from "@/lib/types";

interface MapLocationProps {
  contact: ContactData;
}

export function MapLocation({ contact }: MapLocationProps) {
  const { lat, lng } = contact.coordinates;
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <section id="location" className="py-24 md:py-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            label="Location"
            heading="Find Us in Paradise"
            subtext="Nestled on the tranquil coast of Candidasa, East Bali — away from the crowds, close to everything."
          />
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Map */}
            <div className="md:col-span-2 relative aspect-[16/9] md:aspect-[2/1] overflow-hidden shadow-lg">
              <iframe
                src={embedUrl}
                title="Orlowsky Discovery Hotel location on Google Maps"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Address card */}
            <div className="bg-ivory p-8 shadow-lg h-full flex flex-col justify-center">
              <div className="flex items-start gap-3 mb-6">
                <MapPin size={20} className="text-brand-teal shrink-0 mt-1" />
                <div>
                  <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-charcoal mb-2">
                    Address
                  </h3>
                  {contact.address.map((line) => (
                    <p key={line} className="text-stone text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <a
                href={contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-teal hover:bg-deep-teal text-white font-sans font-semibold px-6 py-3 tracking-wide uppercase text-sm transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
              >
                <Navigation size={16} />
                Get Directions
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
