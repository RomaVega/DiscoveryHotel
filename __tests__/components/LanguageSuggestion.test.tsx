import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { LanguageSuggestion } from "@/components/layout/LanguageSuggestion";

const push = vi.fn();
let pathname = "/";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => pathname,
}));

const BANNER = "Версия на русском языке";

function setLanguages(langs: string[]) {
  Object.defineProperty(navigator, "languages", {
    configurable: true,
    get: () => langs,
  });
  Object.defineProperty(navigator, "language", {
    configurable: true,
    get: () => langs[0] ?? "en-US",
  });
}

/** Mount, then run past the appear delay. */
function mount() {
  render(<LanguageSuggestion />);
  act(() => {
    vi.advanceTimersByTime(2000);
  });
}

describe("LanguageSuggestion", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    push.mockClear();
    localStorage.clear();
    pathname = "/";
    setLanguages(["ru-RU", "en-US"]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("offers the Russian page to a Russian browser on an English route", () => {
    mount();
    expect(screen.getByLabelText(BANNER)).toBeInTheDocument();
  });

  it("stays hidden for a non-Russian browser", () => {
    setLanguages(["en-US"]);
    mount();
    expect(screen.queryByLabelText(BANNER)).not.toBeInTheDocument();
  });

  it("stays hidden on routes that are already Russian", () => {
    pathname = "/ru/rooms";
    mount();
    expect(screen.queryByLabelText(BANNER)).not.toBeInTheDocument();
  });

  it("stays hidden once a language preference exists", () => {
    localStorage.setItem("odh-lang", "en");
    mount();
    expect(screen.queryByLabelText(BANNER)).not.toBeInTheDocument();
  });

  it("stays hidden after the hint was dismissed", () => {
    localStorage.setItem("odh-lang-hint", "dismissed");
    mount();
    expect(screen.queryByLabelText(BANNER)).not.toBeInTheDocument();
  });

  it("stays hidden when the page has no translated counterpart", () => {
    pathname = "/experiences/excursions-not-translated";
    mount();
    expect(screen.queryByLabelText(BANNER)).not.toBeInTheDocument();
  });

  it("routes to the matching Russian page and records the choice", () => {
    pathname = "/rooms";
    mount();

    act(() => {
      screen.getByRole("button", { name: "Перейти На Русский" }).click();
    });

    expect(push).toHaveBeenCalledWith("/ru/rooms");
    expect(localStorage.getItem("odh-lang")).toBe("ru");
  });

  it("dismissing records the hint but not a language preference", () => {
    mount();

    act(() => {
      screen.getByRole("button", { name: "Закрыть" }).click();
    });

    expect(localStorage.getItem("odh-lang-hint")).toBe("dismissed");
    // A dismissal is weaker than picking EN in the selector — it must not make
    // the pre-paint redirect script bounce this visitor off /ru later.
    expect(localStorage.getItem("odh-lang")).toBeNull();
  });
});
