import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import type { GalleryPreviewData } from "@/lib/types";

interface GalleryPreviewProps {
  data: GalleryPreviewData;
}

export function GalleryPreview({ data }: GalleryPreviewProps) {
  return (
    <section id="gallery" className="py-24 md:py-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading label={data.label} heading={data.heading} />
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.images.map((img, i) => (
            <FadeIn key={img.src} delay={i * 0.1}>
              <div className="relative aspect-square overflow-hidden group">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-12 text-center">
            <PrimaryButton href="#booking">View Full Gallery</PrimaryButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
