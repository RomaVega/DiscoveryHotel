"use client"; // Uses framer-motion for bounce animation, scroll visibility, and locale detection

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import type { WhatsAppContact } from "@/lib/types";

interface WhatsAppButtonProps {
  phone: string;
  greeting: string;
  contacts?: WhatsAppContact[];
}

export function WhatsAppButton({ phone, greeting, contacts }: WhatsAppButtonProps) {
  const { locale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Pick the first contact matching the current locale, or fall back to props */
  const match = contacts?.find((c) => c.locale === locale) ?? contacts?.find((c) => c.locale === "en");
  const finalPhone = match?.number ?? phone;
  const finalGreeting = match?.greeting ?? greeting;
  const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(finalGreeting)}`;

  return (
    <AnimatePresence>
      {scrolled && (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366]/75 text-white shadow-lg focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        y: { duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 },
      }}
      whileHover={{ scale: 1.08 }}
    >
      <MessageCircle size={28} />
    </motion.a>
      )}
    </AnimatePresence>
  );
}
