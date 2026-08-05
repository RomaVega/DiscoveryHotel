"use client"; // Reads navigator.language and localStorage

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { Globe, X } from "lucide-react";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { ALL_ROUTES } from "@/lib/image-manifest";

/**
 * Offers the Russian version of the current page to visitors whose browser is
 * set to Russian and who landed on an English URL.
 *
 * Why a suggestion and not a redirect: an auto-redirect surprises anyone who
 * wants the English page and muddies what crawlers see. But leaving a Russian
 * speaker on an English page invites the browser's own "translate this page",
 * and Chrome/Edge translation rewrites text nodes into <font> wrappers under
 * React's feet — which can crash hydration outright. Landing them on /ru means
 * the browser never offers to translate in the first place.
 *
 * Only shown when a real translated counterpart exists; never on /ru routes,
 * and never once the visitor has expressed a preference either way.
 */

const PREF_KEY = "odh-lang"; // set by LanguageSelector; "en" | "ru"
const HINT_KEY = "odh-lang-hint"; // "dismissed" — separate so dismissing the
// hint never bounces the visitor off /ru the way a stored "en" preference does

const APPEAR_DELAY_MS = 1500; // let the hero settle before interrupting

function ruCounterpart(pathname: string): string | null {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/ru" || path.startsWith("/ru/")) return null;
  const target = path === "/" ? "/ru" : `/ru${path}`;
  return ALL_ROUTES.includes(target) ? target : null;
}

function prefersRussian(): boolean {
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  return langs.some((l) => l?.toLowerCase().startsWith("ru"));
}

export function LanguageSuggestion() {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const target = ruCounterpart(pathname);

  useEffect(() => {
    if (!target) return;
    try {
      if (localStorage.getItem(PREF_KEY)) return;
      if (localStorage.getItem(HINT_KEY) === "dismissed") return;
    } catch {
      return; // storage blocked — stay quiet rather than nag every page view
    }
    if (!prefersRussian()) return;

    const timer = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, [target]);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(HINT_KEY, "dismissed");
    } catch {
      /* ignore */
    }
  }, []);

  const accept = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(PREF_KEY, "ru");
    } catch {
      /* ignore */
    }
    if (target) router.push(target);
  }, [router, target]);

  return (
    <AnimatePresence>
      {visible && (
        <m.aside
          aria-label="Версия на русском языке"
          className="fixed bottom-6 left-6 right-6 z-50 md:right-auto md:max-w-sm bg-ivory rounded-sm border border-charcoal/10 shadow-[0_8px_40px_rgba(0,0,0,0.14)] p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Закрыть"
            className="absolute top-3 right-3 p-1 rounded-full text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
          >
            <X size={14} strokeWidth={2} />
          </button>

          <div className="flex items-start gap-3 pr-6">
            <Globe
              size={18}
              strokeWidth={1.6}
              className="shrink-0 mt-0.5 text-brand-teal"
              aria-hidden="true"
            />
            <div>
              <p className="font-serif text-lg text-charcoal leading-snug">
                Эта страница доступна на русском языке
              </p>
              <SecondaryButton onClick={accept} className="mt-4">
                Перейти На Русский
              </SecondaryButton>
            </div>
          </div>
        </m.aside>
      )}
    </AnimatePresence>
  );
}
