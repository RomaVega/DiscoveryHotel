"use client"; // Client context for language state

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { LocalizedString } from "@/lib/types";
import enLocale from "@/locales/en.json";
import ruLocale from "@/locales/ru.json";

export type Locale = "en" | "ru" | "id" | "zh";

type LocaleData = typeof enLocale;

/** Locales with actual translation files */
const LOCALE_FILES: Record<string, LocaleData> = {
  en: enLocale,
  ru: ruLocale,
};

function isSupportedLocale(val: unknown): val is "en" | "ru" {
  return val === "en" || val === "ru";
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Resolve a LocalizedString to the current locale's string */
  t: (val: LocalizedString) => string;
  /** Raw locale file for UI-only strings (nav, footer labels, etc.) */
  tl: LocaleData;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("odch-lang");
      if (isSupportedLocale(stored)) {
        setLocaleState(stored);
      } else {
        // No saved preference — detect from browser/system language
        const lang = navigator.languages?.[0] ?? navigator.language ?? "";
        if (lang.toLowerCase().startsWith("ru")) setLocaleState("ru");
      }
    } catch {
      // localStorage unavailable (SSR safety)
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "ru" ? "ru" : "en";
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    if (isSupportedLocale(newLocale)) {
      try {
        localStorage.setItem("odch-lang", newLocale);
      } catch {
        // ignore
      }
    }
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (val: LocalizedString): string => {
      if (typeof val === "string") return val;
      if (locale === "ru") return val.ru ?? val.en;
      return val.en;
    },
    [locale]
  );

  const tl = useMemo(
    () => LOCALE_FILES[locale] ?? LOCALE_FILES.en,
    [locale]
  );

  const contextValue = useMemo(
    () => ({ locale, setLocale, t, tl }),
    [locale, setLocale, t, tl]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
