"use client"; // Scroll visibility via listener + IntersectionObserver

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { useAtPageBottom } from "@/lib/use-page-bottom";
import { serviceForRoute } from "@/lib/booking";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { BookNowButton } from "@/components/common/BookNowButton";

interface BookingBarProps {
  /** Inner pages show the button from the first paint; the home page holds it
      back until the full-height hero video has scrolled past, so it never
      covers the hero's own call to action. */
  alwaysVisible?: boolean;
}

/**
 * Positions and reveals the persistent mobile Book Now button.
 *
 * This component owns *when* the button is on screen and *what it books*, not
 * what it looks like — the treatment lives in `BookNowButton`, which the mobile
 * drawer renders too so the two can never drift apart.
 *
 * On a page selling something the room engine cannot book, the button names
 * that service and opens WhatsApp about it. It used to say "Book Now" and open
 * the room reservation form on every page, which on `/experiences/diving` put
 * a permanent button directly over the page's own correctly-targeted "Book Now"
 * — same words, different destination, mine on top.
 *
 * It disappears only at the very bottom of the page, together with the
 * WhatsApp button — see `useAtPageBottom`. Both otherwise sit over the footer's
 * privacy and terms links.
 */
export function BookingBar({ alwaysVisible = false }: BookingBarProps) {
  const pathname = usePathname();
  const { tl } = useLanguage();
  const [scrolledPast, setScrolledPast] = useState(alwaysVisible);
  const atPageBottom = useAtPageBottom();

  useEffect(() => {
    if (alwaysVisible) { setScrolledPast(true); return; }
    const onScroll = () => setScrolledPast(window.scrollY > window.innerHeight * 0.9);
    onScroll(); // sync initial state — a reload can restore a scrolled position
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysVisible]);

  const service = serviceForRoute(pathname);
  // `topics`, not the label: the labels are verb phrases ("Book a Treatment",
  // "Записаться в спа") and reusing one inside the sentence produces "I'd like
  // to ask about book a treatment" and, in Russian, a verb where «про» requires
  // an accusative noun.
  const serviceCta = service
    ? {
        label: tl.serviceCta.labels[service],
        href: buildWhatsAppUrl(tl.serviceCta.enquiry.replace("{service}", tl.serviceCta.topics[service])),
      }
    : {};

  return (
    <AnimatePresence>
      {scrolledPast && !atPageBottom && (
        <m.div
          // z-40 keeps it under the mobile menu's z-[60]. pointer-events-none on
          // the positioning layer, auto on the button: the layer spans the width
          // and would otherwise swallow taps and scrolls meant for the page.
          //
          // pb tracks the home-indicator inset, matching the mobile drawer's
          // bottom actions rather than a fixed padding that floats above it.
          // pb 30px puts this button's centre on the WhatsApp button's centre:
          // that one sits at bottom-6 (24px) and is 56px tall, so its midline is
          // 52px up; this one is 44px tall, so 24 + (56-44)/2 = 30px. They were
          // 14px apart, which is what read as the two not belonging together.
          // The safe-area floor still wins on a device with a home indicator,
          // where it lifts this button ~4px above that midline — imperceptible,
          // and better than sitting in the indicator's strip.
          className="fixed bottom-0 inset-x-0 z-40 lg:hidden pointer-events-none flex justify-center px-4 pb-[max(1.875rem,env(safe-area-inset-bottom))]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <BookNowButton className="pointer-events-auto" {...serviceCta} />
        </m.div>
      )}
    </AnimatePresence>
  );
}
