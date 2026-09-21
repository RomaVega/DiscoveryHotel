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

  it("sends nothing and creates no queue when the build carries no tag", () => {
    trackEvent("book_now_click", { cta_location: "floating" });

    expect(w.dataLayer).toBeUndefined();
  });

  it("sends through gtag when GA4 is present", () => {
    const gtag = vi.fn();
    w.gtag = gtag;
    document.documentElement.lang = "ru";

    trackEvent("book_now_click", { cta_location: "floating" });

    expect(gtag).toHaveBeenCalledTimes(1);
    const [command, name, params] = gtag.mock.calls[0];
    expect(command).toBe("event");
    expect(name).toBe("book_now_click");
    expect(params).toMatchObject({
      cta_location: "floating",
      page_path: window.location.pathname,
      page_locale: "ru",
    });
  });

  it("falls back to a dataLayer push on a GTM-only build", () => {
    w.dataLayer = [];

    trackEvent("book_now_click", { cta_location: "navbar" });

    expect(w.dataLayer).toHaveLength(1);
    expect(w.dataLayer[0]).toMatchObject({
      event: "book_now_click",
      cta_location: "navbar",
    });
  });

  it("prefers gtag over dataLayer so a click is never counted twice", () => {
    const gtag = vi.fn();
    w.gtag = gtag;
    w.dataLayer = [];

    trackEvent("book_now_click", {});

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(w.dataLayer).toHaveLength(0);
  });

  it("swallows a throwing tag rather than breaking the click", () => {
    w.gtag = () => {
      throw new Error("gtag blew up");
    };

    expect(() => trackEvent("book_now_click", {})).not.toThrow();
  });
});

describe("trackBookNowClick", () => {
  beforeEach(clearTags);
  afterEach(clearTags);

  it("names the surface and classifies the destination", () => {
    const gtag = vi.fn();
    w.gtag = gtag;

    trackBookNowClick("floating", "https://wa.me/6282236655582?text=Spa");

    expect(gtag.mock.calls[0][1]).toBe("book_now_click");
    expect(gtag.mock.calls[0][2]).toMatchObject({
      cta_location: "floating",
      cta_destination: "whatsapp",
    });
  });
});
