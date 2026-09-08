import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";

// The fallback's own rendering is covered by ErrorFallback.test.tsx; stubbing it
// here keeps these cases on the one thing they assert — that each boundary
// reports before it paints.
vi.mock("@/components/layout/ErrorFallback", () => ({
  ErrorFallback: ({ locale }: { locale: string }) => (
    <div data-testid="fallback" data-locale={locale} />
  ),
  localeFromPath: () => "en",
}));

const reportBoundaryError = vi.fn();
vi.mock("@/lib/report-error", () => ({
  reportBoundaryError: (...args: unknown[]) => reportBoundaryError(...args),
}));

describe("error boundaries report to telemetry", () => {
  beforeEach(() => {
    reportBoundaryError.mockClear();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("app/error.tsx reports a non-fatal error", async () => {
    const { default: RouteError } = await import("@/app/error");
    const error = Object.assign(new Error("boom"), { digest: "abc123" });

    render(<RouteError error={error} />);

    expect(reportBoundaryError).toHaveBeenCalledWith(error, false);
  });

  it("app/global-error.tsx reports the same error as fatal", async () => {
    const { default: GlobalError } = await import("@/app/global-error");
    const error = Object.assign(new Error("layout died"), { digest: "def456" });

    // It renders its own <html>/<body>; mount into a detached container so
    // testing-library isn't asked to nest a document inside the jsdom one.
    render(<GlobalError error={error} />, {
      container: document.createDocumentFragment() as unknown as HTMLElement,
    });

    expect(reportBoundaryError).toHaveBeenCalledWith(error, true);
  });
});
