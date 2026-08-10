"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { LocalizedLink as Link } from "@/components/common/LocalizedLink";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import {
  SecondaryButton,
  SECONDARY_BUTTON_BASE,
  SECONDARY_BUTTON_HOVER,
} from "@/components/common/SecondaryButton";
import { cn } from "@/lib/utils";
import type { ExperiencesData, ExperienceCard } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface ExperiencesProps {
  data: ExperiencesData;
  /**
   * Below `sm`, render two-up tiles instead of one full-width card each.
   *
   * Titles run 1–3 lines at tile width, and a variable text block under a fixed
   * image stretches the card — the grid then propagates the tallest card across
   * its row, leaving short titles with trailing dead space. Reserving three lines
   * and centring within them makes every tile identical by construction, and
   * turns the leftover space into symmetric padding rather than a ragged gap.
   *
   * An earlier pass overlaid the title on the image instead. It was dropped: a
   * scrim dark enough for AA over pale photography (one tile measured 1.3:1
   * against a white dress) dimmed the images past what the section could carry.
   * Title on ivory needs no scrim at all.
   */
  compactMobile?: boolean;
}

function CardInner({ item, compactMobile }: { item: ExperienceCard; compactMobile?: boolean }) {
  const { t } = useLanguage();
  const cta = item.cta ?? { en: "See More", ru: "Подробнее" };
  return (
    <>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          compactMobile ? "aspect-[4/3] sm:aspect-video" : "aspect-video",
        )}
      >
        <Image
          src={item.image}
          alt={t(item.imageAlt)}
          fill
          sizes={compactMobile ? "(max-width: 640px) 50vw, 50vw" : "(max-width: 640px) 100vw, 50vw"}
          className="object-cover"
          // Focal point comes from content, so it can't be a JIT-visible class
          style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
        />
      </div>
      <div className={cn("flex flex-col flex-1", compactMobile ? "p-3 sm:p-5 md:p-8" : "p-5 md:p-8")}>
        <h3
          className={cn(
            // Cormorant is a high-contrast display serif: at 600 the hairlines
            // thicken and the contrast that carries the face collapses. 400 is
            // what the design system reserves for smaller headings (300 is for
            // display sizes only, and goes wispy at 22px). Size + tracking carry
            // the emphasis the weight used to, and this now matches the
            // font-light SectionHeading directly above the grid.
            "font-serif font-normal tracking-wide text-charcoal",
            // Tap/hover feedback off the card wrapper's `group`. deep-teal, not
            // brand-teal: brand-teal is only 2.3:1 on ivory, and a 22px regular
            // title is not WCAG "large text", so it would fail AA. deep-teal
            // measures 5.7:1 and is already the pill's hover colour.
            // group-active carries this on touch, where there is no hover.
            "transition-colors duration-300 group-hover:text-deep-teal group-active:text-deep-teal",
            // 22px, not the 20px floor: Cormorant has an unusually small
            // x-height, so it reads a size down from the sans around it.
            // leading-tight is explicit because the arbitrary size drops
            // Tailwind's paired line-height — two lines at 1.25 come to 55px,
            // which is what keeps them inside the 3.5rem reservation below.
            // The 10ch cap is what puts every title on exactly two lines: it is
            // wider than no single word here, so nothing breaks mid-word, but
            // narrow enough that even the shortest label ("Ayurvedic Spa") wraps
            // rather than sitting alone on one line beside two-line neighbours.
            // min-h then guarantees equal tiles even if a title ever renders one
            // line; centring keeps the block optically centred in the card.
            compactMobile
              ? "text-[22px] leading-tight text-balance text-center max-w-[10ch] mx-auto flex items-center justify-center min-h-[3.5rem] " +
                "sm:block sm:max-w-none sm:mx-0 sm:min-h-0 sm:text-left sm:text-[26px]"
              : "text-[26px] leading-tight",
          )}
        >
          {t(item.title)}
        </h3>
        <p className={cn("mt-2 text-stone leading-relaxed flex-1", compactMobile && "hidden sm:block")}>
          {t(item.description)}
        </p>
        <div className={cn("mt-6 justify-center", compactMobile ? "hidden sm:flex" : "flex")}>
          {/* A span, not SecondaryButton: the whole card is already an <a>. */}
          <span className={cn(SECONDARY_BUTTON_BASE, SECONDARY_BUTTON_HOVER)}>
            {t(cta)}
          </span>
        </div>
      </div>
    </>
  );
}

export function Experiences({ data, compactMobile }: ExperiencesProps) {
  const { t, tl } = useLanguage();

  const cardClass = "bg-ivory shadow-md group h-full flex flex-col overflow-hidden rounded-md";

  return (
    <section id="experiences" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            label={t(data.label)}
            heading={t(data.heading)}
            subtext={t(data.subtext)}
          />
        </FadeIn>

        <div
          className={cn(
            "grid sm:grid-cols-2 sm:gap-8",
            compactMobile ? "grid-cols-2 gap-3" : "grid-cols-1 gap-8",
          )}
        >
          {data.items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                  <CardInner item={item} compactMobile={compactMobile} />
                </a>
              ) : (
                <Link href={item.href} className={cardClass}>
                  <CardInner item={item} compactMobile={compactMobile} />
                </Link>
              )}
            </FadeIn>
          ))}
        </div>

        {/* One destination for the section, replacing six per-tile pills that the
            overlay leaves no room for. Mobile only — the pills are still visible
            from `sm` up, where they have the width to work. */}
        {compactMobile && (
          <FadeIn delay={0.2}>
            <div className="mt-8 flex justify-center sm:hidden">
              <SecondaryButton href="/experiences">{tl.experiences.viewMore}</SecondaryButton>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
