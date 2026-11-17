"use client"; // Uses useLanguage for content translation

import { SecondaryButton } from "@/components/common/SecondaryButton";
import { useLanguage } from "@/lib/language-context";
import type { GuestReviewsPageData } from "@/lib/types";

interface ReviewInviteProps {
  data: GuestReviewsPageData["invite"];
}

/**
 * "Stayed with us?" — links past guests to the two platforms that take a
 * review from anyone. Booking.com and Agoda accept reviews only from their own
 * bookings and send the invitation themselves, so the note says so instead of
 * linking a page where the guest could not write one.
 */
export function ReviewInvite({ data }: ReviewInviteProps) {
  const { t } = useLanguage();

  return (
    <section className="py-24 md:py-32 bg-sand">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* 500 at this size on a light ground — 300 is a hairline (see Typography). */}
        <h2 className="font-serif font-medium text-4xl md:text-5xl text-charcoal text-balance">{t(data.heading)}</h2>
        <p className="mt-4 text-lg leading-relaxed text-charcoal/80 text-pretty">{t(data.subtext)}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {data.links.map((link) => (
            <SecondaryButton key={link.platform} href={link.url} external>
              {t(link.label)}
            </SecondaryButton>
          ))}
        </div>
        <p className="mt-6 font-sans text-sm text-charcoal/70">{t(data.note)}</p>
      </div>
    </section>
  );
}
