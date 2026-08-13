import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/image-manifest", () => ({
  ASSET_VERSIONS: { "/video/hero.mp4": "5217ec2d" },
}));

describe("versionedAsset", () => {
  it("appends the file's content hash", async () => {
    const { versionedAsset } = await import("@/lib/site");
    expect(versionedAsset("/video/hero.mp4")).toBe("/video/hero.mp4?v=5217ec2d");
  });

  it("falls back to ASSET_VERSION for a path the manifest doesn't cover", async () => {
    const { versionedAsset, ASSET_VERSION } = await import("@/lib/site");
    expect(versionedAsset("/video/unlisted.mp4")).toBe(`/video/unlisted.mp4?v=${ASSET_VERSION}`);
  });
});
