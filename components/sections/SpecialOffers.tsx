import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import type { OffersData } from "@/lib/types";

interface SpecialOffersProps {
  data: OffersData;
}

export function SpecialOffers({ data }: SpecialOffersProps) {
  const activeOffers = data.offers.filter((o) => o.active);

  if (activeOffers.length === 0) return null;

  return (
    <section id="offers" className="py-24 md:py-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading label={data.label} heading={data.heading} />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeOffers.map((offer, i) => (
            <FadeIn key={offer.title} delay={i * 0.1}>
              <div className="bg-ivory overflow-hidden group">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={offer.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-8">
                  <h3 className="font-serif text-2xl font-light text-charcoal">
                    {offer.title}
                  </h3>
                  <p className="mt-2 text-stone leading-relaxed">
                    {offer.description}
                  </p>
                  <p className="mt-4 font-sans text-lg font-semibold text-brand-teal">
                    {offer.price}
                  </p>
                  <div className="mt-6">
                    <PrimaryButton href="#booking">Book This Offer</PrimaryButton>
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
