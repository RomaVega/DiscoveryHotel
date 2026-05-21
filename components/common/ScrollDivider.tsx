"use client"; // rAF-polled scroll velocity — works on browsers that batch scroll events

import { useEffect, useRef } from "react";

interface ScrollDividerProps {
  above: string;
  below: string;
}

const IDLE    = "M0,30 C480,30 960,30 1440,30 L1440,60 L0,60 Z";
const AMP_MAX = 18;

// Velocity EMA smoothing — soaks up chunky scroll events on Firefox Focus etc.
const ATTACK     = 0.35;
const VEL_COAST  = 0.85; // velocity memory when no scroll input (direction tracking)

// Amp lerp toward velocity*scale — extra smoothing layer
const AMP_APPROACH = 0.3;

// Per-frame amp decay — predictable return to flat (preserves the "feel" tuning)
const AMP_DECAY        = 0.88;  // ~500ms desktop
const AMP_DECAY_MOBILE = 0.975; // ~2.5s mobile

const SPEED_SCALE        = 0.55;
const SPEED_SCALE_MOBILE = 3.5;

// Clamp per-frame delta — rAF can pause and dump multi-frame deltas in one tick
const MAX_FRAME_DELTA = 60;
const IDLE_FRAMES_TO_STOP = 30;

// signed amp: positive = bend down, negative = bend up
// direction transitions pass smoothly through zero instead of snapping
function buildPath(signedAmp: number): string {
  const a = Math.max(-AMP_MAX, Math.min(signedAmp, AMP_MAX));
  if (Math.abs(a) < 0.4) return IDLE;
  const abs  = Math.abs(a);
  const edge = 30 + abs;
  const peak = 30 - abs;
  return a > 0
    ? `M0,${edge} C480,${peak} 960,${peak} 1440,${edge} L1440,60 L0,60 Z`
    : `M0,${peak} C480,${edge} 960,${edge} 1440,${peak} L1440,60 L0,60 Z`;
}

export function ScrollDivider({ above, below }: ScrollDividerProps) {
  const pathRef    = useRef<SVGPathElement>(null);
  const lastY      = useRef(0);
  const ampRef     = useRef(0);  // signed
  const velocity   = useRef(0);  // signed EMA, px/frame
  const rafRef     = useRef<number | null>(null);
  const idleFrames = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lastY.current = window.scrollY;

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const decay = isTouchDevice ? AMP_DECAY_MOBILE : AMP_DECAY;
    const scale = isTouchDevice ? SPEED_SCALE_MOBILE : SPEED_SCALE;

    const setD = (d: string) => {
      pathRef.current?.setAttribute("d", d);
    };

    const tick = () => {
      const y = window.scrollY;
      const rawDelta = y - lastY.current;
      lastY.current = y;

      const clampedDelta = Math.max(-MAX_FRAME_DELTA, Math.min(rawDelta, MAX_FRAME_DELTA));

      if (clampedDelta !== 0) {
        // Active scroll: smooth velocity, lerp amp toward target
        velocity.current = velocity.current * (1 - ATTACK) + clampedDelta * ATTACK;
        const target = Math.max(-AMP_MAX, Math.min(velocity.current * scale, AMP_MAX));
        ampRef.current += (target - ampRef.current) * AMP_APPROACH;
        idleFrames.current = 0;
      } else {
        // No input: velocity decays for direction memory; amp doesn't get lifted by lerp
        velocity.current *= VEL_COAST;
        idleFrames.current++;
      }

      // Always apply per-frame amp decay — predictable inertia timing
      ampRef.current *= decay;

      setD(buildPath(ampRef.current));

      if (Math.abs(ampRef.current) < 0.4 && idleFrames.current > IDLE_FRAMES_TO_STOP) {
        ampRef.current = 0;
        velocity.current = 0;
        setD(IDLE);
        rafRef.current = null;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (rafRef.current !== null) return;
      lastY.current = window.scrollY;
      idleFrames.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", startLoop, { passive: true });
    window.addEventListener("touchstart", startLoop, { passive: true });
    window.addEventListener("touchmove", startLoop, { passive: true });
    window.addEventListener("wheel", startLoop, { passive: true });

    return () => {
      window.removeEventListener("scroll", startLoop);
      window.removeEventListener("touchstart", startLoop);
      window.removeEventListener("touchmove", startLoop);
      window.removeEventListener("wheel", startLoop);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
        <path ref={pathRef} d={IDLE} />
      </svg>
    </div>
  );
}
