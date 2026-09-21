import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { trackEvent, trackBookNowClick, classifyDestination } from "@/lib/track";
import { BOOKING_URL, MENU_URL } from "@/lib/booking";

type TaggedWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

const w = window as TaggedWindow;

function clearTags() {
  delete w.gtag;
  delete w.dataLayer;
}

describe("classifyDestination", () => {
  it("reads the room engine", () => {
    expect(classifyDestination(BOOKING_URL)).toBe("engine");
  });

  it("reads the dining menu, which lives under the engine's URL", () => {
    // The regression this ordering exists for: MENU_URL starts with BOOKING_URL.
    expect(MENU_URL.startsWith(BOOKING_URL)).toBe(true);
    expect(classifyDestination(MENU_URL)).toBe("menu");
  });

  it("reads a service enquiry", () => {
    expect(classifyDestination("https://wa.me/6282236655582?text=Hello")).toBe("whatsapp");
  });

  it("falls back to other for anything unrecognised", () => {
    expect(classifyDestination("https://example.com/")).toBe("other");
  });
});

describe("trackEvent", () => {
  beforeEach(clearTags);
  afterEach(() => {
    clearTags();
    document.documentElement.lang = "";
  });

  it("sends nothing and creates no queue when the build carries no container", () => {
    trackEvent("book_now_click", { cta_location: "floating" });

    expect(w.dataLayer).toBeUndefined();
  });

  it("pushes a GTM-shaped event with the page context filled in", () => {
    w.dataLayer = [];
    document.documentElement.lang = "ru";

    trackEvent("book_now_click", { cta_location: "floating" });

    expect(w.dataLayer).toHaveLength(1);
    expect(w.dataLayer[0]).toMatchObject({
      event: "book_now_click",
      cta_location: "floating",
      page_path: window.location.pathname,
      page_locale: "ru",
    });
  });

  it("still uses dataLayer when gtag exists, so GTM triggers always match", () => {
    // GTM loads gtag.js on behalf of the container's Google tag, so gtag is
    // present in production. Calling it would push an `arguments` object that
    // no Custom Event trigger matches — and the Ads conversion tag would never
    // fire. See the note in lib/track.ts.
    const gtag = vi.fn();
    w.gtag = gtag;
    w.dataLayer = [];

    trackEvent("book_now_click", {});

    expect(gtag).not.toHaveBeenCalled();
    expect(w.dataLayer).toHaveLength(1);
  });

  it("swallows a throwing dataLayer rather than breaking the click", () => {
    w.dataLayer = [];
    w.dataLayer.push = () => {
      throw new Error("dataLayer blew up");
    };

    expect(() => trackEvent("book_now_click", {})).not.toThrow();
  });
});

describe("trackBookNowClick", () => {
  beforeEach(clearTags);
  afterEach(clearTags);

  it("names the surface and classifies the destination", () => {
    w.dataLayer = [];

    trackBookNowClick("floating", "https://wa.me/6282236655582?text=Spa");

    expect(w.dataLayer[0]).toMatchObject({
      event: "book_now_click",
      cta_location: "floating",
      cta_destination: "whatsapp",
    });
  });
});
