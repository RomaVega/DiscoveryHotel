"use client"; // Tracks scroll direction and touch movement to animate SVG path morphing

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ScrollDividerProps {
  above: string; // CSS color value
  below: string; // CSS color value
}

// All paths share the same command structure (M C L L Z) for morph compatibility.
// viewBox: 0 0 1440 60. Scrolling DOWN → curve arches UP (opposite direction). Vice versa.
const PATHS = {
  down: "M0,52 C480,2  960,2  1440,52 L1440,60 L0,60 Z", // arch up
  idle: "M0,30 C480,30 960,30 1440,30 L1440,60 L0,60 Z", // flat
  up:   "M0,8  C480,58 960,58 1440,8  L1440,60 L0,60 Z", // arch down
};

const SPRING = { type: "spring" as const, stiffness: 600, damping: 28 };
const SETTLE = { type: "tween"  as const, duration: 0.15, ease: "easeOut" as const };

export function ScrollDivider({ above, below }: ScrollDividerProps) {
  const prefersReduced = useReducedMotion();
  const [path, setPath] = useState(PATHS.idle);
  const lastY = useRef(0);
  const lastDir = useRef<"down" | "up" | "idle">("idle");
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touching = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const clearSettle = () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };

    const scheduleSettle = () => {
      clearSettle();
      settleTimer.current = setTimeout(() => {
        lastDir.current = "idle";
        setPath(PATHS.idle);
      }, 30);
    };

    const applyDir = (dir: "down" | "up") => {
      if (dir !== lastDir.current) {
        lastDir.current = dir;
        setPath(PATHS[dir]);
      }
    };

    // Scroll (desktop + non-touch scroll)
    const onScroll = () => {
      if (prefersReduced || touching.current) return;
      const y = window.scrollY;
      const dir = y > lastY.current ? "down" : "up";
      lastY.current = y;
      applyDir(dir);
      scheduleSettle();
    };

    // Touch — curve persists while finger is down, settles on lift
    const onTouchStart = (e: TouchEvent) => {
      if (prefersReduced) return;
      touching.current = true;
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      clearSettle();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (prefersReduced) return;
      const deltaY = touchStartY.current - e.touches[0].clientY;
      const deltaX = touchStartX.current - e.touches[0].clientX;
      // Ignore horizontal swipes (e.g. review scroller)
      if (Math.abs(deltaX) > Math.abs(deltaY)) return;
      const dir = deltaY > 0 ? "down" : "up";
      applyDir(dir);
      // No settle timer — curve holds while finger is on screen
    };

    const onTouchEnd = () => {
      if (prefersReduced) return;
      touching.current = false;
      scheduleSettle();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      clearSettle();
    };
  }, [prefersReduced]);

  return (
    <div
      className="relative overflow-hidden -mt-px -mb-px"
      style={{ height: 60, backgroundColor: above }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ fill: below }}
      >
        <motion.path
          d={path}
          animate={{ d: path }}
          transition={path === PATHS.idle ? SETTLE : SPRING}
        />
      </svg>
    </div>
  );
}
