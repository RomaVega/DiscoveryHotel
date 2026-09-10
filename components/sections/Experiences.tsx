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
import { joinSlashes } from "@/lib/typography";
import type { ExperiencesData, ExperienceCard } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

interface ExperiencesProps {
  data: ExperiencesData;
  /**
   * Below `sm`, render two-up tiles instead of one full-width card each.
   *
   * Titles run 1–3 lines at tile width, and a variable text block under a fixed
   * image stretches the card — the grid then propagates the tallest card across
   * its row. Cards in a row are therefore equal height, but the shorter title
   * would leave trailing dead space inside its own card; letting the title grow
   * into that space and centring within it turns the surplus into symmetric
   * padding rather than a ragged gap. Rows still differ in height from each
   * other, which reads as intentional; a gap inside one card does not.
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
            // Inter, matching every other card title on the site. This was
            // Cormorant 400 at 22px, which put the home page's experience cards
            // in a different face from the identical six cards on /experiences.
            // Most of the old reasoning here was about Cormorant specifically —
            // its small x-height, its hairlines collapsing at 600 — and none of
            // it survives the switch, so it is gone rather than left to mislead.
            "font-sans font-normal tracking-normal text-charcoal",
            // Tap/hover feedback off the card wrapper's `group`. deep-teal, not
            // brand-teal: brand-teal is only 2.3:1 on ivory and would fail AA at
            // this size. deep-teal measures 5.7:1 and is already the pill's
            // hover colour. group-active carries this on touch, where there is
            // no hover.
            "transition-colors duration-300 group-hover:text-deep-teal group-active:text-deep-teal",
            // 18px, where Cormorant needed 22px for the same apparent size —
            // Inter's x-height is far larger, so it reads bigger per point.
            //
            // 10ch, measured not guessed: at 11ch and above "Ayurvedic Spa" fits
            // on one line and sits alone beside two-line neighbours. Dropping the
            // weight to 400 narrowed the text enough that a 12ch cap stopped
            // wrapping it, which is how that regressed. 9ch also holds, so 10ch
            // is not on the edge. Russian has words longer than the cap
            // ("Аюрведический" is 13), which overflow the box rather than
            // breaking mid-word — checked to stay inside the card.
            //
            // The min-height reservation is retuned too: two lines of 18px at
            // leading-tight come to ~45px, where two lines of 22px Cormorant
            // came to ~55px. min-h is a floor, and flex-1 lets
            // the title absorb whatever height the row's tallest card imposes,
            // with items-center holding it optically centred. Without flex-1 the
            // surplus pools below the title and the shorter card reads top-heavy,
            // since the <p> that would take up the slack is hidden here.
            compactMobile
              ? "text-lg leading-tight text-balance text-center max-w-[10ch] mx-auto flex flex-1 items-center justify-center min-h-[3rem] " +
                "sm:block sm:flex-none sm:max-w-none sm:mx-0 sm:min-h-0 sm:text-left sm:text-xl"
              : "text-xl leading-tight",
          )}
        >
          {/* joinSlashes, not the raw title: RU "Аренда Авто/Мото" otherwise
              breaks after the slash at tile width. */}
          {joinSlashes(t(item.title))}
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
