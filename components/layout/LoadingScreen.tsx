"use client"; // First-visit intro overlay; covers the page until images and hero video are ready

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";

// Above-the-fold images only — those that gate the first paint (LCP). We don't hold the
// screen for below-the-fold images; the preloader handles those in the background.
function nearbyImages(): HTMLImageElement[] {
  const threshold = window.innerHeight * 1.2;
  return Array.from(document.images).filter(img => {
    const rect = img.getBoundingClientRect();
    return rect.top < threshold;
  });
}

function pendingImages(): HTMLImageElement[] {
  return nearbyImages().filter(img => !img.complete);
}

function waitForImages(imgs: HTMLImageElement[], timeout: number): Promise<void> {
  return new Promise<void>(resolve => {
    if (imgs.length === 0) { resolve(); return; }
    let remaining = imgs.length;
    const done = () => { if (--remaining === 0) resolve(); };
    for (const img of imgs) {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
    setTimeout(resolve, timeout);
  });
}

const doubleRaf = () =>
  new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));

// Sweeps the solid fill arc 0->360, painting over the comet's tail to a solid ring.
function paintFill(el: HTMLElement | null, onDone: () => void) {
  const DUR = 380;
  let start: number | null = null;
  const step = (ts: number) => {
    if (start === null) start = ts;
    const t = Math.min(1, (ts - start) / DUR);
    const eased = 0.5 * (1 - Math.cos(Math.PI * t));
    el?.style.setProperty("--fill", `${eased * 360}deg`);
    if (t < 1) requestAnimationFrame(step);
    else onDone();
  };
  requestAnimationFrame(step);
}

const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);

// Indeterminate "breathing" comet (Google-style): the length breathes sinusoidally — the
// head stretches ahead and eases back — while the .comet-spin wrapper carries it around on
// the GPU. Untied from real progress. On `isDone`, the head accelerates forward and snaps the
// circle closed, then locks.
function runComet(
  setLen: (lenDeg: number) => void,
  isDone: () => boolean,
  onComplete?: () => void,
  startDelay = 450,         // hold off length repaints while first-load hydration settles
  reduced = false,          // prefers-reduced-motion: hold a static arc, skip the breathing
): () => void {
  const CYCLE = 1400;       // breathing cycle (ms)
  const MIN_LEN = 50;
  const MAX_LEN = 175;
  const MID = (MIN_LEN + MAX_LEN) / 2;
  const HALF = (MAX_LEN - MIN_LEN) / 2;
  const CLOSE_DUR = 480;
  const START_DELAY = startDelay;

  let raf = 0;
  let start: number | null = null;
  let completed = false;
  let closeStart: number | null = null;
  let closeLen = 0;

  // Starts at MIN_LEN with zero velocity (cosine), so it flows out of the static start.
  const breatheLen = (t: number) => MID - HALF * Math.cos((2 * Math.PI * t) / CYCLE);

  const tick = (ts: number) => {
    if (start === null) start = ts;
    const t = ts - start;
    if (closeStart === null && t < START_DELAY) {
      // GPU rotation carries the static comet + the fade-in; no length repaint yet
      raf = requestAnimationFrame(tick);
      return;
    }
    const bt = t - START_DELAY;
    if (closeStart === null && isDone()) {
      closeStart = ts;
      closeLen = reduced ? MIN_LEN : breatheLen(bt);
    }
    if (closeStart !== null) {
      const x = Math.min(1, (ts - closeStart) / CLOSE_DUR);
      setLen(closeLen + (360 - closeLen) * easeOutCubic(x));
      if (x >= 1) {
        setLen(360);
        if (!completed) { completed = true; onComplete?.(); }
        return; // finished — stop the loop
      }
    } else if (!reduced) {
      setLen(breatheLen(bt));
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export function LoadingScreen() {
  const [phase, setPhase] = useState<"visible" | "exiting" | "gone">("visible");

  const ringRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // Drives the comet length directly — frame-accurate, no React churn (rotation is CSS).
  const setLen = (lenDeg: number) => {
    ringRef.current?.style.setProperty("--len", `${lenDeg}deg`);
  };

  // Completion "lock": paint the ring solid, pulse the glow, then run the caller's fade.
  const playCompletion = (afterFade: () => void) => {
    paintFill(fillRef.current, afterFade);
  };

  // Start each reveal clean (before paint).
  useLayoutEffect(() => {
    if (phase !== "visible") return;
    if (ringRef.current) ringRef.current.style.setProperty("--len", "50deg");
    if (fillRef.current) fillRef.current.style.setProperty("--fill", "0deg");
  }, [phase]);

  // FIRST LOAD — show the intro only on a visitor's first ever load. Every cached reload
  // and return visit skips it entirely (instant). When shown, it waits for the hero video
  // so the page is revealed with the video, not the static poster.
  useEffect(() => {
    // Seen before? Skip the intro — instant page (the overlay is already hidden via CSS).
    let seen = false;
    try { seen = localStorage.getItem("odh_seen") === "1"; } catch { /* ignore */ }
    if (seen) {
      setPhase("gone");
      return;
    }

    let contentReady = false;
    const fadeOut = () => {
      setPhase("exiting");
      setTimeout(() => {
        setPhase("gone");
        try { localStorage.setItem("odh_seen", "1"); } catch { /* ignore */ }
      }, 700);
    };
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const stopAnim = runComet(setLen, () => contentReady, () => playCompletion(fadeOut), 450, reduce);

    const dismiss = async () => {
      // Reveal as soon as fonts + the above-the-fold hero poster are ready. We no longer wait
      // on the hero video — it now loads lazily after LCP, so blocking on it would only stall
      // the reveal (and flash the poster later anyway). Fonts are raced against a short cap so
      // a slow webfont can't hold the intro either.
      await Promise.race([
        document.fonts.ready.catch(() => {}),
        new Promise((r) => setTimeout(r, 1200)),
      ]);
      await doubleRaf();
      await waitForImages(pendingImages(), 1500);
      contentReady = true;
    };
    dismiss();

    // Absolute safety net: never hold the intro longer than ~2.5s on a cold first visit.
    const safety = setTimeout(() => { contentReady = true; }, 2500);

    return () => {
      clearTimeout(safety);
      stopAnim();
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      id="loading-screen"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-parchment"
      style={{
        opacity: phase === "exiting" ? 0 : 1,
        transition: "opacity 0.6s ease-in-out",
      }}
    >
      <div
        className="loading-content-in relative flex items-center justify-center"
        style={{
          width: 280,
          height: 280,
          transform: phase === "exiting" ? "scale(1.12)" : "scale(1)",
          transition: "transform 0.6s ease-in",
        }}
      >
        <Image
          src="/images/logo/logo-dark.webp"
          alt="Orlowsky Discovery Candidasa Hotel"
          width={120}
          height={120}
          priority
          className="relative z-10"
          style={{ transform: "translateY(6px)" }}
        />
        {/* GPU-rotated frame — keeps the orbit smooth under main-thread load */}
        <div className="comet-spin absolute inset-0">
          {/* breathing comet arc — length driven via ref for max smoothness */}
          <div
            ref={ringRef}
            className="comet-ring absolute inset-0"
            role="progressbar"
            aria-label="Loading"
          />
          {/* solid arc sweeps 0->360 on completion, painting over the tail (the "lock" glow) */}
          <div
            ref={fillRef}
            className="comet-fill absolute inset-0"
            aria-hidden="true"
          />
        </div>
        {/* center disc forms the ring (no CSS mask — keeps the spin GPU-composited) */}
        <div className="comet-hole" aria-hidden="true" />
      </div>
    </div>
  );
}
