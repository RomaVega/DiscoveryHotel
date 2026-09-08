"use client"; // Client context — t() helper consumed by client components

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import type { LocalizedString, Locale } from "@/lib/types";
import enLocale from "@/locales/en.json";
import ruLocale from "@/locales/ru.json";
import { ALL_ROUTES } from "@/lib/image-manifest";

export type { Locale };

/** Map a path to its equivalent in another locale.
 * Falls back to that locale's home if the translated route doesn't exist
 * (an EN-only page added later → /ru). Every route has a twin as of Sep 2026. */
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
 *
 * The effect below is the one piece of DOM this touches. `output: "export"`
 * gives every route the root layout's <html lang="en">, so the served Russian
 * pages are corrected at build time by scripts/fix-ru-lang.js — but a language
 * switch goes through router.push() without a document load, and the attribute
 * would otherwise keep the old locale for the rest of the session. That matters
 * because the browser reads it when deciding whether to offer to translate.
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

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
