import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("returns a single class unchanged", () => {
    expect(cn("text-white")).toBe("text-white");
  });

  it("joins multiple classes", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("merges conflicting Tailwind classes — last wins", () => {
    expect(cn("text-white", "text-black")).toBe("text-black");
    expect(cn("px-4", "px-8")).toBe("px-8");
  });

  it("ignores falsy values", () => {
    expect(cn("px-4", false, undefined, null, "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional class objects", () => {
    expect(cn({ "text-white": true, "text-black": false })).toBe("text-white");
  });

  it("handles arrays of classes", () => {
    expect(cn(["px-4", "py-2"])).toBe("px-4 py-2");
  });

  it("returns empty string when no valid classes", () => {
    expect(cn(false, undefined, null)).toBe("");
  });
});
