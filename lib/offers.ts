import type { LocalizedString, Offer } from "./types";
import { fill } from "./utils";

/** The `offers.*` strings from locales/*.json that the enquiry uses. */
export interface OfferEnquiryStrings {
  enquiry: string;
  enquiryValidity: string;
  enquiryTerms: string;
}

/**
 * The WhatsApp text an offer's CTA prefills, written for reception.
 *
 * Shared by the offer cards (`SpecialOffers`) and a blog post's offer block
 * (`ArticleOffer`), so a guest who arrives from a post sends the same message —
 * offer name, terms and the rate as shown — as one who tapped the card. See
 * "The offer cards are the exception on a room route" in CLAUDE.md for why it
 * is WhatsApp and not the engine, and why substitution goes through `fill()`.
 */
export function offerEnquiryText(
  offer: Offer,
  resolve: (value: LocalizedString) => string,
  strings: OfferEnquiryStrings,
): string {
  const conditions = [
    offer.validity && fill(strings.enquiryValidity, { validity: resolve(offer.validity) }),
    offer.terms && fill(strings.enquiryTerms, { terms: resolve(offer.terms) }),
  ]
    .filter(Boolean)
    .map((line) => `\n${line}`)
    .join("");

  return fill(strings.enquiry, {
    title: resolve(offer.title),
    terms: resolve(offer.description),
    conditions,
    price: resolve(offer.price),
  });
}
