"use client"; // Uses useState/useEffect to track page load, AnimatePresence for exit animation

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    history.scrollRestoration = "manual";

    let savedY = 0;
    try {
      savedY = parseInt(sessionStorage.getItem("scrollY") || "0", 10);
    } catch { /* sessionStorage unavailable (Safari private mode) */ }

    const hide = () => {
      setTimeout(() => {
        setVisible(false);
        requestAnimationFrame(() => window.scrollTo(0, savedY));
        try { sessionStorage.removeItem("scrollY"); } catch { /* ignore */ }
      }, 600);
    };

    const saveScroll = () => {
      try { sessionStorage.setItem("scrollY", String(window.scrollY)); } catch { /* ignore */ }
    };
    window.addEventListener("beforeunload", saveScroll);

    if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", hide, { once: true });
    }

    return () => window.removeEventListener("beforeunload", saveScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="loading-screen"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ivory"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <div id="loading-logo" className="text-center">
            <Image
              src="/images/logo/logo-dark.svg"
              alt="Orlowsky Discovery Candidasa Hotel"
              width={200}
              height={120}
              priority
              unoptimized
              className="mx-auto"
            />

            {/* Animated teal line */}
            <motion.div
              className="mt-6 h-[3px] bg-brand-teal mx-auto origin-left"
              initial={{ scaleX: 0, width: 80 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
