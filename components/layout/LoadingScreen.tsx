"use client"; // Uses useState/useEffect to track page load, CSS animations for smooth exit

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Image from "next/image";

export function LoadingScreen() {
  const [phase, setPhase] = useState<"visible" | "exiting" | "gone">("visible");
  const circleRef = useRef<SVGCircleElement>(null);

  useLayoutEffect(() => {
    if (circleRef.current) {
      const angle = Math.floor(Math.random() * 360) - 90;
      circleRef.current.setAttribute("transform", `rotate(${angle} 140 140)`);
    }
  }, []);

  useEffect(() => {
    history.scrollRestoration = "manual";

    let savedY = 0;
    try {
      savedY = parseInt(sessionStorage.getItem("scrollY") || "0", 10);
    } catch { /* sessionStorage unavailable (Safari private mode) */ }

    let dismissed = false;
    const hide = () => {
      if (dismissed) return;
      dismissed = true;
      if (savedY > 0) window.scrollTo(0, savedY);
      setPhase("exiting");
      setTimeout(() => {
        setPhase("gone");
        try { sessionStorage.removeItem("scrollY"); } catch { /* ignore */ }
      }, 300);
    };

    const saveScroll = () => {
      try { sessionStorage.setItem("scrollY", String(window.scrollY)); } catch { /* ignore */ }
    };
    window.addEventListener("beforeunload", saveScroll);

    // Primary: hide as soon as hero image signals it's ready
    window.addEventListener("hero-ready", hide, { once: true });

    // Fallback: after window.load give hero 1 s to signal, then dismiss anyway
    // (handles pages without a hero section, or images already cached)
    let grace: ReturnType<typeof setTimeout> | null = null;
    const onLoad = () => { grace = setTimeout(hide, 1000); };
    if (document.readyState === "complete") {
      grace = setTimeout(hide, 1000);
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    // Safety net: never block longer than 10 s
    const safety = setTimeout(hide, 10000);

    return () => {
      window.removeEventListener("hero-ready", hide);
      window.removeEventListener("beforeunload", saveScroll);
      window.removeEventListener("load", onLoad);
      if (grace) clearTimeout(grace);
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
          src="/images/logo/logo-dark.svg"
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
            stroke="#0abab5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 125 * 0.12} ${2 * Math.PI * 125 * 0.88}`}
            transform="rotate(-90 140 140)"
            ref={circleRef}
          />
        </svg>
      </div>
    </div>
  );
}
