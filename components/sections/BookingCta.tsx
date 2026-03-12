import { FadeIn } from "@/components/common/FadeIn";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import type { BookingCtaData } from "@/lib/types";

interface BookingCtaProps {
  data: BookingCtaData;
}

export function BookingCta({ data }: BookingCtaProps) {
  return (
    <section id="booking" className="py-24 md:py-32 bg-deep-teal">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="font-serif font-light text-4xl md:text-5xl text-white">
            {data.heading}
          </h2>
          <p className="mt-4 text-lg text-white/70 leading-relaxed">
            {data.subtext}
          </p>
          <div className="mt-8">
            <PrimaryButton
              href={data.bookingUrl}
              external
              className="bg-white text-deep-teal hover:bg-sand hover:text-deep-teal"
            >
              {data.fallbackCta}
            </PrimaryButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
