import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";

// next/script's afterInteractive strategy is a no-op outside the Next runtime,
// so stub it with a plain <script> to assert on what would be injected.
vi.mock("next/script", () => ({
  default: ({ src, children, id }: { src?: string; children?: string; id?: string }) => (
    <script data-testid="ga-script" data-src={src} id={id}>
      {children}
    </script>
  ),
}));

const ORIGINAL_GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

async function renderAnalytics() {
  vi.resetModules();
  const { GoogleAnalytics } = await import("@/components/layout/GoogleAnalytics");
  return render(<GoogleAnalytics />);
}

describe("GoogleAnalytics", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (ORIGINAL_GA_ID === undefined) {
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    } else {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = ORIGINAL_GA_ID;
    }
  });

  it("renders nothing when the measurement ID is unset", async () => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const { container } = await renderAnalytics();
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when the measurement ID is an empty string", async () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "";
    const { container } = await renderAnalytics();
    expect(container.innerHTML).toBe("");
  });

  it("loads gtag.js and configures the property when the ID is set", async () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST12345";
    const { container } = await renderAnalytics();

    const scripts = Array.from(container.querySelectorAll("script"));
    expect(scripts).toHaveLength(2);

    expect(scripts[0].getAttribute("data-src")).toBe(
      "https://www.googletagmanager.com/gtag/js?id=G-TEST12345"
    );
    expect(scripts[1].textContent).toContain("gtag('config', 'G-TEST12345')");
  });
});
