"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import type { Offer, OffersData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface SpecialOffersProps {
  data: OffersData;
  hideHeading?: boolean;
}

/**
 * Substitute `{key}` placeholders, never through a replacement *string*.
 *
 * `String.replace` reads `$&`, `` $` ``, `$'` and `$$` inside the replacement,
 * and every offer price here is a dollar amount — "from $65/night" goes into a
 * template as a literal `$6`, which is one authored `$&` away from a mangled
 * message that nobody would notice until a guest sent it. A replacer function
 * is handed the value verbatim.
 */
function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (out, [key, value]) => out.replace(`{${key}}`, () => value),
    template
  );
}

export function SpecialOffers({ data, hideHeading }: SpecialOffersProps) {
  const { t, tl } = useLanguage();
  const activeOffers = data.offers.filter((o) => o.active);

  /**
   * The offers go to WhatsApp, not to the engine.
   *
   * `secure.guestpro.net/odch` has no page per offer and is not getting one,
   * so "Check Availability" used to drop the guest into a blank room search
   * that knew nothing about the early-bird rate they had just read — and the
   * offer's own terms never reached anyone who could honour them.
   *
   * The prefilled text is written for the person answering the phone: it names
   * the offer, repeats the terms and the advertised rate *as the guest saw
   * them* (so a stale card on the site is visible in the thread rather than
   * argued about later), and leaves labelled blanks for the four things
   * reception has to ask for anyway. Optional `validity` and `terms` are
   * folded in when the content carries them, which is why `conditions` is one
   * substitution and not two more lines in every template.
   */
  const enquiryUrl = (offer: Offer) => {
    const conditions = [
      offer.validity && fill(tl.offers.enquiryValidity, { validity: t(offer.validity) }),
      offer.terms && fill(tl.offers.enquiryTerms, { terms: t(offer.terms) }),
    ]
      .filter(Boolean)
      .map((line) => `\n${line}`)
      .join("");

    return buildWhatsAppUrl(
      fill(tl.offers.enquiry, {
        title: t(offer.title),
        terms: t(offer.description),
        conditions,
        price: t(offer.price),
      })
    );
  };

  if (activeOffers.length === 0) return null;

  return (
    <section id="offers" className="pt-6 md:pt-32 pb-6 md:pb-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        {!hideHeading && (
          <FadeIn>
            <SectionHeading
              label={t(data.label)}
              heading={t(data.heading)}
            />
          </FadeIn>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {activeOffers.map((offer, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-sand shadow-md group h-full flex flex-col overflow-hidden rounded-md">
                <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={offer.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 md:p-8 flex flex-col flex-1">
                  <h3 className="font-sans text-lg font-normal text-charcoal">
                    {t(offer.title)}
                  </h3>
                  <p className="mt-2 text-stone leading-relaxed flex-1">
                    {t(offer.description)}
                  </p>
                  {/* Footer mirrors the spa treatment row: the price and the CTA
                      sit on one baseline instead of stacking, so the two things
                      a guest actually decides on are adjacent. flex-1 on the
                      description above pins this to the card bottom, which keeps
                      the footers aligned across a row of uneven descriptions.
                      Stacked below `sm` (button centred) exactly as SpaDetail
                      does — a long RU CTA label plus a price will not share a
                      360px row. */}
                  <div className="mt-6 pt-5 border-t border-charcoal/10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="font-sans text-lg font-semibold text-accent-text leading-none">
                        {t(offer.price)}
                      </p>
                      {offer.validity && (
                        <p className="mt-1.5 font-sans text-xs text-stone leading-snug">
                          {t(offer.validity)}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-center sm:block">
                      <SecondaryButton
                        href={enquiryUrl(offer)}
                        external
                        aria-label={`${tl.offers.checkAvailability} — ${t(offer.title)}`}
                      >
                        {tl.offers.checkAvailability}
                      </SecondaryButton>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
