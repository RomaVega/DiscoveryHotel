// Server Component: the text is resolved and the WhatsApp link built at build time.
import { SecondaryButton } from "@/components/common/SecondaryButton";
import type { BlogStrings } from "@/lib/blog";
import { offerEnquiryText } from "@/lib/offers";
import type { Locale, LocalizedString, Offer } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface ArticleOfferProps {
  offer: Offer;
  locale: Locale;
  strings: BlogStrings;
}

/** A punched hole, as on a race bib: the sand page showing through the card. */
function PinHole({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute size-3 rounded-full bg-sand shadow-[inset_0_1px_2px_rgb(0_0_0/0.3)] ${className}`} />;
}

/**
 * A blog post's offer, placed by `[[offer]]` in the Markdown.
 *
 * It is the same offer as the card on /offers — same content entry, same
 * WhatsApp text for reception — so terms are written once in content/home.json
 * and a post can never advertise a rate the card has since changed. The block
 * sits inside the prose rather than as a banner: the post leads with the guide,
 * and the offer reads as the next step for someone who has decided to come.
 *
 * Drawn as a race bib, because the code is the one thing a reader has to carry
 * away: it is set as the bib number, with slashed zeros so nobody types an O.
 * Below the perforation, the tear-off holds the details and the button.
 */
export function ArticleOffer({ offer, locale, strings }: ArticleOfferProps) {
  const t = (v: LocalizedString) => (typeof v === "string" ? v : v[locale]);
  const href = buildWhatsAppUrl(offerEnquiryText(offer, t, strings.offers));

  return (
    <aside aria-labelledby="article-offer-title" className="relative my-14 rounded-lg bg-ivory shadow-[0_1px_2px_rgb(42_31_23/0.08),0_12px_32px_-12px_rgb(42_31_23/0.28)]">
      <div className="relative px-6 pb-8 pt-0 md:px-10">
        <PinHole className="left-3 top-3.5" />
        <PinHole className="right-3 top-3.5" />
        <PinHole className="bottom-3 left-3" />
        <PinHole className="bottom-3 right-3" />

        {/* The bib's coloured header: white on deep-teal is 6.08:1. */}
        <p className="-mx-6 rounded-t-lg bg-deep-teal px-6 py-3 text-center font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white md:-mx-10">
          {offer.badge ? t(offer.badge) : strings.blog.offerLabel}
        </p>
        <h3 id="article-offer-title" className="mt-6 text-center font-sans text-lg font-semibold text-charcoal">
          {t(offer.title)}
        </h3>

        {offer.code && (
          <p className="mt-4 text-center">
            <span className="block font-sans text-xs font-medium uppercase tracking-widest text-charcoal/70">{strings.offers.codeLabel}</span>
            <span className="mt-1 block font-sans text-5xl font-semibold leading-none tracking-[0.04em] slashed-zero tabular-nums text-charcoal sm:text-6xl">
              {offer.code}
            </span>
          </p>
        )}

        <p className="mt-6 text-center font-sans text-lg font-semibold leading-tight text-accent-text">{t(offer.price)}</p>
        {offer.validity && <p className="mt-1 text-center font-sans text-sm text-charcoal/70">{t(offer.validity)}</p>}
      </div>

      {/* Perforation, with a notch bitten out of each edge. */}
      <div aria-hidden="true" className="relative mx-6 border-t-2 border-dashed border-charcoal/20 md:mx-10">
        <span className="absolute -left-9 -top-[11px] size-6 rounded-full bg-sand md:-left-[3.25rem]" />
        <span className="absolute -right-9 -top-[11px] size-6 rounded-full bg-sand md:-right-[3.25rem]" />
      </div>

      <div className="px-6 pb-6 pt-6 md:px-10 md:pb-8">
        <p className="text-base leading-relaxed text-charcoal">{t(offer.description)}</p>

        {offer.inclusions && offer.inclusions.length > 0 && (
          <>
            <p className="mt-5 font-sans text-sm font-semibold text-charcoal">{strings.offers.included}</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm leading-relaxed text-charcoal marker:text-deep-teal">
              {offer.inclusions.map((item, i) => <li key={i}>{t(item)}</li>)}
            </ul>
          </>
        )}

        <div data-hides-booking-bar className="mt-7 flex justify-center">
          <SecondaryButton
            href={href}
            external
            data-cta-location="blog_offer"
            aria-label={`${strings.offers.checkAvailability} — ${t(offer.title)}`}
          >
            {strings.offers.checkAvailability}
          </SecondaryButton>
        </div>

        {offer.terms && (
          <p className="mt-5 text-center font-sans text-xs leading-relaxed text-charcoal/70">{t(offer.terms)}</p>
        )}
      </div>
    </aside>
  );
}
