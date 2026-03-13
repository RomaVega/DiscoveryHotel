"use client"; // Uses state, refs, and position calculation

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useLanguage, type Locale } from "@/lib/language-context";
import { cn } from "@/lib/utils";

const LANGUAGES: {
  code: Locale;
  native: string;
  flag: string;
  available: boolean;
}[] = [
  { code: "en", native: "English", flag: "🇬🇧", available: true },
  { code: "ru", native: "Русский", flag: "🇷🇺", available: true },
  { code: "es", native: "Español", flag: "🇪🇸", available: false },
  { code: "zh", native: "中文", flag: "🇨🇳", available: false },
];

interface LanguageSelectorProps {
  /** "light" = on dark background (over hero); "dark" = on light background (parchment navbar) */
  variant?: "light" | "dark";
}

export function LanguageSelector({ variant = "dark" }: LanguageSelectorProps) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  /** Recalculate dropdown anchor on each open */
  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setDropPos({
      top: r.bottom + 10,
      right: window.innerWidth - r.right,
    });
  }, []);

  const handleOpen = () => {
    updatePosition();
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleScroll = () => setOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  const triggerClass =
    variant === "light"
      ? "text-white/75 hover:text-white"
      : "text-charcoal/60 hover:text-charcoal";

  return (
    <>
      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={handleOpen}
        aria-label={`Language: ${current.native}`}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex items-center gap-1.5 font-sans text-[11px] font-medium tracking-[0.14em] uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2",
          triggerClass
        )}
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <motion.span
          className="flex items-center"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown size={11} strokeWidth={2.5} />
        </motion.span>
      </button>

      {/* Dropdown — rendered via fixed positioning to escape stacking context */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Select language"
            style={{ top: dropPos.top, right: dropPos.right }}
            className="fixed w-52 bg-ivory shadow-[0_12px_48px_rgba(0,0,0,0.14)] border border-charcoal/8 overflow-hidden z-[9999]"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {LANGUAGES.map((lang, i) => {
              const isActive = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  role="menuitem"
                  aria-disabled={!lang.available}
                  aria-current={isActive ? "true" : undefined}
                  tabIndex={!lang.available ? -1 : 0}
                  onClick={() => {
                    if (lang.available) {
                      setLocale(lang.code);
                      setOpen(false);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors duration-150",
                    i > 0 && "border-t border-charcoal/5",
                    lang.available ? "cursor-pointer hover:bg-sand" : "cursor-default",
                    isActive && "bg-sand/50"
                  )}
                >
                  <span className="text-lg leading-none shrink-0">{lang.flag}</span>

                  <span className="flex-1 min-w-0">
                    <span
                      className={cn(
                        "block font-serif text-sm",
                        lang.available ? "text-charcoal" : "text-charcoal/30"
                      )}
                    >
                      {lang.native}
                    </span>
                  </span>

                  {isActive ? (
                    <Check size={13} strokeWidth={2.5} className="text-brand-teal shrink-0" />
                  ) : !lang.available ? (
                    <span className="shrink-0 font-sans text-[9px] font-medium uppercase tracking-[0.12em] text-stone/45 bg-sand border border-charcoal/8 px-1.5 py-0.5">
                      Soon
                    </span>
                  ) : null}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
