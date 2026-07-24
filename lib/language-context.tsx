"use client"; // Client context — t() helper consumed by client components

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { LocalizedString, Locale } from "@/lib/types";
import enLocale from "@/locales/en.json";
import ruLocale from "@/locales/ru.json";
import { ALL_ROUTES } from "@/lib/image-manifest";

export type { Locale };

/** Map a path to its equivalent in another locale.
 * Falls back to that locale's home if the translated route doesn't exist
 * (e.g. /privacy → /ru/privacy not built → /ru). */
export function localizedPath(currentPath: string, target: Locale): string {
  const stripped = currentPath.replace(/^\/ru(?=\/|$)/, "") || "/";
  const candidate = target === "ru"
    ? (stripped === "/" ? "/ru" : `/ru${stripped}`)
    : stripped;
  return ALL_ROUTES.includes(candidate) ? candidate : (target === "ru" ? "/ru" : "/");
}

type LocaleData = typeof enLocale;

const LOCALE_FILES: Record<Locale, LocaleData> = {
  en: enLocale,
  ru: ruLocale,
};

interface LanguageContextType {
  locale: Locale;
  /** Resolve a LocalizedString to the current locale's string. */
  t: (val: LocalizedString) => string;
  /** Raw locale file for UI-only strings (nav, footer labels, etc.). */
  tl: LocaleData;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

/**
 * Locale is determined by route: `/ru/*` passes `locale="ru"`, every other
 * route gets the default `"en"`. There is no runtime swap and no localStorage —
 * the URL is the single source of truth, so SSR and client always agree (no
 * EN→RU flash) and search engines see the language they expect for each URL.
 */
export function LanguageProvider({
  children,
  locale = "en",
}: {
  children: ReactNode;
  locale?: Locale;
}) {
  const value = useMemo<LanguageContextType>(
    () => ({
      locale,
      t: (val) =>
        typeof val === "string"
          ? val
          : locale === "ru"
            ? (val.ru ?? val.en)
            : val.en,
      tl: LOCALE_FILES[locale],
    }),
    [locale]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
