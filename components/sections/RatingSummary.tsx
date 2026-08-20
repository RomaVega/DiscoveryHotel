// Server Component — static content, no hooks. Keeps it out of the client bundle
// and out of the RSC props payload that the marquee beside it pays for.

import { SectionHeading } from "@/components/common/SectionHeading";
import type { RatingAggregate, Locale } from "@/lib/types";
import enLocale from "@/locales/en.json";
import ruLocale from "@/locales/ru.json";

interface RatingSummaryProps {
  aggregates: RatingAggregate[];
  locale: Locale;
}

const INTL_LOCALE: Record<Locale, string> = { en: "en-GB", ru: "ru-RU" };

/** Spelled out because "777 Reviews Across Four Platforms" reads better than "4 Platforms". */
const PLATFORM_WORDS: Record<Locale, Record<number, string>> = {
  en: { 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six" },
  ru: { 2: "Двух", 3: "Трёх", 4: "Четырёх", 5: "Пяти", 6: "Шести" },
};

/**
 * Russian agrees the noun with the numeral: 192 takes "отзыва" while 225 takes
 * "отзывов". A single hardcoded form is wrong for roughly a third of counts,
 * so pick the form via Intl rather than guessing.
 */
function pluralize(count: number, locale: Locale): string {
  const forms: Record<string, string> = (locale === "ru" ? ruLocale : enLocale).reviews.reviewPlurals;
  const rule = new Intl.PluralRules(INTL_LOCALE[locale]).select(count);
  return forms[rule] ?? forms.other;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** "2026-07-24" → "July 2026" / "июль 2026 г." — day precision is noise for a verification stamp. */
function formatVerifiedOn(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** The least-recently-verified date in the set — see the note at the render site. */
function oldestVerifiedOn(aggregates: RatingAggregate[]): string {
  return aggregates.reduce((oldest, a) => (a.verifiedOn < oldest ? a.verifiedOn : oldest), aggregates[0].verifiedOn);
}

/**
 * Third-party ratings, linked back to each source.
 *
 * Every platform we have a score for is shown, including the lower ones — a wall
 * of hand-picked five-star quotes persuades nobody, whereas four independent
 * platforms agreeing is checkable in one click. That verifiability is the point.
 *
 * Owns the section heading too: the aggregate count is the honest headline for
 * what follows, and deriving it from the data keeps it true when scores change.
 */
export function RatingSummary({ aggregates, locale }: RatingSummaryProps) {
  if (aggregates.length === 0) return null;

  const t = (locale === "ru" ? ruLocale : enLocale).reviews;
  const nf = new Intl.NumberFormat(INTL_LOCALE[locale]);

  const totalReviews = aggregates.reduce((sum, a) => sum + a.count, 0);
  const heading = t.heading
    .replace("{count}", nf.format(totalReviews))
    .replace("{reviews}", capitalize(pluralize(totalReviews, locale)))
    .replace("{platforms}", PLATFORM_WORDS[locale][aggregates.length] ?? String(aggregates.length));

  return (
    <div className="max-w-7xl mx-auto px-6 mb-10">
      {/* Site-wide heading pattern — matches every other section's label + h2 scale */}
      <SectionHeading label={t.label} heading={heading} />

      <ul className="flex flex-wrap justify-center gap-x-10 gap-y-6 sm:gap-x-14">
        {aggregates.map((a) => (
          <li key={a.platform}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${a.platform}: ${a.score} ${locale === "ru" ? "из" : "out of"} ${a.scale}, ${a.count} ${pluralize(a.count, locale)} — ${t.opensInNewTab}`}
              className="group block text-center rounded-md px-3 py-1 transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
            >
              {/* Hover darkens to espresso rather than brightening to
                  brand-teal. WCAG applies to every state, and brand-teal is
                  2.27:1 on ivory — under even the 3:1 large-text floor, so the
                  old hover failed on both the score and the platform name. */}
              <span className="block font-serif text-3xl font-light text-accent-text leading-none group-hover:text-espresso transition-colors duration-300">
                {a.score.toFixed(1)}
                {/* The scale reads quieter than the score by size alone (16px
                    against 30px). It carried a /50 opacity on top of that,
                    which dropped it to 2.14:1 for no hierarchy it hadn't
                    already earned. */}
                <span className="text-base text-accent-text">/{a.scale}</span>
              </span>
              <span className="mt-2 block font-sans text-xs font-medium text-charcoal/80 group-hover:text-espresso transition-colors duration-300">
                {a.platform}
              </span>
              <span className="mt-0.5 block font-sans text-[11px] text-stone/80">
                {nf.format(a.count)} {pluralize(a.count, locale)}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center font-sans text-[11px] text-stone/70">
        {/* The oldest date across the platforms, not the first one listed: this single
            line stands for all four scores, so it must not read fresher than the
            least-recently-checked figure behind it. */}
        {t.verifiedOn} {formatVerifiedOn(oldestVerifiedOn(aggregates), locale)}
      </p>
    </div>
  );
}
