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

    const hide = () => {
      setTimeout(() => {
        setPhase("exiting");
        setTimeout(() => {
          setPhase("gone");
          requestAnimationFrame(() => window.scrollTo(0, savedY));
          try { sessionStorage.removeItem("scrollY"); } catch { /* ignore */ }
        }, 600);
      }, 400);
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
          unoptimized
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
            transform="rotate(-90 140 140)"
            ref={circleRef}
          />
        </svg>
      </div>
    </div>
  );
}
