"use client"; // Uses useLanguage for content translation

import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { ExperienceTile } from "@/components/common/ExperienceTile";
import type { ExperiencesData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { longestTitleLine } from "@/lib/typography";

interface ExperiencesProps {
  data: ExperiencesData;
}

/**
 * Home-page Experiences: photo tiles, two-up on phones and three-up from `lg`,
 * with one "View More" link to /experiences under the grid. The tiles carry no
 * description or per-card pill — each tile is itself the link to its page.
 */
export function Experiences({ data }: ExperiencesProps) {
  const { t, tl } = useLanguage();
  const fitChars = Math.max(...data.items.map((item) => longestTitleLine(t(item.title))));

  return (
    <section id="experiences" className="pt-12 md:pt-32 pb-12 md:pb-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionHeading
            label={t(data.label)}
            heading={t(data.heading)}
            subtext={t(data.subtext)}
            rule
          />
        </FadeIn>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {data.items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <ExperienceTile item={item} title={t(item.title)} imageAlt={t(item.imageAlt)} fitChars={fitChars} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-8 md:mt-12 flex justify-center">
            <SecondaryButton href="/experiences">{tl.experiences.viewMore}</SecondaryButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
