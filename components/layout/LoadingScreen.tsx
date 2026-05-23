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

const isHome = (p: string) => p === "/" || p === "/ru";

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
): () => void {
  const CYCLE = 1400;       // breathing cycle (ms)
  const MIN_LEN = 50;
  const MAX_LEN = 175;
  const MID = (MIN_LEN + MAX_LEN) / 2;
  const HALF = (MAX_LEN - MIN_LEN) / 2;
  const CLOSE_DUR = 480;
  const START_DELAY = 450;  // hold off length repaints while hydration settles

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
      closeLen = breatheLen(bt);
    }
    if (closeStart !== null) {
      const x = Math.min(1, (ts - closeStart) / CLOSE_DUR);
      setLen(closeLen + (360 - closeLen) * easeOutCubic(x));
      if (x >= 1) {
        setLen(360);
        if (!completed) { completed = true; onComplete?.(); }
        return; // finished — stop the loop
      }
    } else {
      setLen(breatheLen(bt));
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export function LoadingScreen() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"visible" | "exiting" | "gone">("visible");
  const [complete, setComplete] = useState(false);
  const firstLoad = useRef(true);
  const initialPathname = useRef(pathname); // route at mount, stable

  const ringRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // Drives the comet length directly — frame-accurate, no React churn (rotation is CSS).
  const setLen = (lenDeg: number) => {
    ringRef.current?.style.setProperty("--len", `${lenDeg}deg`);
  };

  // Completion "lock": paint the ring solid, pulse the glow, then run the caller's fade.
  const playCompletion = (afterFade: () => void) => {
    paintFill(fillRef.current, () => {
      setComplete(true);
      setTimeout(afterFade, 450);
    });
  };

  // Start each reveal clean (before paint).
  useLayoutEffect(() => {
    if (phase !== "visible") return;
    if (ringRef.current) ringRef.current.style.setProperty("--len", "50deg");
    if (fillRef.current) fillRef.current.style.setProperty("--fill", "0deg");
  }, [phase]);

  // FIRST LOAD — breathe the comet, complete once content (fonts + visible images) is ready.
  useEffect(() => {
    history.scrollRestoration = "manual";

    let savedY = 0;
    try {
      savedY = parseInt(sessionStorage.getItem("scrollY") || "0", 10);
    } catch { /* sessionStorage unavailable (Safari private mode) */ }

    const MIN_TIME = 1400; // let the comet breathe at least this long before closing
    const startT = performance.now();
    let contentReady = false;
    const isDone = () => contentReady && performance.now() - startT >= MIN_TIME;

    const fadeOut = () => {
      setPhase("exiting");
      setTimeout(() => {
        setPhase("gone");
        firstLoad.current = false;
        try { sessionStorage.removeItem("scrollY"); } catch { /* ignore */ }
      }, 700);
    };
    const stopAnim = runComet(setLen, isDone, () => playCompletion(fadeOut));

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
        const MIN_TIME = 700;
        const startT = performance.now();
        const isDone = () => navReady && performance.now() - startT >= MIN_TIME;
        stopAnim = runComet(setLen, isDone, () => playCompletion(() => {
          if (cancelled) return;
          setPhase("exiting");
          setTimeout(() => { if (!cancelled) setPhase("gone"); }, 700);
        }));
        setPhase("visible");
      }
    }, 100);

    (async () => {
      await doubleRaf(); // let the new page render + lazy observers fire
      await waitForImages(pendingImages(), 5000);
      if (cancelled) return;
      clearTimeout(showTimer);
      if (shown) navReady = true; // comet closes once min time elapsed
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
            className={`comet-fill absolute inset-0 ${complete ? "is-complete" : ""}`}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
