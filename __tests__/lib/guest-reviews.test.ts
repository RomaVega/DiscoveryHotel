import { describe, it, expect } from "vitest";
import { getGuestReviewsPageData } from "@/lib/content";
import { formatScore, getGuestReviews, getReviewThemes } from "@/lib/guest-reviews";
import { guestReviewsPageSchema } from "@/lib/validation";
import guestReviewsJson from "@/content/guest-reviews.json";

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

describe("content/guest-reviews.json", () => {
  const data = getGuestReviewsPageData();

  it("parses and has reviews", () => {
    expect(data.reviews.length).toBeGreaterThan(0);
  });

  it("records when every review was copied, so a stale one can be found", () => {
    for (const r of data.reviews) expect(r.copiedOn, r.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("resolves in both locales — every platform has a listing URL, every country a translation", () => {
    expect(() => getGuestReviews("en")).not.toThrow();
    expect(() => getGuestReviews("ru")).not.toThrow();
  });

  it("shows the guest's own words, unlabelled, on the page in the guest's language", () => {
    for (const locale of ["en", "ru"] as const) {
      const byId = new Map(getGuestReviews(locale).map((r) => [r.id, r]));
      for (const r of data.reviews) {
        const shown = byId.get(r.id)!;
        if (r.language === locale) {
          expect(shown.translation, r.id).toBeNull();
          expect(shown.passages).toEqual(r.text[locale]!.passages);
        } else {
          // Any other language is ours, and says so, with the original one click away.
          expect(shown.translation?.original, r.id).toEqual(r.text[r.language]);
          expect(shown.translation?.language).toBe(r.language);
        }
      }
    }
  });

  it("gives every theme a quote, attributed, in both locales", () => {
    for (const locale of ["en", "ru"] as const) {
      const themes = getReviewThemes(locale);
      expect(themes).toHaveLength(data.themes.items.length);
      for (const t of themes) {
        expect(t.quote.length).toBeGreaterThan(0);
        expect(t.author.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("guestReviewsPageSchema", () => {
  it("refuses a theme quote that is not in its review", () => {
    const bad = clone(guestReviewsJson);
    bad.themes.items[0].quote.en = "Words no guest wrote.";
    expect(() => guestReviewsPageSchema.parse(bad)).toThrow(/theme quote \(en\)/);
  });

  it("refuses a review with no Russian version", () => {
    const bad = clone(guestReviewsJson) as { reviews: { text: Record<string, unknown> }[] };
    const r = bad.reviews.find((x) => "ru" in x.text && Object.keys(x.text).length === 2)!;
    delete r.text.ru;
    expect(() => guestReviewsPageSchema.parse(bad)).toThrow(/text needs the original/);
  });

  it("refuses a translation that drops a passage", () => {
    const bad = clone(guestReviewsJson) as { reviews: { language: string; text: Record<string, { passages: string[] }> }[] };
    const r = bad.reviews.find((x) => x.text[x.language].passages.length > 1)!;
    const other = r.language === "en" ? "ru" : "en";
    r.text[other].passages = r.text[other].passages.slice(0, 1);
    expect(() => guestReviewsPageSchema.parse(bad)).toThrow(/same title\/passages\/disliked shape/);
  });

  it("refuses a score above its scale", () => {
    const bad = clone(guestReviewsJson);
    bad.reviews[0].score = 11;
    expect(() => guestReviewsPageSchema.parse(bad)).toThrow(/cannot exceed/);
  });
});

describe("formatScore", () => {
  it("writes scores the way each platform does", () => {
    expect(formatScore(10, 10)).toBe("10");
    expect(formatScore(9, 10)).toBe("9.0");
    expect(formatScore(9.6, 10)).toBe("9.6");
    expect(formatScore(5, 5)).toBe("5");
    expect(formatScore(4.5, 5)).toBe("4.5");
  });
});
