import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { parse as parseYaml } from "yaml";
import { blogFrontmatterSchema } from "./validation";
import { webpSize } from "./image-size";
import type { BlogPost, BlogPostMeta, Locale } from "./types";
import enLocale from "@/locales/en.json";
import ruLocale from "@/locales/ru.json";

/** UI strings for the server-rendered blog sections (`blog.*` and `offers.*`). */
export function blogStrings(locale: Locale) {
  const file = locale === "ru" ? ruLocale : enLocale;
  return { blog: file.blog, offers: file.offers };
}
export type BlogStrings = ReturnType<typeof blogStrings>;

/**
 * Blog posts: `content/blog/<slug>.<locale>.md`, YAML frontmatter + Markdown.
 *
 * The one place the site's content is not JSON. Long-form prose with headings,
 * lists, tables and links reads and diffs far better as Markdown than as a JSON
 * string full of `\n`, and a post is written in one language at a time, so the
 * `{ en, ru }` pairs the JSON content uses buy nothing here. Everything a page
 * relies on structurally — titles, dates, the hero, key facts, the FAQ — is in
 * the frontmatter and validated by `blogFrontmatterSchema`, so a bad post fails
 * the build with the file and field named, exactly like a bad JSON file.
 *
 * Server-only (reads the filesystem); used by page files and server sections at
 * build time. Nothing here reaches the browser.
 */

const BLOG_DIR = join(process.cwd(), "content", "blog");

/**
 * Drafts (`draft: true`) are built everywhere except Netlify's production
 * context, so a post can be read on its PR's deploy preview — and merged —
 * before it goes live. Flipping the flag is the publish step. Same `CONTEXT`
 * variable GoogleTagManager gates on; scripts/generate-image-manifest.js
 * applies the same rule to the route list.
 */
export const SHOW_DRAFTS = process.env.CONTEXT !== "production";
const FILE_RE = /^([a-z0-9-]+)\.(en|ru)\.md$/;
/** Silent-reading speed, words per minute. Russian words run longer. */
const WPM: Record<Locale, number> = { en: 220, ru: 180 };

function postFiles(): { slug: string; locale: Locale; file: string }[] {
  if (!existsSync(BLOG_DIR)) return [];
  return readdirSync(BLOG_DIR)
    .map((name) => {
      const m = FILE_RE.exec(name);
      return m ? { slug: m[1], locale: m[2] as Locale, file: join(BLOG_DIR, name) } : null;
    })
    .filter((x): x is { slug: string; locale: Locale; file: string } => x !== null);
}

function splitFrontmatter(raw: string, file: string): { data: unknown; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) throw new Error(`${file}: missing YAML frontmatter between --- lines`);
  return { data: parseYaml(m[1]), body: m[2] };
}

function wordCount(markdown: string): number {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\]\([^)]*\)/g, "]") // link targets
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

function load(slug: string, locale: Locale): BlogPost {
  const file = join(BLOG_DIR, `${slug}.${locale}.md`);
  const raw = readFileSync(file, "utf8");
  const { data, body } = splitFrontmatter(raw, file);
  const parsed = blogFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid frontmatter in content/blog/${slug}.${locale}.md:\n${issues}`);
  }
  const fm = parsed.data;
  // Open questions are written inline as "TO CONFIRM: …" so they show on the
  // preview; a post still carrying one cannot be published.
  if (!fm.draft && /TO CONFIRM/.test(raw)) {
    throw new Error(`content/blog/${slug}.${locale}.md still has a TO CONFIRM note — resolve it or keep draft: true`);
  }
  if (fm.ogImage && !existsSync(join(process.cwd(), "public", fm.ogImage))) {
    throw new Error(`content/blog/${slug}.${locale}.md: ogImage not found: ${fm.ogImage}`);
  }
  if (fm.updated < fm.published) {
    throw new Error(`content/blog/${slug}.${locale}.md: updated (${fm.updated}) is before published (${fm.published})`);
  }

  const other: Locale = locale === "en" ? "ru" : "en";
  const words = wordCount(body) + fm.faq.reduce((n, f) => n + wordCount(`${f.q} ${f.a}`), 0);

  const twinFile = join(BLOG_DIR, `${slug}.${other}.md`);

  return {
    ...fm,
    slug,
    locale,
    hero: { ...fm.hero, ...webpSize(fm.hero.src) },
    readingMinutes: Math.max(1, Math.round(words / WPM[locale])),
    hasTwin: existsSync(twinFile) && (SHOW_DRAFTS || !isDraftFile(twinFile)),
    body,
  };
}

/** Cheap frontmatter check, without a full parse — mirrors the manifest script. */
function isDraftFile(file: string): boolean {
  const head = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(file, "utf8"));
  return !!head && /^draft:\s*true\s*$/m.test(head[1]);
}

/** Every slug built in `locale` — feeds generateStaticParams, the sitemap and /blog. */
export function getPostSlugs(locale: Locale): string[] {
  return postFiles()
    .filter((p) => p.locale === locale && (SHOW_DRAFTS || !isDraftFile(p.file)))
    .map((p) => p.slug)
    .sort();
}

/**
 * Stand-in slug for a locale with nothing to publish. `output: "export"` fails
 * the build when a dynamic route's generateStaticParams returns no params at
 * all — and that is exactly what production sees while every post is still a
 * draft. The page for it renders the 404 (`getPost` calls notFound()), and
 * scripts/prune-placeholder-posts.js deletes the file after the build, so the
 * URL never exists on the site.
 */
export const NO_POSTS_SLUG = "_none";

/** Params for `/blog/[slug]` in `locale`, never empty (see NO_POSTS_SLUG). */
export function postStaticParams(locale: Locale): { slug: string }[] {
  const slugs = getPostSlugs(locale);
  return (slugs.length > 0 ? slugs : [NO_POSTS_SLUG]).map((slug) => ({ slug }));
}

/** A post, or the 404 page for the placeholder slug. */
export function getPost(slug: string, locale: Locale): BlogPost {
  if (slug === NO_POSTS_SLUG) notFound();
  return load(slug, locale);
}

/** Newest first, by publication date. Body omitted — cards don't need it. */
export function getPosts(locale: Locale): BlogPostMeta[] {
  return getPostSlugs(locale)
    .map((slug) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- dropping the body
      const { body, ...meta } = load(slug, locale);
      return meta;
    })
    .sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug));
}

/** Posts carrying any of `tags`, newest first — for "related reading" blocks. */
export function getPostsTagged(locale: Locale, tags: readonly string[], limit = 3): BlogPostMeta[] {
  return getPosts(locale)
    .filter((p) => p.tags.some((t) => tags.includes(t)))
    .slice(0, limit);
}

/** Path of a post in a locale: `/blog/x` or `/ru/blog/x`. */
export function postPath(slug: string, locale: Locale): string {
  return `${locale === "ru" ? "/ru" : ""}/blog/${slug}`;
}

/** Format an ISO date for readers. Fixed locale tags so the build is deterministic. */
export function formatPostDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
