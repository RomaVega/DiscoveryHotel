"use client"; // Uses useState/useEffect to track page load, CSS animations for smooth exit

import { useState, useEffect } from "react";
import Image from "next/image";

// Wait for images within 3 viewport heights — lazy images near the top that
// may not be done when window.load fires
function waitForNearbyImages(): Promise<void> {
  return new Promise<void>(resolve => {
    // Double rAF gives IntersectionObserver time to trigger lazy loads
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const threshold = window.innerHeight * 3;
      const pending = Array.from(document.images).filter(img => {
        if (img.complete) return false;
        const rect = img.getBoundingClientRect();
        return rect.top < threshold;
      });

      if (pending.length === 0) { resolve(); return; }

      let remaining = pending.length;
      const done = () => { if (--remaining === 0) resolve(); };
      for (const img of pending) {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
      // Never block longer than 5s waiting for images
      setTimeout(resolve, 5000);
    }));
  });
}

export function LoadingScreen() {
  const [phase, setPhase] = useState<"visible" | "exiting" | "gone">("visible");

  useEffect(() => {
    history.scrollRestoration = "manual";

    let savedY = 0;
    try {
      savedY = parseInt(sessionStorage.getItem("scrollY") || "0", 10);
    } catch { /* sessionStorage unavailable (Safari private mode) */ }

    let dismissed = false;
    const dismiss = async () => {
      if (dismissed) return;
      dismissed = true;

      // Wait for fonts, then all visible images
      await document.fonts.ready;
      await waitForNearbyImages();

      if (savedY > 0) window.scrollTo(0, savedY);
      setPhase("exiting");
      setTimeout(() => {
        setPhase("gone");
        try { sessionStorage.removeItem("scrollY"); } catch { /* ignore */ }
      }, 700);
    };

    const saveScroll = () => {
      try { sessionStorage.setItem("scrollY", String(window.scrollY)); } catch { /* ignore */ }
    };
    window.addEventListener("beforeunload", saveScroll);

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    // Absolute safety net: never block longer than 12s
    const safety = setTimeout(dismiss, 12000);

    return () => {
      window.removeEventListener("beforeunload", saveScroll);
      window.removeEventListener("load", dismiss);
      clearTimeout(safety);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      id="loading-screen"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ivory"
      style={{
        opacity: phase === "exiting" ? 0 : 1,
        transition: "opacity 0.6s ease-in-out",
      }}
    >
      <div id="loading-logo" className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
        <Image
          src="/images/logo/logo-dark.webp"
          alt="Orlowsky Discovery Candidasa Hotel"
          width={120}
          height={120}
          priority
          className="relative z-10"
        />
        <svg
          className="absolute inset-0 loading-ring"
          width={280}
          height={280}
          viewBox="0 0 280 280"
          aria-hidden="true"
        >
          <circle
            cx={140}
            cy={140}
            r={125}
            fill="none"
            stroke="#4ca8b5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 125 * 0.12} ${2 * Math.PI * 125 * 0.88}`}
          />
        </svg>
      </div>
    </div>
  );
}
