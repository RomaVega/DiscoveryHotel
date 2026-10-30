import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { RoomsDetail } from "@/components/sections/RoomsDetail";
import { DiningDetail } from "@/components/sections/DiningDetail";
import { LanguageProvider } from "@/lib/language-context";
import { getContactData, getDiningPageData, getRoomsPageData } from "@/lib/content";
import type { Locale } from "@/lib/types";

/**
 * GTM's `booking_engine_click` fires on any link to secure.guestpro.net and
 * reads `cta_location` from the latest `book_now_click` push. A GuestPro link
 * on an inner page that pushes nothing is therefore reported under whichever
 * button was clicked before it. These pin that every engine link on /rooms and
 * /dining pushes its own surface.
 */

type TaggedWindow = Window & { dataLayer?: unknown[] };
const w = window as TaggedWindow;

function engineLinks(container: HTMLElement): HTMLAnchorElement[] {
  return Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="https://secure.guestpro.net"]'));
}

function lastPush(): Record<string, unknown> {
  const layer = w.dataLayer ?? [];
  return layer[layer.length - 1] as Record<string, unknown>;
}

describe.each<Locale>(["en", "ru"])("inner-page engine links (%s)", (locale) => {
  beforeEach(() => {
    w.dataLayer = [];
  });

  afterEach(() => {
    delete w.dataLayer;
  });

  it("tags every room button on /rooms as rooms_page", () => {
    const { container } = render(
      <LanguageProvider locale={locale}>
        <RoomsDetail data={getRoomsPageData()} />
      </LanguageProvider>
    );
    const links = engineLinks(container);

    // Two rooms, each with a desktop and a mobile button.
    expect(links.length).toBeGreaterThanOrEqual(4);
    for (const link of links) {
      fireEvent.click(link);
      expect(lastPush()).toMatchObject({
        event: "book_now_click",
        cta_location: "rooms_page",
        cta_destination: "engine",
      });
    }
    expect(w.dataLayer).toHaveLength(links.length);
  });

  it("tags both dining menu buttons as dining_page", () => {
    const { container } = render(
      <LanguageProvider locale={locale}>
        <DiningDetail data={getDiningPageData()} contact={getContactData()} />
      </LanguageProvider>
    );
    const links = engineLinks(container);

    // "View Menu" under the intro and "Order Delivery" on the delivery feature.
    expect(links).toHaveLength(2);
    for (const link of links) {
      fireEvent.click(link);
      expect(lastPush()).toMatchObject({
        event: "book_now_click",
        cta_location: "dining_page",
        cta_destination: "menu",
      });
    }
    expect(w.dataLayer).toHaveLength(links.length);
  });
});
