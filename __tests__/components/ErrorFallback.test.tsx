import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorFallback, localeFromPath } from "@/components/layout/ErrorFallback";

function setPath(pathname: string) {
  window.history.replaceState({}, "", pathname);
}

describe("ErrorFallback", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    setPath("/");
  });

  it("renders English copy with a reachable contact route", () => {
    render(<ErrorFallback locale="en" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "This page didn't load properly"
    );
    expect(
      screen.getByRole("link", { name: /Chat on WhatsApp/i })
    ).toHaveAttribute("href", expect.stringContaining("https://wa.me/"));
    expect(screen.getByRole("link", { name: /Call the Hotel/i })).toHaveAttribute(
      "href",
      expect.stringMatching(/^tel:\+\d+$/)
    );
  });

  it("renders Russian copy on the ru locale", () => {
    render(<ErrorFallback locale="ru" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Страница не загрузилась"
    );
    expect(
      screen.getByRole("button", { name: "Перезагрузить Страницу" })
    ).toBeInTheDocument();
  });

  it("hard-reloads rather than re-rendering into the broken DOM", () => {
    const reload = vi.fn();
    const original = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...original, reload },
    });

    render(<ErrorFallback locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: "Reload Page" }));

    expect(reload).toHaveBeenCalledOnce();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: original,
    });
  });

  describe("localeFromPath", () => {
    it.each([
      ["/", "en"],
      ["/rooms", "en"],
      ["/rush", "en"], // must not match on a bare "/ru" prefix
      ["/ru", "ru"],
      ["/ru/rooms", "ru"],
    ])("maps %s to %s", (path, expected) => {
      setPath(path);
      expect(localeFromPath()).toBe(expected);
    });
  });
});
