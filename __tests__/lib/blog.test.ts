import { describe, it, expect, vi, afterEach } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { getPost, getPosts, getPostSlugs, postPath, postStaticParams, NO_POSTS_SLUG, formatPostDate } from "@/lib/blog";
import { getActiveOffer } from "@/lib/content";
import { headingId, lexMarkdown, soleImage, tableOfContents } from "@/lib/markdown";
import { webpSize } from "@/lib/image-size";
import { ALL_ROUTES } from "@/lib/image-manifest";
import type { Tokens } from "marked";
import type { Locale } from "@/lib/types";

const LOCALES: Locale[] = ["en", "ru"];
const BLOG_DIR = join(process.cwd(), "content", "blog");
const files = existsSync(BLOG_DIR) ? readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")) : [];

describe("content/blog", () => {
  it("names every file <slug>.<en|ru>.md", () => {
    for (const f of files) expect(f).toMatch(/^[a-z0-9-]+\.(en|ru)\.md$/);
  });

  // Loading runs the zod schema, reads the hero's size off the file, and
  // applies the TO CONFIRM guard — a bad post fails here before it fails a build.
  it.each(files)("%s loads", (file) => {
    const [slug, locale] = file.replace(/\.md$/, "").split(".") as [string, Locale];
    const post = getPost(slug, locale);
    expect(post.hero.width).toBeGreaterThan(0);
    expect(post.metaTitle.toLowerCase().split("orlowsky").length - 1).toBeLessThanOrEqual(1);
  });

  it.each(files)("%s links only to pages that exist", (file) => {
    const [slug, locale] = file.replace(/\.md$/, "").split(".") as [string, Locale];
    const { body } = getPost(slug, locale);
    const internal = [...body.matchAll(/\]\((\/[^)\s#]*)/g)].map((m) => m[1]).filter((h) => !h.startsWith("/images/"));
    for (const href of internal) {
      // Posts link locale-agnostically; LocalizedLink adds /ru on Russian pages.
      const target = locale === "ru" ? `/ru${href === "/" ? "" : href}` : href;
      expect(ALL_ROUTES, `${file} links to ${href}`).toContain(target);
    }
  });

  it.each(files)("%s points its offer at a real offer id", (file) => {
    const [slug, locale] = file.replace(/\.md$/, "").split(".") as [string, Locale];
    const { offer } = getPost(slug, locale);
    if (!offer) return;
    // Inactive or not yet added is allowed (the block just hides); a typo is not
    // distinguishable from "not yet added", so this only checks the shape.
    expect(offer).toMatch(/^[a-z0-9-]+$/);
    expect(() => getActiveOffer(offer)).not.toThrow();
  });

  it("puts every built post in ALL_ROUTES, so the language redirect knows its twin", () => {
    for (const locale of LOCALES) {
      for (const slug of getPostSlugs(locale)) expect(ALL_ROUTES).toContain(postPath(slug, locale));
    }
  });

  it("lists posts newest first", () => {
    for (const locale of LOCALES) {
      const dates = getPosts(locale).map((p) => p.published);
      expect(dates).toEqual([...dates].sort().reverse());
    }
  });
});

describe("drafts", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("are left out of a Netlify production build, and the route still has a param", async () => {
    vi.stubEnv("CONTEXT", "production");
    vi.resetModules();
    const blog = await import("@/lib/blog");
    for (const locale of LOCALES) {
      for (const slug of blog.getPostSlugs(locale)) expect(blog.getPost(slug, locale).draft).toBe(false);
      const params = blog.postStaticParams(locale);
      expect(params.length).toBeGreaterThan(0);
      if (blog.getPostSlugs(locale).length === 0) expect(params).toEqual([{ slug: blog.NO_POSTS_SLUG }]);
    }
  });

  it("are built on deploy previews", async () => {
    vi.stubEnv("CONTEXT", "deploy-preview");
    vi.resetModules();
    const blog = await import("@/lib/blog");
    const all = files.filter((f) => f.endsWith(".en.md")).length;
    expect(blog.getPostSlugs("en")).toHaveLength(all);
  });
});

describe("postStaticParams", () => {
  it("is never empty — static export rejects a dynamic route with no params", () => {
    for (const locale of LOCALES) expect(postStaticParams(locale).length).toBeGreaterThan(0);
  });

  it("serves the placeholder slug as a 404, not a post", () => {
    expect(() => getPost(NO_POSTS_SLUG, "en")).toThrow();
  });
});

describe("markdown helpers", () => {
  it("makes anchors in any script", () => {
    expect(headingId("Where to stay: close to the start")).toBe("where-to-stay-close-to-the-start");
    expect(headingId("Где жить: рядом со стартом")).toBe("где-жить-рядом-со-стартом");
  });

  it("builds the table of contents from ## headings only", () => {
    const toc = tableOfContents(lexMarkdown("## One\n\ntext\n\n### Sub\n\n## Two *em*\n"));
    expect(toc).toEqual([{ id: "one", text: "One" }, { id: "two-em", text: "Two em" }]);
  });

  it("recognises a paragraph that is only an image", () => {
    const [p] = lexMarkdown("![alt](/images/x.webp \"Caption\")") as Tokens.Paragraph[];
    expect(soleImage(p)?.href).toBe("/images/x.webp");
    const [q] = lexMarkdown("Text ![alt](/images/x.webp)") as Tokens.Paragraph[];
    expect(soleImage(q)).toBeNull();
  });
});

describe("webpSize", () => {
  it("reads a photo's size from its header", () => {
    expect(webpSize("/images/gallery/candidasa-bay-coastline-fishing-boats-east-bali.webp")).toEqual({ width: 1194, height: 896 });
  });

  it("fails loudly on a missing file or another format", () => {
    expect(() => webpSize("/images/nope.webp")).toThrow(/not found/);
    expect(() => webpSize("/images/hero/hero-og.jpg")).toThrow(/webp/);
  });
});

describe("formatPostDate", () => {
  it("formats in each language without depending on the machine's time zone", () => {
    expect(formatPostDate("2026-12-12", "en")).toBe("12 December 2026");
    expect(formatPostDate("2026-12-12", "ru")).toMatch(/^12 декабря 2026/);
  });
});
