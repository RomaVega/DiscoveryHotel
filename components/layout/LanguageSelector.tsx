"use client"; // Uses state, refs, and position calculation

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useLanguage, type Locale } from "@/lib/language-context";
import { cn } from "@/lib/utils";

const LANGUAGES: {
  code: Locale;
  label: string;
  native: string;
  available: boolean;
}[] = [
  { code: "en", label: "EN", native: "English", available: true },
  { code: "ru", label: "RU", native: "Русский", available: true },
  { code: "id", label: "ID", native: "Indonesia", available: false },
  { code: "zh", label: "中文", native: "中文", available: false },
];

interface LanguageSelectorProps {
  /** "light" = on dark background (over hero); "dark" = on light background (parchment navbar) */
  variant?: "light" | "dark";
}

export function LanguageSelector({ variant = "dark" }: LanguageSelectorProps) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState<{ top?: number; bottom?: number; right: number }>({ right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  /** Recalculate dropdown anchor on each open — opens upward if near bottom */
  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dropHeight = 180; // approx height of dropdown
    const spaceBelow = window.innerHeight - r.bottom;
    if (spaceBelow < dropHeight + 16) {
      setDropPos({ bottom: window.innerHeight - r.top + 10, right: window.innerWidth - r.right });
    } else {
      setDropPos({ top: r.bottom + 10, right: window.innerWidth - r.right });
    }
  }, []);

  const handleOpen = () => {
    updatePosition();
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
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

  const isLight = variant === "light";

  return (
    <>
      {/* Trigger — compact pill with globe icon */}
      <button
        ref={triggerRef}
        onClick={handleOpen}
        aria-label={`Language: ${current.native}`}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "group relative flex items-center gap-1 py-1 px-2 md:py-1.5 md:px-3 rounded-full transition-all duration-200",
          "font-sans text-[10px] md:text-[11px] font-semibold tracking-[0.16em] uppercase",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2",
          isLight
            ? "text-white/80 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/35"
            : "text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 border border-charcoal/15 hover:border-charcoal/25"
        )}
      >
        <Globe
          size={13}
          strokeWidth={1.8}
          className="hidden md:block opacity-70 group-hover:opacity-100 transition-opacity duration-200"
        />
        <span>{current.label}</span>
        <motion.svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          className="opacity-50 group-hover:opacity-70 transition-opacity"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <path
            d="M1.5 3L4 5.5L6.5 3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      {/* Dropdown — fixed positioning to escape stacking context */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={dropdownRef}
            role="menu"
            aria-label="Select language"
            style={{ top: dropPos.top, bottom: dropPos.bottom, right: dropPos.right }}
            className="fixed w-48 bg-ivory rounded-sm shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-charcoal/8 overflow-hidden z-[9999]"
            initial={{ opacity: 0, y: dropPos.bottom ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropPos.bottom ? 6 : -6, scale: 0.98 }}
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
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150",
                    i > 0 && "border-t border-charcoal/5",
                    lang.available
                      ? "cursor-pointer hover:bg-sand/70"
                      : "cursor-default",
                    isActive && "bg-sand/40"
                  )}
                >
                  {/* Language code badge */}
                  <span
                    className={cn(
                      "shrink-0 w-7 text-center font-sans text-[10px] font-bold tracking-[0.08em] uppercase",
                      isActive
                        ? "text-brand-teal"
                        : lang.available
                          ? "text-charcoal/40"
                          : "text-charcoal/20"
                    )}
                  >
                    {lang.label}
                  </span>

                  {/* Native name */}
                  <span className="flex-1 min-w-0">
                    <span
                      className={cn(
                        "block font-serif text-[13px]",
                        isActive
                          ? "text-charcoal"
                          : lang.available
                            ? "text-charcoal/70"
                            : "text-charcoal/25"
                      )}
                    >
                      {lang.native}
                    </span>
                  </span>

                  {/* Status indicator */}
                  {isActive ? (
                    <Check
                      size={12}
                      strokeWidth={2.5}
                      className="text-brand-teal shrink-0"
                    />
                  ) : !lang.available ? (
                    <span className="shrink-0 font-sans text-[8px] font-semibold uppercase tracking-[0.14em] text-stone/40 border border-charcoal/8 rounded-sm px-1.5 py-0.5">
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
