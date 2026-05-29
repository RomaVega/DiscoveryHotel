import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { LanguageProvider, useLanguage, localizedPath } from "@/lib/language-context";
import type { ReactNode } from "react";

const enWrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);
const ruWrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider locale="ru">{children}</LanguageProvider>
);

describe("useLanguage()", () => {
  it("throws when used outside LanguageProvider", () => {
    expect(() => renderHook(() => useLanguage())).toThrow(
      "useLanguage must be used within LanguageProvider"
    );
  });

  it("defaults to 'en' locale", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: enWrapper });
    expect(result.current.locale).toBe("en");
  });

  it("uses 'ru' when provider locale is 'ru'", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: ruWrapper });
    expect(result.current.locale).toBe("ru");
  });
});

describe("t() — LocalizedString resolver", () => {
  it("returns a plain string as-is", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: enWrapper });
    expect(result.current.t("Hello")).toBe("Hello");
  });

  it("returns en value by default", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: enWrapper });
    expect(result.current.t({ en: "Hello", ru: "Привет" })).toBe("Hello");
  });

  it("returns ru value when provider locale is ru", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: ruWrapper });
    expect(result.current.t({ en: "Hello", ru: "Привет" })).toBe("Привет");
  });

  it("falls back to en when ru value is missing", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: ruWrapper });
    // @ts-expect-error — intentionally testing missing ru field
    expect(result.current.t({ en: "Fallback" })).toBe("Fallback");
  });
});

describe("localizedPath()", () => {
  it("swaps an EN path to its /ru/* equivalent", () => {
    expect(localizedPath("/rooms", "ru")).toBe("/ru/rooms");
  });

  it("swaps a /ru/* path back to its EN equivalent", () => {
    expect(localizedPath("/ru/rooms", "en")).toBe("/rooms");
  });

  it("maps EN home to RU home", () => {
    expect(localizedPath("/", "ru")).toBe("/ru");
  });

  it("maps RU home to EN home", () => {
    expect(localizedPath("/ru", "en")).toBe("/");
  });

  it("falls back to /ru when the RU page doesn't exist", () => {
    // /privacy has no /ru/privacy in the build
    expect(localizedPath("/privacy", "ru")).toBe("/ru");
  });

  it("returns the same path when target locale already matches", () => {
    expect(localizedPath("/ru/rooms", "ru")).toBe("/ru/rooms");
    expect(localizedPath("/rooms", "en")).toBe("/rooms");
  });
});
