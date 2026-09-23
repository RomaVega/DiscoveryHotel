import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookNowButton } from "@/components/common/BookNowButton";
import { LanguageProvider } from "@/lib/language-context";
import { BOOKING_URL } from "@/lib/booking";

type TaggedWindow = Window & {
  dataLayer?: unknown[];
};

const w = window as TaggedWindow;

/** beforeEach assigns it, but the assignment does not narrow at the use site. */
function layer(): unknown[] {
  return w.dataLayer ?? [];
}

function mount(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe("BookNowButton tracking", () => {
  beforeEach(() => {
    w.dataLayer = [];
  });

  afterEach(() => {
    delete w.dataLayer;
  });

  it("reports a click from the persistent floating button", () => {
    mount(<BookNowButton location="floating" />);

    fireEvent.click(screen.getByRole("link"));

    expect(w.dataLayer).toHaveLength(1);
    expect(layer()[0]).toMatchObject({
      event: "book_now_click",
      cta_location: "floating",
      cta_destination: "engine",
    });
  });

  it("classifies the service enquiry the floating button carries off-engine routes", () => {
    mount(
      <BookNowButton
        location="floating"
        label="Book a Treatment"
        href="https://wa.me/6282236655582?text=Spa"
      />
    );

    fireEvent.click(screen.getByRole("link"));

    expect(layer()[0]).toMatchObject({ cta_destination: "whatsapp" });
  });

  it("still runs the call site's own onClick — the drawer closes on it", () => {
    const onClick = vi.fn();
    mount(<BookNowButton location="drawer" onClick={onClick} />);

    fireEvent.click(screen.getByRole("link"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(w.dataLayer).toHaveLength(1);
  });

  it("leaves the href and target alone, so a failed hit cannot cost a booking", () => {
    mount(<BookNowButton location="navbar" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", BOOKING_URL);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("carries the surface as a data attribute, for GTM's own click trigger", () => {
    // The GTM Link Click trigger on hostname secure.guestpro.net catches every
    // booking CTA, including the ones that live in content JSON and never
    // render this component. This attribute is how that trigger learns which
    // surface it fired on where one is known.
    mount(<BookNowButton location="hero" />);

    expect(screen.getByRole("link")).toHaveAttribute("data-cta-location", "hero");
  });
});
