"use client"; // Tracks scroll velocity to drive curve amplitude in real time

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface ScrollDividerProps {
  above: string;
  below: string;
}

const IDLE        = "M0,30 C480,30 960,30 1440,30 L1440,60 L0,60 Z";
const AMP_MAX     = 18;
const DECAY       = 0.88;
const SPEED_SCALE = 0.55;

function buildPath(amp: number, dir: "down" | "up"): string {
  const a = Math.max(0, Math.min(amp, AMP_MAX));
  if (a < 0.4) return IDLE;
  const edge = 30 + a;
  const peak = 30 - a;
  return dir === "down"
    ? `M0,${edge} C480,${peak} 960,${peak} 1440,${edge} L1440,60 L0,60 Z`
    : `M0,${peak} C480,${edge} 960,${edge} 1440,${peak} L1440,60 L0,60 Z`;
}

export function ScrollDivider({ above, below }: ScrollDividerProps) {
  const prefersReduced = useReducedMotion();
  const [path, setPath] = useState(IDLE);

  const lastY  = useRef(0);
  const ampRef = useRef(0);
  const dirRef = useRef<"down" | "up">("down");
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReduced) return;
    lastY.current = window.scrollY;

    const startDecay = () => {
      if (rafRef.current) return;
      const step = () => {
        ampRef.current *= DECAY;
        const p = buildPath(ampRef.current, dirRef.current);
        setPath(p);
        if (ampRef.current > 0.4) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          ampRef.current = 0;
          setPath(IDLE);
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      lastY.current = y;
      if (delta === 0) return;

      dirRef.current = delta > 0 ? "down" : "up";
      const boost = Math.abs(delta) * SPEED_SCALE;
      ampRef.current = Math.min(Math.max(ampRef.current, boost), AMP_MAX);
      startDecay();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
        <path d={path} />
      </svg>
    </div>
  );
}
