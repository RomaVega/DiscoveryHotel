import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { RoomsPreviewData } from "@/lib/types";

interface RoomsPreviewProps {
  data: RoomsPreviewData;
}

export function RoomsPreview({ data }: RoomsPreviewProps) {
  return (
    <section id="rooms" className="py-24 md:py-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            label={data.label}
            heading={data.heading}
            subtext={data.subtext}
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.rooms.map((room, i) => (
            <FadeIn key={room.title} delay={i * 0.1}>
              <Link href={room.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={room.image}
                    alt={room.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-serif text-2xl font-light">
                      {room.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/80 leading-relaxed">
                      {room.description}
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
