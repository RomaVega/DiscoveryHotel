import {
  UtensilsCrossed,
  Sparkles,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { AmenitiesData } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Sparkles,
  Waves,
  Wifi,
};

interface AmenitiesProps {
  data: AmenitiesData;
}

export function Amenities({ data }: AmenitiesProps) {
  return (
    <section id="amenities" className="py-24 md:py-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading label={data.label} heading={data.heading} />
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.items.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="text-center">
                  {Icon && (
                    <Icon
                      size={32}
                      strokeWidth={1.5}
                      className="mx-auto text-brand-teal mb-4"
                    />
                  )}
                  <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-stone text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
