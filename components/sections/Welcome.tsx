import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { WelcomeData } from "@/lib/types";

interface WelcomeProps {
  data: WelcomeData;
}

export function Welcome({ data }: WelcomeProps) {
  return (
    <section className="py-24 md:py-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
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
            <div className="relative aspect-[4/3] overflow-hidden">
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
