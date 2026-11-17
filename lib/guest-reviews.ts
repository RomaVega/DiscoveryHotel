/**
 * Flattens the hand-copied reviews in content/guest-reviews.json to one page
 * locale, on the server. The review wall is a client component (it filters), so
 * resolving here keeps the other language's text — and every original the
 * reader does not open — out of the props it is sent, apart from the one
 * original each translated card carries for "Show original".
 */
import type {
  GuestReview, GuestReviewsPageData, Locale, LocalizedString, RatingAggregate, ResolvedGuestReview, ReviewPlatform,
} from "./types";
import { fill } from "./utils";
import { getGuestReviewsPageData, getRatingAggregates } from "./content";
import enLocale from "@/locales/en.json";
import ruLocale from "@/locales/ru.json";

const INTL_LOCALE: Record<Locale, string> = { en: "en-GB", ru: "ru-RU" };

/** Display names exactly as each platform writes its own. */
export const PLATFORM_NAMES: Record<ReviewPlatform, string> = {
  google: "Google",
  booking: "Booking.com",
  agoda: "Agoda",
  tripadvisor: "Tripadvisor",
};

const stringsFor = (locale: Locale) => (locale === "ru" ? ruLocale : enLocale).guestReviews;

/** Server-side `t()`: these sections render on the server and have no LanguageProvider hook. */
export const inLocale = (value: LocalizedString, locale: Locale): string =>
  typeof value === "string" ? value : value[locale];

/**
 * Where "Read on …" goes. Only Google gives a review its own link, and only
 * from inside Maps, so every card points at the listing — the same URL the
 * verified scores band uses, which keeps the two from disagreeing.
 */
function sourceUrl(platform: ReviewPlatform, aggregates: RatingAggregate[]): string {
  const hit = aggregates.find((a) => a.platform === PLATFORM_NAMES[platform]);
  if (!hit) throw new Error(`guest-reviews: no rating aggregate for ${platform}, so no listing URL to link`);
  return hit.url;
}

/** Booking.com writes 9.0 and 10; Google 5. Match what the guest saw. */
export function formatScore(score: number, scale: 5 | 10): string {
  if (Number.isInteger(score) && (scale === 5 || score === 10)) return String(score);
  return score.toFixed(1);
}

function dateLabel(review: GuestReview, locale: Locale): string | null {
  if (!review.date || !review.dateKind) return null;
  const s = stringsFor(locale);
  if (review.dateKind === "review") return fill(s.reviewedIn, { date: review.date });
  const [y, m] = review.date.split("-").map(Number);
  const month = new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, 1)));
  return fill(s.stayed, { date: month });
}

function meta(review: GuestReview, locale: Locale): string {
  const s = stringsFor(locale);
  const countries: Record<string, string> = s.countries;
  if (review.country && !countries[review.country]) {
    throw new Error(`guest-reviews: add "${review.country}" to guestReviews.countries in locales/${locale}.json`);
  }
  return [
    review.country && countries[review.country],
    review.travellerType && s.travellerTypes[review.travellerType],
    review.room && s.rooms[review.room],
  ].filter(Boolean).join(" · ");
}

export function resolveGuestReviews(
  data: GuestReviewsPageData,
  aggregates: RatingAggregate[],
  locale: Locale,
): ResolvedGuestReview[] {
  const s = stringsFor(locale);
  return data.reviews.map((r) => {
    // Validation guarantees text.en and text.ru, so this never falls through.
    const shown = r.text[locale]!;
    const translated = r.language !== locale;
    const reply = r.reply
      ? {
          passages: r.reply.text[locale]!,
          translatedFrom: r.reply.language !== locale ? s.translatedFrom[r.reply.language] : null,
        }
      : undefined;
    return {
      id: r.id,
      platform: r.platform,
      platformName: PLATFORM_NAMES[r.platform],
      sourceUrl: sourceUrl(r.platform, aggregates),
      author: r.author,
      meta: meta(r, locale),
      dateLabel: dateLabel(r, locale),
      score: formatScore(r.score, r.scale),
      scale: r.scale,
      title: shown.title,
      passages: shown.passages,
      disliked: shown.disliked,
      translation: translated
        ? { label: s.translatedFrom[r.language], language: r.language, original: r.text[r.language]! }
        : null,
      ...(reply ? { reply } : {}),
    };
  });
}

export interface ResolvedTheme {
  title: string;
  quote: string;
  author: string;
  /** "Poland · Booking.com" */
  source: string;
  /** "Translated from Russian", when the quote is our translation. */
  translatedFrom: string | null;
}

export function resolveThemes(data: GuestReviewsPageData, locale: Locale): ResolvedTheme[] {
  const s = stringsFor(locale);
  const countries: Record<string, string> = s.countries;
  return data.themes.items.map((t) => {
    const r = data.reviews.find((x) => x.id === t.review)!;
    return {
      title: inLocale(t.title, locale),
      quote: t.quote[locale],
      author: r.author,
      source: [r.country && countries[r.country], PLATFORM_NAMES[r.platform]].filter(Boolean).join(" · "),
      translatedFrom: r.language !== locale ? s.translatedFrom[r.language] : null,
    };
  });
}

/** What a /reviews page file calls: the wall's cards for its locale. */
export function getGuestReviews(locale: Locale): ResolvedGuestReview[] {
  return resolveGuestReviews(getGuestReviewsPageData(), getRatingAggregates(), locale);
}

/** What a /reviews page file calls: the theme quotes for its locale. */
export function getReviewThemes(locale: Locale): ResolvedTheme[] {
  return resolveThemes(getGuestReviewsPageData(), locale);
}
