"use client"; // Tracks first load + client-side navigation, covers the page until images are ready

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Images within 3 viewport heights — the ones that affect the visible page.
function nearbyImages(): HTMLImageElement[] {
  const threshold = window.innerHeight * 3;
  return Array.from(document.images).filter(img => {
    const rect = img.getBoundingClientRect();
    return rect.top < threshold;
  });
}

function pendingImages(): HTMLImageElement[] {
  return nearbyImages().filter(img => !img.complete);
}

function waitForImages(
  imgs: HTMLImageElement[],
  timeout: number,
  onProgress?: (fraction: number) => void,
): Promise<void> {
  return new Promise<void>(resolve => {
    const total = imgs.length;
    if (total === 0) { onProgress?.(1); resolve(); return; }
    let remaining = total;
    const done = () => {
      remaining--;
      onProgress?.((total - remaining) / total);
      if (remaining === 0) resolve();
    };
    for (const img of imgs) {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
    setTimeout(() => { onProgress?.(1); resolve(); }, timeout);
  });
}

const doubleRaf = () =>
  new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));

const isHome = (p: string) => p === "/" || p === "/ru";

// Sweeps the solid fill arc 0->360, painting over the comet's tail. easeInOutSine starts
// from rest so it continues the head's decelerating growth with no velocity jump.
function paintFill(el: HTMLElement | null, onDone: () => void) {
  const DUR = 600;
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

// Grows the beam along a time-based ramp (so it always starts small and grows visibly,
// even when content is cached and "really" 100% instantly). Only once `isDone` — content
// actually ready AND the minimum grow time elapsed — does it close to 100% and lock.
// `set` receives a float fraction each frame so the ring is driven at sub-pixel precision
// directly through the DOM (no React re-renders, no stepping).
function animateProgress(
  getReal: () => number,
  isDone: () => boolean,
  set: (fraction: number) => void,
  onComplete?: () => void,
): () => void {
  let raf = 0;
  let disp = 0;
  let completed = false;
  const tick = () => {
    if (isDone()) {
      disp += (1 - disp) * 0.18;
      if (disp > 0.999) {
        set(1);
        if (!completed) { completed = true; onComplete?.(); }
        return; // finished — stop the loop
      }
    } else {
      const r = getReal();
      if (r > disp) disp = r; // follow the ramp, never go backward
    }
    set(disp);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

// easeInQuad time ramp: starts at 12.5% of the circle and stays small for most of the
// duration, growing gently toward 92%. Completion is reserved for the lock sweep.
function growRamp(startT: number, durMs: number): number {
  const START = 0.125;
  const END = 0.92;
  const t = Math.min(1, (performance.now() - startT) / durMs);
  return START + (END - START) * t * t;
}

export function LoadingScreen() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"visible" | "exiting" | "gone">("visible");
  const [complete, setComplete] = useState(false);
  const firstLoad = useRef(true);
  const initialPathname = useRef(pathname); // route at mount, stable

  const ringRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // Drives the ring directly — float precision, frame-accurate, no React churn.
  const setBar = (fraction: number) => {
    const el = ringRef.current;
    if (!el) return;
    el.style.setProperty("--angle", `${fraction * 360}deg`);
    el.setAttribute("aria-valuenow", String(Math.round(fraction * 100)));
  };

  // Start each reveal clean (before paint): empty comet + fill.
  useLayoutEffect(() => {
    if (phase !== "visible") return;
    if (ringRef.current) ringRef.current.style.setProperty("--angle", "0deg");
    if (fillRef.current) fillRef.current.style.setProperty("--fill", "0deg");
  }, [phase]);

  // FIRST LOAD — time-based grow, complete once content (fonts + visible images) is ready.
  useEffect(() => {
    history.scrollRestoration = "manual";

    let savedY = 0;
    try {
      savedY = parseInt(sessionStorage.getItem("scrollY") || "0", 10);
    } catch { /* sessionStorage unavailable (Safari private mode) */ }

    const GROW_DUR = 2400; // minimum visible grow time
    const startT = performance.now();
    let contentReady = false;
    const real = () => growRamp(startT, GROW_DUR);
    const isDone = () => contentReady && performance.now() - startT >= GROW_DUR;

    const fadeOut = () => {
      setPhase("exiting");
      setTimeout(() => {
        setPhase("gone");
        firstLoad.current = false;
        try { sessionStorage.removeItem("scrollY"); } catch { /* ignore */ }
      }, 700);
    };
    const onComplete = () => {
      // Head continues from the top, sweeping the solid fill around to paint over the tail.
      paintFill(fillRef.current, () => {
        setComplete(true);        // full ring pulses a glow (the "lock")
        setTimeout(fadeOut, 650); // hold the glow, then fade
      });
    };
    const stopAnim = animateProgress(real, isDone, setBar, onComplete);

    // Content readiness — fonts + visible images. NOT window.load (that waits for the
    // hero video, which loads in the background behind its poster image).
    let dismissed = false;
    const dismiss = async () => {
      if (dismissed) return;
      dismissed = true;
      await document.fonts.ready;
      await doubleRaf();
      await waitForImages(pendingImages(), 8000);
      contentReady = true;
      if (isHome(initialPathname.current)) window.scrollTo(0, 0);
      else if (savedY > 0) window.scrollTo(0, savedY);
    };

    const saveScroll = () => {
      try { sessionStorage.setItem("scrollY", String(window.scrollY)); } catch { /* ignore */ }
    };
    window.addEventListener("beforeunload", saveScroll);

    dismiss();

    // Absolute safety net: force completion after 12s
    const safety = setTimeout(() => { contentReady = true; }, 12000);

    return () => {
      window.removeEventListener("beforeunload", saveScroll);
      clearTimeout(safety);
      stopAnim();
    };
  }, []);

  // NAVIGATION — cover the new page only if its images aren't ready within a short window.
  useEffect(() => {
    if (firstLoad.current) return; // first load handled above

    // Navigating to home always lands on the hero at the very top.
    if (isHome(pathname)) window.scrollTo(0, 0);

    let cancelled = false;
    let shown = false;
    let navReady = false;
    let stopAnim: (() => void) | null = null;

    const showTimer = setTimeout(() => {
      if (!cancelled && pendingImages().length > 0) {
        shown = true;
        setComplete(false);
        const NAV_GROW = 800;
        const startT = performance.now();
        const real = () => growRamp(startT, NAV_GROW);
        const isDone = () => navReady && performance.now() - startT >= NAV_GROW;
        const onComplete = () => {
          paintFill(fillRef.current, () => {
            setComplete(true);
            setTimeout(() => {
              if (cancelled) return;
              setPhase("exiting");
              setTimeout(() => { if (!cancelled) setPhase("gone"); }, 700);
            }, 650);
          });
        };
        stopAnim = animateProgress(real, isDone, setBar, onComplete);
        setPhase("visible");
      }
    }, 100);

    (async () => {
      await doubleRaf(); // let the new page render + lazy observers fire
      await waitForImages(pendingImages(), 5000);
      if (cancelled) return;
      clearTimeout(showTimer);
      if (shown) navReady = true; // animator completes once min grow time elapsed
      else setPhase("gone");
    })();

    return () => { cancelled = true; clearTimeout(showTimer); stopAnim?.(); };
  }, [pathname]);

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
      <div className="loading-content-in relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
        <Image
          src="/images/logo/logo-dark.webp"
          alt="Orlowsky Discovery Candidasa Hotel"
          width={120}
          height={120}
          priority
          className="relative z-10"
        />
        {/* shared rotating frame — comet + fill spin together so the completion sweep stays aligned */}
        <div className="comet-spin absolute inset-0">
          {/* comet-tail progress ring — driven via ref for max smoothness */}
          <div
            ref={ringRef}
            className="comet-ring absolute inset-0"
            role="progressbar"
            aria-label="Loading"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          />
          {/* solid arc sweeps 0->360 on completion, painting over the tail (the "lock" glow) */}
          <div
            ref={fillRef}
            className={`comet-fill absolute inset-0 ${complete ? "is-complete" : ""}`}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
