// Server Component — static content, no hooks.

import { SectionHeading } from "@/components/common/SectionHeading";
import { inLocale, type ResolvedTheme } from "@/lib/guest-reviews";
import type { GuestReviewsPageData, Locale } from "@/lib/types";

interface ReviewThemesProps {
  copy: GuestReviewsPageData["themes"];
  themes: ResolvedTheme[];
  locale: Locale;
}

/**
 * "What guests mention most": one short quote per theme. Every quote is cut
 * from a review on the wall below — validation refuses one that is not — so
 * the band can only ever repeat what a guest actually wrote.
 */
export function ReviewThemes({ copy, themes, locale }: ReviewThemesProps) {
  if (themes.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-sand">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label={inLocale(copy.label, locale)}
          heading={inLocale(copy.heading, locale)}
          subtext={inLocale(copy.subtext, locale)}
        />
        <ul className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {themes.map((t) => (
            <li
              key={t.title}
              className="flex flex-col rounded-2xl bg-ivory p-8 md:p-10 shadow-sm ring-1 ring-charcoal/5"
            >
              <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-accent-text">
                {t.title}
              </h3>
              {/* Cormorant at 500, not the 300 display weight: at this size 300
                  breaks into hairlines, the reason section headings moved too. */}
              <blockquote className="mt-5 font-serif text-2xl md:text-[1.75rem] font-medium leading-snug text-charcoal text-pretty">
                <span aria-hidden="true" className="mr-1 text-accent-text">“</span>
                {t.quote}
                <span aria-hidden="true" className="ml-0.5 text-accent-text">”</span>
              </blockquote>
              <p className="mt-auto pt-6 font-sans text-sm text-charcoal/70">
                <span className="font-semibold text-charcoal">{t.author}</span>
                {" · "}
                {t.source}
              </p>
              {t.translatedFrom && (
                <p className="mt-1 font-sans text-xs text-charcoal/70">{t.translatedFrom}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
