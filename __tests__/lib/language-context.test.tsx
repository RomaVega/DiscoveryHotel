import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "@/lib/language-context";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe("useLanguage()", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("throws when used outside LanguageProvider", () => {
    expect(() => renderHook(() => useLanguage())).toThrow(
      "useLanguage must be used within LanguageProvider"
    );
  });

  it("defaults to 'en' locale", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.locale).toBe("en");
  });

  it("restores locale from localStorage on mount", () => {
    localStorage.setItem("odch-lang", "ru");
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.locale).toBe("ru");
  });

  it("ignores unsupported locale values in localStorage", () => {
    localStorage.setItem("odch-lang", "es");
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.locale).toBe("en");
  });

  it("setLocale updates locale", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => result.current.setLocale("ru"));
    expect(result.current.locale).toBe("ru");
  });

  it("setLocale persists supported locale to localStorage", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => result.current.setLocale("ru"));
    expect(localStorage.getItem("odch-lang")).toBe("ru");
  });

  it("setLocale does not persist unsupported locale", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => result.current.setLocale("es" as never));
    expect(localStorage.getItem("odch-lang")).toBeNull();
  });
});

describe("t() — LocalizedString resolver", () => {
  beforeEach(() => localStorage.clear());

  it("returns a plain string as-is", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.t("Hello")).toBe("Hello");
  });

  it("returns en value by default", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.t({ en: "Hello", ru: "Привет" })).toBe("Hello");
  });

  it("returns ru value when locale is ru", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => result.current.setLocale("ru"));
    expect(result.current.t({ en: "Hello", ru: "Привет" })).toBe("Привет");
  });

  it("falls back to en when ru value is missing", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => result.current.setLocale("ru"));
    // @ts-expect-error — intentionally testing missing ru field
    expect(result.current.t({ en: "Fallback" })).toBe("Fallback");
  });
});
