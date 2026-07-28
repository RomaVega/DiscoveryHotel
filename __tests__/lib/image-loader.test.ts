import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/image-manifest", () => ({
  IMAGE_VERSIONS: { "/images/known.webp": "abc12345" },
}));
vi.mock("@/lib/site", () => ({
  ASSET_VERSION: "fallback99",
}));

describe("imageLoader (production)", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("versions a manifest path with its own content hash", async () => {
    const { default: imageLoader } = await import("@/lib/image-loader");
    const url = imageLoader({ src: "/images/known.webp", width: 400 });
    const netlifyUrl = new URL(url, "https://example.com");
    const inner = new URL(netlifyUrl.searchParams.get("url")!, "https://example.com");
    expect(inner.searchParams.get("v")).toBe("abc12345");
  });

  it("falls back to ASSET_VERSION for a path the manifest doesn't cover", async () => {
    const { default: imageLoader } = await import("@/lib/image-loader");
    const url = imageLoader({ src: "/images/unlisted.webp", width: 400 });
    const netlifyUrl = new URL(url, "https://example.com");
    const inner = new URL(netlifyUrl.searchParams.get("url")!, "https://example.com");
    expect(inner.searchParams.get("v")).toBe("fallback99");
  });

  it("passes external URLs through untouched", async () => {
    const { default: imageLoader } = await import("@/lib/image-loader");
    const src = "https://cdn.example.com/photo.webp";
    expect(imageLoader({ src, width: 400 })).toBe(src);
  });
});
