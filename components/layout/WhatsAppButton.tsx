"use client"; // Uses framer-motion for entrance animation, scroll visibility, and locale detection

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import type { WhatsAppContact } from "@/lib/types";

/** Official WhatsApp logo as inline SVG — crisp at any size */
function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface WhatsAppButtonProps {
  phone: string;
  greeting: string;
  contacts?: WhatsAppContact[];
}

export function WhatsAppButton({ phone, greeting, contacts }: WhatsAppButtonProps) {
  const { locale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const match = contacts?.find((c) => c.locale === locale) ?? contacts?.find((c) => c.locale === "en");
  const finalPhone = match?.number ?? phone;
  const finalGreeting = match?.greeting ?? greeting;
  const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(finalGreeting)}`;

  const tooltipLabel = locale === "ru" ? "WhatsApp" : "Chat with us";

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.div
          className="fixed bottom-6 right-6 z-40 flex items-center gap-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Tooltip — appears on hover, slides from right */}
          <AnimatePresence>
            {hovered && (
              <motion.span
                className="mr-3 px-3 py-1.5 bg-white rounded-sm shadow-[0_2px_12px_rgba(0,0,0,0.1)] font-sans text-xs font-medium text-charcoal tracking-wide whitespace-nowrap pointer-events-none"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {tooltipLabel}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Button */}
          <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-deep-teal text-white shadow-[0_4px_20px_rgba(42,107,116,0.35)] transition-shadow duration-300 hover:shadow-[0_4px_28px_rgba(76,168,181,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <WhatsAppIcon size={22} />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
