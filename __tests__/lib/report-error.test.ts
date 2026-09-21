import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  detectTranslator,
  reportBoundaryError,
  resetReportCountForTests,
} from "@/lib/report-error";

type TaggedWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

const w = window as TaggedWindow;

function clearTags() {
  delete w.gtag;
  delete w.dataLayer;
}

describe("detectTranslator", () => {
  afterEach(() => {
    document.documentElement.className = "";
    document.body.innerHTML = "";
  });

  it("reports none on an untouched document", () => {
    expect(detectTranslator()).toBe("none");
  });

  it("detects Edge's translator by its _msttexthash stamp", () => {
    const p = document.createElement("p");
    p.setAttribute("_msttexthash", "12345");
    document.body.appendChild(p);

    expect(detectTranslator()).toBe("edge");
  });

  it("detects Google Translate by the root class it sets", () => {
    document.documentElement.className = "__variable_37ef13 translated-ltr";

    expect(detectTranslator()).toBe("google");
  });

  it("falls back to unknown for a stray <font> the site never renders", () => {
    document.body.appendChild(document.createElement("font"));

    expect(detectTranslator()).toBe("unknown");
  });

  it("does not mistake a class merely containing the word for Google's flag", () => {
    document.documentElement.className = "untranslated-copy";

    expect(detectTranslator()).toBe("none");
  });
});

describe("reportBoundaryError", () => {
  beforeEach(() => {
    resetReportCountForTests();
    clearTags();
  });

  afterEach(() => {
    clearTags();
    document.documentElement.className = "";
    document.body.innerHTML = "";
  });

  it("stays silent when no container is loaded, rather than creating a queue", () => {
    expect(() => reportBoundaryError(new Error("boom"), false)).not.toThrow();
    expect(w.dataLayer).toBeUndefined();
  });

  it("pushes a boundary_error event carrying the crash detail", () => {
    w.dataLayer = [];

    const error = Object.assign(new Error("removeChild failed"), {
      digest: "2891729834",
    });
    reportBoundaryError(error, true);

    expect(w.dataLayer).toHaveLength(1);
    expect(w.dataLayer[0]).toMatchObject({
      event: "boundary_error",
      description: "removeChild failed",
      fatal: true,
      error_name: "Error",
      error_digest: "2891729834",
      translator: "none",
    });
  });

  it("carries the translator that was active at crash time", () => {
    w.dataLayer = [];
    const p = document.createElement("p");
    p.setAttribute("_msttexthash", "999");
    document.body.appendChild(p);

    reportBoundaryError(new Error("boom"), false);

    expect(w.dataLayer[0]).toMatchObject({ translator: "edge", fatal: false });
  });

  it("uses dataLayer even when gtag exists, so the GTM trigger matches", () => {
    // GTM loads gtag.js for the container's Google tag, so gtag is present in
    // production. A gtag call would reach GA4 but match no Custom Event
    // trigger. See the note in lib/track.ts.
    const gtag = vi.fn();
    w.gtag = gtag;
    w.dataLayer = [];

    reportBoundaryError(new Error("boom"), false);

    expect(gtag).not.toHaveBeenCalled();
    expect(w.dataLayer).toHaveLength(1);
  });

  it("caps a crash loop at three reports", () => {
    w.dataLayer = [];

    for (let i = 0; i < 10; i++) reportBoundaryError(new Error(`boom ${i}`), false);

    expect(w.dataLayer).toHaveLength(3);
  });

  it("clips an overlong message to GA4's 100-character parameter limit", () => {
    w.dataLayer = [];

    reportBoundaryError(new Error("x".repeat(500)), false);

    expect((w.dataLayer[0] as { description: string }).description).toHaveLength(100);
  });

  it("still reports when the boundary hands it no error object", () => {
    w.dataLayer = [];

    reportBoundaryError(undefined, false);

    expect(w.dataLayer[0]).toMatchObject({ description: "unknown" });
  });

  it("never throws when the queue itself is broken", () => {
    w.dataLayer = [];
    w.dataLayer.push = () => {
      throw new Error("dataLayer blew up");
    };

    expect(() => reportBoundaryError(new Error("boom"), false)).not.toThrow();
  });
});
