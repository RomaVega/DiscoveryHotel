"use client"; // Tracks scroll direction to animate SVG path morphing

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ScrollDividerProps {
  above: string; // CSS color value
  below: string; // CSS color value
}

// All paths share the same command structure (M C L L Z) for morph compatibility.
// viewBox: 0 0 1440 60. Scrolling DOWN → curve arches UP (opposite direction). Vice versa.
const PATHS = {
  down: "M0,45 C480,5  960,5  1440,45 L1440,60 L0,60 Z", // arch up
  idle: "M0,30 C480,30 960,30 1440,30 L1440,60 L0,60 Z", // flat
  up:   "M0,15 C480,55 960,55 1440,15 L1440,60 L0,60 Z", // arch down
};

const SPRING = { type: "spring" as const, stiffness: 600, damping: 28 };
const SETTLE = { type: "tween"  as const, duration: 0.25, ease: "easeOut" as const };

export function ScrollDivider({ above, below }: ScrollDividerProps) {
  const prefersReduced = useReducedMotion();
  const [path, setPath] = useState(PATHS.idle);
  const lastY = useRef(0);
  const lastDir = useRef<"down" | "up" | "idle">("idle");
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      if (prefersReduced) return;
      const y = window.scrollY;
      const dir = y > lastY.current ? "down" : "up";
      lastY.current = y;

      // Skip setState if direction hasn't changed — avoids redundant re-renders
      if (dir !== lastDir.current) {
        lastDir.current = dir;
        setPath(PATHS[dir]);
      }

      if (settleTimer.current) clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(() => {
        lastDir.current = "idle";
        setPath(PATHS.idle);
      }, 50);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (settleTimer.current) clearTimeout(settleTimer.current);
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
