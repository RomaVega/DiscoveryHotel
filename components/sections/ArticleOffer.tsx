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

/**
 * A blog post's offer, placed by `[[offer]]` in the Markdown.
 *
 * It is the same offer as the card on /offers — same content entry, same
 * WhatsApp text for reception — so terms are written once in content/home.json
 * and a post can never advertise a rate the card has since changed. The block
 * sits inside the prose rather than as a banner: the post leads with the guide,
 * and the offer reads as the next step for someone who has decided to come.
 */
export function ArticleOffer({ offer, locale, strings }: ArticleOfferProps) {
  const t = (v: LocalizedString) => (typeof v === "string" ? v : v[locale]);
  const href = buildWhatsAppUrl(offerEnquiryText(offer, t, strings.offers));

  return (
    <aside
      aria-labelledby="article-offer-title"
      className="my-12 rounded-md border border-deep-teal/30 bg-ivory p-6 md:p-8"
    >
      <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-text">
        {offer.badge ? t(offer.badge) : strings.blog.offerLabel}
      </p>
      <h3 id="article-offer-title" className="mt-2 font-sans text-lg font-semibold text-charcoal">
        {t(offer.title)}
      </h3>
      <p className="mt-2 leading-relaxed text-charcoal">{t(offer.description)}</p>

      {offer.inclusions && offer.inclusions.length > 0 && (
        <>
          <p className="mt-5 font-sans text-sm font-semibold text-charcoal">{strings.offers.included}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-sm leading-relaxed text-charcoal marker:text-deep-teal">
            {offer.inclusions.map((item, i) => <li key={i}>{t(item)}</li>)}
          </ul>
        </>
      )}

      <div className="mt-6 flex flex-col gap-4 border-t border-charcoal/10 pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-sans text-lg font-semibold leading-none text-accent-text">{t(offer.price)}</p>
          {offer.validity && (
            <p className="mt-1.5 font-sans text-xs leading-snug text-charcoal/70">{t(offer.validity)}</p>
          )}
        </div>
        <div data-hides-booking-bar className="flex justify-center sm:block">
          <SecondaryButton
            href={href}
            external
            data-cta-location="blog_offer"
            aria-label={`${strings.offers.checkAvailability} — ${t(offer.title)}`}
          >
            {strings.offers.checkAvailability}
          </SecondaryButton>
        </div>
      </div>

      {offer.terms && (
        <p className="mt-4 font-sans text-xs leading-relaxed text-charcoal/70">{t(offer.terms)}</p>
      )}
    </aside>
  );
}
