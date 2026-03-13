import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { WelcomeData } from "@/lib/types";

interface WelcomeProps {
  data: WelcomeData;
}

export function Welcome({ data }: WelcomeProps) {
  return (
    <section className="pt-12 md:pt-32 pb-4 md:pb-12 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <FadeIn>
            <SectionHeading
              label={data.label}
              heading={data.heading}
              centered={false}
            />
            <p className="text-stone text-lg leading-relaxed -mt-8">
              {data.description}
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Image
              src={data.image}
              alt={data.imageAlt}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto max-h-[580px] object-contain"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
