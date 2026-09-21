import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookNowButton } from "@/components/common/BookNowButton";
import { LanguageProvider } from "@/lib/language-context";
import { BOOKING_URL } from "@/lib/booking";

type TaggedWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

const w = window as TaggedWindow;

function mount(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe("BookNowButton tracking", () => {
  type GtagMock = ReturnType<typeof vi.fn<(...args: unknown[]) => void>>;
  let gtag: GtagMock;

  beforeEach(() => {
    gtag = vi.fn<(...args: unknown[]) => void>();
    w.gtag = gtag;
  });

  afterEach(() => {
    delete w.gtag;
    delete w.dataLayer;
  });

  it("reports a click from the persistent floating button", () => {
    mount(<BookNowButton location="floating" />);

    fireEvent.click(screen.getByRole("link"));

    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag.mock.calls[0][1]).toBe("book_now_click");
    expect(gtag.mock.calls[0][2]).toMatchObject({
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

    expect(gtag.mock.calls[0][2]).toMatchObject({ cta_destination: "whatsapp" });
  });

  it("still runs the call site's own onClick — the drawer closes on it", () => {
    const onClick = vi.fn();
    mount(<BookNowButton location="drawer" onClick={onClick} />);

    fireEvent.click(screen.getByRole("link"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledTimes(1);
  });

  it("leaves the href and target alone, so a failed hit cannot cost a booking", () => {
    mount(<BookNowButton location="navbar" />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", BOOKING_URL);
    expect(link).toHaveAttribute("target", "_blank");
  });
});
