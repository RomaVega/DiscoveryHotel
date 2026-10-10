"use client"; // Uses useLanguage for UI strings

import { BadgePercent, CalendarDays, Gift, MessageCircle, Tag, Wallet, type LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { BOOKING_URL } from "@/lib/booking";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

/**
 * One icon per entry in `offers.bookDirect.perks`, in the same order. The perks
 * live in locales/*.json rather than content JSON because they are fixed
 * selling points, not editable offers — so reordering or adding a perk there
 * means updating this list too.
 *
 * Every perk here was confirmed by hotel management on 10 Oct 2026, and the
 * Google Ads copy repeats them. Do not add one the hotel has not confirmed: an
 * ad promise the landing page cannot back up is a policy problem, not just a
 * copy problem. Free cancellation was deliberately left out for that reason.
 */
const PERK_ICONS: LucideIcon[] = [BadgePercent, Wallet, CalendarDays, Tag, Gift, MessageCircle];

interface BookDirectPerksProps {
  /** `dark` sits on the deep-teal `BookingCta` band; `light` on sand or ivory. */
  tone?: "light" | "dark";
  className?: string;
}

export function BookDirectPerks({ tone = "light", className }: BookDirectPerksProps) {
  const { tl } = useLanguage();
  const dark = tone === "dark";

  return (
    <ul className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7 text-left", className)}>
      {tl.offers.bookDirect.perks.map((perk, i) => {
        const Icon = PERK_ICONS[i];
        return (
          <li key={perk.title} className="flex gap-4">
            {Icon && (
              <Icon
                size={22}
                strokeWidth={1.2}
                aria-hidden="true"
                className={cn("shrink-0 mt-0.5", dark ? "text-white" : "text-brand-teal")}
              />
            )}
            <div>
              <h3 className={cn("font-sans text-base font-semibold", dark ? "text-white" : "text-charcoal")}>
                {perk.title}
              </h3>
              <p className={cn("mt-1 text-sm leading-relaxed", dark ? "text-white/80" : "text-stone")}>
                {perk.desc}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** The standalone section for `/offers`: the perks under the offer cards, then a way to act on them. */
export function BookDirect() {
  const { tl } = useLanguage();

  return (
    <section id="book-direct" className="pt-12 md:pt-24 pb-12 md:pb-24 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        <FadeIn>
          {/* 400 on phones: at text-4xl the default 300 reads as a hairline on sand,
              the same reason CLAUDE.md asks for 500 at text-3xl. Desktop keeps 300. */}
          <SectionHeading heading={tl.offers.bookDirect.heading} headingClassName="font-normal md:font-light" />
          <BookDirectPerks />
          <div data-hides-booking-bar className="mt-10 md:mt-14 text-center">
            <SecondaryButton href={BOOKING_URL} external data-cta-location="book_direct">
              {tl.nav.bookNow}
            </SecondaryButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
