import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useHideWhileReading } from "@/lib/use-hide-while-reading";

function setViewport(narrow: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: narrow, media: query, onchange: null,
    addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => false,
  }));
}

function scrollTo(y: number) {
  act(() => {
    Object.defineProperty(window, "scrollY", { value: y, configurable: true });
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("useHideWhileReading", () => {
  beforeEach(() => scrollTo(0));

  it("hides on a phone while scrolling down, and comes back on any scroll up", () => {
    setViewport(true);
    const { result } = renderHook(() => useHideWhileReading(true));
    scrollTo(600);
    expect(result.current).toBe(true);
    scrollTo(560);
    expect(result.current).toBe(false);
  });

  it("ignores jitter smaller than the threshold", () => {
    setViewport(true);
    const { result } = renderHook(() => useHideWhileReading(true));
    scrollTo(600);
    scrollTo(596);
    expect(result.current).toBe(true);
  });

  it("stays visible near the top, on desktop, and on pages that do not opt in", () => {
    setViewport(true);
    expect(renderHook(() => useHideWhileReading(true)).result.current).toBe(false);
    const nearTop = renderHook(() => useHideWhileReading(true));
    scrollTo(150);
    expect(nearTop.result.current).toBe(false);

    setViewport(false);
    const desktop = renderHook(() => useHideWhileReading(true));
    scrollTo(900);
    expect(desktop.result.current).toBe(false);

    setViewport(true);
    const optedOut = renderHook(() => useHideWhileReading(false));
    scrollTo(1500);
    expect(optedOut.result.current).toBe(false);
  });
});
