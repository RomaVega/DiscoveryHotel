// Server Component — static content, no hooks.

import { RatingSummary } from "@/components/sections/RatingSummary";
import type { Locale, RatingAggregate } from "@/lib/types";

interface ReviewsOverviewProps {
  aggregates: RatingAggregate[];
  locale: Locale;
}

/**
 * The top of /reviews: every platform's own score, linked to the platform.
 * It comes before any quote on purpose — the scores are the unedited picture,
 * and the hand-picked reviews below are read against them.
 */
export function ReviewsOverview({ aggregates, locale }: ReviewsOverviewProps) {
  return (
    <section className="pt-24 pb-14 md:pt-32 md:pb-20 bg-ivory">
      <RatingSummary aggregates={aggregates} locale={locale} />
    </section>
  );
}
