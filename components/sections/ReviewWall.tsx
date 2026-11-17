"use client"; // Uses useState for the platform filter

import { useState } from "react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { useLanguage } from "@/lib/language-context";
import type { GuestReviewText, GuestReviewsPageData, ResolvedGuestReview, ReviewPlatform } from "@/lib/types";
import { cn, fill } from "@/lib/utils";

interface ReviewWallProps {
  copy: GuestReviewsPageData["wall"];
  reviews: ResolvedGuestReview[];
}

type Filter = "all" | ReviewPlatform;

/** Pill order — by review count on the platforms, the order the scores band uses. */
const PLATFORM_ORDER: ReviewPlatform[] = ["google", "booking", "tripadvisor", "agoda"];

/** Passages are excerpts; the ellipsis between them shows where we cut. */
const joinPassages = (passages: string[]) => passages.join(" … ");

function OriginalText({ text, lang }: { text: GuestReviewText; lang: string }) {
  return (
    <div lang={lang} className="mt-2 space-y-2 font-sans text-sm leading-relaxed text-charcoal/80">
      {text.title && <p className="font-semibold">{text.title}</p>}
      <p>{joinPassages(text.passages)}</p>
      {text.disliked && <p>− {joinPassages(text.disliked)}</p>}
    </div>
  );
}

function ReviewCard({ review }: { review: ResolvedGuestReview }) {
  const { tl } = useLanguage();
  const s = tl.guestReviews;

  return (
    <article className="mb-6 break-inside-avoid rounded-2xl bg-sand p-6 md:p-8 ring-1 ring-charcoal/5">
      <header className="flex items-start justify-between gap-4">
        <p aria-label={`${review.score} ${s.outOf} ${review.scale}`} className="leading-none">
          <span aria-hidden="true" className="font-serif text-4xl font-medium text-accent-text lining-nums">{review.score}</span>
          <span aria-hidden="true" className="font-sans text-sm text-charcoal/70"> / {review.scale}</span>
        </p>
        <p className="pt-1 font-sans text-xs font-semibold uppercase tracking-widest text-charcoal/70">
          {review.platformName}
        </p>
      </header>

      {review.title && (
        <h3 className="mt-5 font-sans text-lg font-semibold leading-snug text-charcoal text-pretty">{review.title}</h3>
      )}

      {/* text-base, not the cards' usual text-sm: the guests' words are the
          content of this page, and the audience reads 16px more easily. */}
      <blockquote className={cn(review.title ? "mt-2" : "mt-5", "font-sans text-base leading-relaxed text-charcoal/90 text-pretty")}>
        {joinPassages(review.passages)}
      </blockquote>

      {review.disliked && (
        <div className="mt-4">
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-charcoal/70">{s.disliked}</p>
          <p className="mt-1 font-sans text-base leading-relaxed text-charcoal/90 text-pretty">
            {joinPassages(review.disliked)}
          </p>
        </div>
      )}

      {review.reply && (
        <div className="mt-5 border-l-2 border-accent-text/40 pl-4">
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-charcoal/70">
            {s.reply}
            {review.reply.translatedFrom && <span className="font-normal normal-case tracking-normal"> · {review.reply.translatedFrom}</span>}
          </p>
          <p className="mt-1 font-sans text-sm leading-relaxed text-charcoal/90 text-pretty">
            {joinPassages(review.reply.passages)}
          </p>
        </div>
      )}

      <footer className="mt-6 border-t border-charcoal/10 pt-4 font-sans text-sm">
        <p className="font-semibold text-charcoal">{review.author}</p>
        {review.meta && <p className="mt-0.5 text-charcoal/70">{review.meta}</p>}
        {review.dateLabel && <p className="mt-0.5 text-charcoal/70">{review.dateLabel}</p>}

        {review.translation && (
          // Native disclosure: the original is in the HTML for search and
          // find-in-page, and opening it needs no JavaScript.
          <details className="group mt-3">
            <summary className="cursor-pointer list-none text-charcoal/70 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-sand">
              {review.translation.label} ·{" "}
              <span className="underline underline-offset-4 decoration-charcoal/30 group-open:no-underline">{s.showOriginal}</span>
            </summary>
            <OriginalText text={review.translation.original} lang={review.translation.language} />
          </details>
        )}

        <a
          href={review.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block rounded-sm font-medium text-accent-text underline underline-offset-4 decoration-accent-text/40 transition-colors duration-300 hover:text-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
        >
          {fill(s.readOn, { platform: review.platformName })}
          <span aria-hidden="true"> ↗</span>
          <span className="sr-only"> ({tl.reviews.opensInNewTab})</span>
        </a>
      </footer>
    </article>
  );
}

/**
 * The review wall on /reviews: every hand-copied review, filterable by
 * platform. All cards are in the static HTML; the filter only hides some.
 */
export function ReviewWall({ copy, reviews }: ReviewWallProps) {
  const { t, tl } = useLanguage();
  const s = tl.guestReviews;
  const [filter, setFilter] = useState<Filter>("all");

  const platforms = PLATFORM_ORDER.filter((p) => reviews.some((r) => r.platform === p));
  const tabs: Filter[] = ["all", ...platforms];
  const count = (f: Filter) => (f === "all" ? reviews.length : reviews.filter((r) => r.platform === f).length);
  const shown = filter === "all" ? reviews : reviews.filter((r) => r.platform === filter);
  const nameOf = (f: Filter) => (f === "all" ? s.all : reviews.find((r) => r.platform === f)!.platformName);

  return (
    <section id="reviews" className="py-24 md:py-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading label={t(copy.label)} heading={t(copy.heading)} subtext={t(copy.subtext)} />

        {tabs.length > 2 && (
          <div role="group" aria-label={s.filterAria} className="mb-10 md:mb-14 flex flex-wrap justify-center gap-2 md:gap-3">
            {tabs.map((tab) => {
              const active = tab === filter;
              return (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    "font-sans font-medium text-sm tracking-wide px-4 py-2 rounded-full border transition-colors duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
                    active
                      // charcoal on the teal fill (7.21:1), as on the gallery's pills.
                      ? "bg-brand-teal border-brand-teal text-charcoal"
                      : "bg-transparent border-charcoal/15 text-charcoal/70 hover:border-brand-teal hover:text-accent-text"
                  )}
                >
                  {nameOf(tab)} <span className="opacity-70">· {count(tab)}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* CSS columns: cards keep their natural height, so a two-line review
            does not leave a hole beside a long one. */}
        <div className="columns-1 md:columns-2 xl:columns-3 gap-6">
          {shown.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <p className="mt-10 md:mt-14 max-w-2xl mx-auto text-center font-sans text-sm leading-relaxed text-charcoal/70 text-pretty">
          {t(copy.note)}
        </p>
      </div>
    </section>
  );
}
