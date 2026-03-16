"use client"; // Uses useState/useEffect to track page load, AnimatePresence for exit animation

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [startAngle, setStartAngle] = useState<number | null>(null);

  useEffect(() => {
    setStartAngle(Math.floor(Math.random() * 360));
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
          <div id="loading-logo" className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
            {/* Logo centered */}
            <Image
              src="/images/logo/logo-dark.svg"
              alt="Orlowsky Discovery Candidasa Hotel"
              width={120}
              height={120}
              priority
              unoptimized
              className="relative z-10"
            />

            {/* Circular progress ring — only mount after random angle is ready */}
            {startAngle !== null && <motion.svg
              className="absolute inset-0"
              width={280}
              height={280}
              viewBox="0 0 280 280"
              aria-hidden="true"
              initial={{ opacity: 0, rotate: startAngle ?? 0 }}
              animate={{ opacity: 1, rotate: (startAngle ?? 0) + 360 }}
              transition={{
                opacity: { duration: 0.5, delay: 0.3 },
                rotate: { duration: 1.6, ease: "linear", repeat: Infinity, repeatDelay: 0 },
              }}
              style={{ originX: "140px", originY: "140px" }}
            >
              {/* Fixed partial arc — ~12% of circumference */}
              <circle
                cx={140}
                cy={140}
                r={125}
                fill="none"
                stroke="#4ca8b5"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 125 * 0.12} ${2 * Math.PI * 125 * 0.88}`}
                transform="rotate(-90 140 140)"
              />
            </motion.svg>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
