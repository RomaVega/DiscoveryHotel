import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { Footer, offersMailto } from "@/components/layout/Footer";
import { LanguageProvider } from "@/lib/language-context";
import { getContactData } from "@/lib/content";
import { BOOKING_URL } from "@/lib/booking";
import type { Locale } from "@/lib/types";

type TaggedWindow = Window & { dataLayer?: unknown[] };
const w = window as TaggedWindow;

const contact = getContactData();

function mount(locale: Locale = "en", container?: HTMLElement) {
  return render(
    <LanguageProvider locale={locale}>
      <Footer contact={contact} />
    </LanguageProvider>,
    container ? { container } : undefined
  );
}

describe("Footer", () => {
  it("puts phone, WhatsApp and email first after the brand, as real links", () => {
    mount();
    const list = screen.getByRole("list", { name: "Contact" });
    const hrefs = within(list).getAllByRole("link").map((a) => a.getAttribute("href"));

    expect(hrefs[0]).toBe("tel:+6282236655582");
    expect(hrefs[1]).toMatch(/^https:\/\/wa\.me\/6282236655582\?text=/);
    expect(hrefs[2]).toBe("mailto:info@orlowsky.co.id");
    expect(within(list).getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("target", "_blank");
  });

  it("links Google Maps as text, with no embedded map", () => {
    mount();
    expect(screen.getByRole("link", { name: /Open in Google Maps/ })).toHaveAttribute(
      "href",
      contact.googleMapsUrl
    );
    expect(document.querySelector("footer iframe")).toBeNull();
  });

  it("lists pages and hotel products as words — no icons in the footer nav", () => {
    mount();
    const nav = screen.getByRole("navigation", { name: "Footer" });

    expect(nav.querySelectorAll("svg")).toHaveLength(0);
    expect(
      within(screen.getByRole("list", { name: "Explore" }))
        .getAllByRole("link")
        .map((a) => a.textContent)
    ).toEqual(["Rooms", "Dining", "Experiences", "Offers", "Gallery", "About"]);
    expect(
      within(screen.getByRole("list", { name: "On the grounds" }))
        .getAllByRole("link")
        .map((a) => a.getAttribute("href"))
    ).toEqual(["/spa", "/experiences/diving", "/experiences/events", "/experiences/excursions"]);
    expect(screen.queryByText(/Car & Bike Rental|Tours & Activities/)).toBeNull();
  });

  it("orders the social circles for guests and names each one", () => {
    mount();
    const links = within(screen.getByRole("list", { name: "Follow us" })).getAllByRole("link");

    expect(links.map((a) => a.getAttribute("aria-label"))).toEqual([
      "Orlowsky Discovery on Instagram",
      "Orlowsky Discovery on Facebook",
      "Orlowsky Discovery on YouTube",
      "Orlowsky Discovery on Telegram",
    ]);
    for (const a of links) {
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("drops a social profile that has no URL rather than showing an empty icon", () => {
    render(
      <LanguageProvider>
        <Footer contact={{ ...contact, socials: contact.socials.map((s) => (s.icon === "Youtube" ? { ...s, url: "" } : s)) }} />
      </LanguageProvider>
    );
    expect(screen.queryByRole("link", { name: /on YouTube/ })).toBeNull();
    expect(within(screen.getByRole("list", { name: "Follow us" })).getAllByRole("link")).toHaveLength(3);
  });

  it("keeps the brand name out of machine translation", () => {
    mount();
    expect(screen.getByText("Discovery Candidasa").closest("[translate='no']")).not.toBeNull();
  });

  it("keeps the legal bar as the floating buttons' scroll sentinel", () => {
    mount();
    const legal = document.getElementById("footer-legal");
    expect(legal).not.toBeNull();
    expect(within(legal!).getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy");
    expect(within(legal!).getByRole("link", { name: "Terms of Service" })).toHaveAttribute("href", "/terms");
  });

  it("renders Russian labels, localized links and the payment note on /ru", () => {
    mount("ru");
    expect(screen.getByRole("navigation", { name: "Навигация в подвале сайта" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Номера" })).toHaveAttribute("href", "/ru/rooms");
    expect(screen.getByText("Оплата в России")).toBeInTheDocument();
  });
});

describe("Footer Book a stay", () => {
  beforeEach(() => {
    w.dataLayer = [];
  });

  afterEach(() => {
    delete w.dataLayer;
  });

  it("goes to the same engine URL as the navbar's Book Now", () => {
    mount();
    const link = screen.getByRole("link", { name: /Book a stay/ });
    expect(link).toHaveAttribute("href", BOOKING_URL);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("pushes cta_location before a click listener that registered first, as GTM's can", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    let seen: unknown[] | null = null;
    container.addEventListener("click", () => {
      seen = [...(w.dataLayer ?? [])];
    });

    mount("en", container);
    fireEvent.click(screen.getByRole("link", { name: /Book a stay/ }));

    expect(seen).toHaveLength(1);
    expect(seen![0]).toMatchObject({
      event: "book_now_click",
      cta_location: "footer",
      cta_destination: "engine",
    });
    container.remove();
  });
});

describe("Footer offers form", () => {
  it("flags an incomplete address on the field instead of handing off", () => {
    mount();
    const input = screen.getByLabelText("Email address for the guest list");
    fireEvent.change(input, { target: { value: "guest@" } });
    fireEvent.click(screen.getByRole("button", { name: "Join" }));

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain("footer-offers-error");
    expect(screen.getByText(/Please enter a full email address/)).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("hands a valid address to the mail app and says so, without claiming it was saved", () => {
    // jsdom cannot follow the mailto navigation and reports it on console.error.
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    mount();
    fireEvent.change(screen.getByLabelText("Email address for the guest list"), {
      target: { value: "guest@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Join" }));

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/press Send to finish/);
    expect(status).not.toHaveTextContent(/subscribed|you're in|thank you/i);
    quiet.mockRestore();
  });

  it("builds the request for reception with the guest's address verbatim", () => {
    const href = offersMailto("info@orlowsky.co.id", "Offers list", "Please add {email}.", "a$&b@example.com");
    const url = new URL(href);

    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe("info@orlowsky.co.id");
    expect(url.searchParams.get("subject")).toBe("Offers list");
    expect(url.searchParams.get("body")).toBe("Please add a$&b@example.com.");
  });
});
