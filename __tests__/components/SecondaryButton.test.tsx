import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { BOOKING_URL, MENU_URL } from "@/lib/booking";

type TaggedWindow = Window & {
  dataLayer?: unknown[];
};

const w = window as TaggedWindow;

/** beforeEach assigns it, but the assignment does not narrow at the use site. */
function layer(): unknown[] {
  return w.dataLayer ?? [];
}

describe("SecondaryButton tracking", () => {
  beforeEach(() => {
    w.dataLayer = [];
  });

  afterEach(() => {
    delete w.dataLayer;
  });

  it("pushes book_now_click for an external link with a surface name", () => {
    render(
      <SecondaryButton href={`${BOOKING_URL}/booking`} external data-cta-location="room_card">
        Check Availability
      </SecondaryButton>
    );

    fireEvent.click(screen.getByRole("link"));

    expect(w.dataLayer).toHaveLength(1);
    expect(layer()[0]).toMatchObject({
      event: "book_now_click",
      cta_location: "room_card",
      cta_destination: "engine",
    });
  });

  it("classifies the dining menu as menu, not engine", () => {
    render(
      <SecondaryButton href={MENU_URL} external data-cta-location="dining">
        View Menu
      </SecondaryButton>
    );

    fireEvent.click(screen.getByRole("link"));

    expect(layer()[0]).toMatchObject({ cta_location: "dining", cta_destination: "menu" });
  });

  it("reports an offer card's WhatsApp enquiry as whatsapp", () => {
    render(
      <SecondaryButton href="https://wa.me/6282236655582?text=Offer" external data-cta-location="offer_card">
        Check Availability
      </SecondaryButton>
    );

    fireEvent.click(screen.getByRole("link"));

    expect(layer()[0]).toMatchObject({ cta_location: "offer_card", cta_destination: "whatsapp" });
  });

  it("pushes nothing for a link without a surface name", () => {
    render(
      <SecondaryButton href={BOOKING_URL} external>
        Book
      </SecondaryButton>
    );

    fireEvent.click(screen.getByRole("link"));

    expect(w.dataLayer).toHaveLength(0);
  });

  it("pushes before a click listener that registered first, as GTM's can", () => {
    // GTM's Link Click listener and React's root listener share a node in
    // production (`document`), so bubble-phase order is registration order.
    // Registering a bubble listener on the root *before* React mounts
    // reproduces the case where GTM loaded first: with `onClick` this sees an
    // empty dataLayer and would report the previous push's cta_location.
    const container = document.createElement("div");
    document.body.appendChild(container);
    let seenAtLinkClick: unknown[] | null = null;
    container.addEventListener("click", () => {
      seenAtLinkClick = [...layer()];
    });

    render(
      <SecondaryButton href={BOOKING_URL} external data-cta-location="booking_band">
        Book Stay
      </SecondaryButton>,
      { container }
    );

    fireEvent.click(screen.getByRole("link"));

    expect(seenAtLinkClick).toHaveLength(1);
    expect(seenAtLinkClick![0]).toMatchObject({ cta_location: "booking_band" });
    container.remove();
  });
});
