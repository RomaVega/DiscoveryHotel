// Server Component — static content, no hooks. Keeps it out of the client bundle
// and out of the RSC props payload that the marquee beside it pays for.

import type { RatingAggregate, Locale } from "@/lib/types";
import enLocale from "@/locales/en.json";
import ruLocale from "@/locales/ru.json";

interface RatingSummaryProps {
  aggregates: RatingAggregate[];
  locale: Locale;
}

/** "2026-07-24" → "July 2026" / "июль 2026" — day precision is noise for a verification stamp. */
function formatVerifiedOn(iso: string, locale: Locale): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Third-party ratings, linked back to each source.
 *
 * Every platform we have a score for is shown, including the lower ones — a wall
 * of hand-picked five-star quotes persuades nobody, whereas four independent
 * platforms agreeing is checkable in one click. That verifiability is the point.
 */
export function RatingSummary({ aggregates, locale }: RatingSummaryProps) {
  if (aggregates.length === 0) return null;

  const t = (locale === "ru" ? ruLocale : enLocale).reviews;
  const verifiedOn = formatVerifiedOn(aggregates[0].verifiedOn, locale);

  return (
    <div className="max-w-7xl mx-auto px-6 mb-12">
      <p className="font-sans text-xs tracking-widest uppercase text-stone text-center mb-6">
        {t.ratingsHeading}
      </p>

      <ul className="flex flex-wrap justify-center gap-x-10 gap-y-6 sm:gap-x-14">
        {aggregates.map((a) => (
          <li key={a.platform}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${a.platform}: ${a.score} ${locale === "ru" ? "из" : "out of"} ${a.scale}, ${a.count} ${t.reviewsCountSuffix} — ${t.opensInNewTab}`}
              className="group block text-center rounded-md px-3 py-1 transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
            >
              <span className="block font-serif text-3xl font-light text-charcoal leading-none group-hover:text-deep-teal transition-colors duration-300">
                {a.score.toFixed(1)}
                <span className="text-base text-stone">/{a.scale}</span>
              </span>
              <span className="mt-2 block font-sans text-xs font-medium text-charcoal/80 group-hover:text-brand-teal transition-colors duration-300">
                {a.platform}
              </span>
              <span className="mt-0.5 block font-sans text-[11px] text-stone/80">
                {a.count} {t.reviewsCountSuffix}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center font-sans text-[11px] text-stone/70">
        {t.verifiedOn} {verifiedOn}
      </p>
    </div>
  );
}
