import { describe, it, expect } from "vitest";
import { offerEnquiryText } from "@/lib/offers";
import type { LocalizedString, Offer } from "@/lib/types";
import en from "@/locales/en.json";

const t = (v: LocalizedString) => (typeof v === "string" ? v : v.en);

const offer: Offer = {
  title: { en: "Runner Offer", ru: "" },
  description: { en: "10% off for race entrants", ru: "" },
  price: { en: "from $65/night", ru: "" },
  image: "/images/x.webp",
  imageAlt: "x",
  active: true,
  validity: { en: "Stays 10–14 December", ru: "" },
  terms: { en: "Show your bib at check-in", ru: "" },
};

describe("offerEnquiryText", () => {
  it("names the offer, repeats its terms and rate, and folds in the conditions", () => {
    const text = offerEnquiryText(offer, t, en.offers);
    expect(text).toContain("*Runner Offer*");
    expect(text).toContain("10% off for race entrants\nCondition: Stays 10–14 December\nFine print: Show your bib at check-in");
    expect(text).toContain("Rate shown on the site: from $65/night");
  });

  it("leaves the condition lines out when the offer has none", () => {
    const text = offerEnquiryText({ ...offer, validity: undefined, terms: undefined }, t, en.offers);
    expect(text).not.toContain("Condition:");
    expect(text).toContain("10% off for race entrants\nRate shown");
  });

  // `$&` in a String.replace replacement is "the matched text" — a price must
  // reach the guest exactly as written. See fill() in lib/utils.ts.
  it("keeps dollar signs literal", () => {
    const text = offerEnquiryText({ ...offer, price: { en: "$&65", ru: "" } }, t, en.offers);
    expect(text).toContain("Rate shown on the site: $&65");
  });
});
