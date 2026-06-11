"use client"; // Provides LazyMotion context for reduced framer-motion bundle

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      {/* reducedMotion="user": with prefers-reduced-motion set, transform/layout
          animations are skipped (static fallback) while opacity fades remain —
          the WCAG-accepted safe subset. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
