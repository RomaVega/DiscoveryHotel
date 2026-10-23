import type { Metadata } from "next";
import { blogStrings, getPost, getPosts, postPath } from "./blog";
import { blog, blogPosting, breadcrumbs, faqFromPairs } from "./jsonld";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "./site";
import { offerEnquiryText } from "./offers";
import type { BlogCta, BlogPost, Locale, LocalizedString, Offer } from "./types";
import { buildWhatsAppUrl } from "./whatsapp";

const OG_LOCALE: Record<Locale, string> = { en: "en_US", ru: "ru_RU" };

/**
 * Metadata for a post page. Complete and self-contained, like every page's
 * (the root layout has no title template). `twitter` is set too: left out, the
 * card would inherit the home page's title and photo from the root layout.
 *
 * Language alternates are emitted only when the post exists in both languages.
 * hreflang pointing at a URL that 404s is worse than none — Google drops the
 * whole cluster.
 */
export function postMetadata(slug: string, locale: Locale): Metadata {
  const post = getPost(slug, locale);
  const url = `${SITE_URL}${postPath(slug, locale)}`;
  const image = { url: `${SITE_URL}${post.hero.src}`, width: post.hero.width, height: post.hero.height, alt: post.hero.alt };

  return {
    title: post.metaTitle,
    description: post.description,
    // Belt and braces: drafts never build in production, but a preview URL
    // that leaks should not be indexed either.
    robots: post.draft ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: url,
      languages: post.hasTwin
        ? {
            en: `${SITE_URL}${postPath(slug, "en")}`,
            ru: `${SITE_URL}${postPath(slug, "ru")}`,
            "x-default": `${SITE_URL}${postPath(slug, "en")}`,
          }
        : undefined,
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      title: post.metaTitle,
      description: post.description,
      url,
      locale: OG_LOCALE[locale],
      images: [image],
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.description,
      images: [image.url],
    },
  };
}

const INDEX_TITLE: Record<Locale, string> = {
  en: "Blog — Candidasa & East Bali Guides | Orlowsky Discovery",
  ru: "Блог — гиды по Чандидасе и Восточному Бали | Orlowsky Discovery",
};

/** Metadata for /blog and /ru/blog. */
export function blogIndexMetadata(locale: Locale): Metadata {
  const s = blogStrings(locale).blog;
  const url = `${SITE_URL}${locale === "ru" ? "/ru" : ""}/blog`;
  return {
    title: INDEX_TITLE[locale],
    description: s.indexSubtext,
    // An index with nothing on it yet (every post still a draft) stays out of search.
    robots: getPosts(locale).length === 0 ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: { en: `${SITE_URL}/blog`, ru: `${SITE_URL}/ru/blog`, "x-default": `${SITE_URL}/blog` },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: INDEX_TITLE[locale],
      description: s.indexSubtext,
      url,
      locale: OG_LOCALE[locale],
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: INDEX_TITLE[locale], description: s.indexSubtext, images: [OG_IMAGE] },
  };
}

/** JSON-LD for a post page: the post, its breadcrumb trail, and its FAQ if it has one. */
export function postStructuredData(slug: string, locale: Locale): object[] {
  const post = getPost(slug, locale);
  const s = blogStrings(locale).blog;
  const path = postPath(slug, locale);
  const home = locale === "ru" ? "/ru" : "/";
  return [
    blogPosting({
      path,
      headline: post.title,
      description: post.description,
      image: { url: `${SITE_URL}${post.hero.src}`, width: post.hero.width, height: post.hero.height },
      datePublished: post.published,
      dateModified: post.updated,
      locale,
      keywords: post.tags,
    }),
    breadcrumbs([
      { name: s.home, path: home },
      { name: s.label, path: locale === "ru" ? "/ru/blog" : "/blog" },
      { name: post.title, path },
    ]),
    ...(post.faq.length > 0 ? [faqFromPairs(post.faq, locale)] : []),
  ];
}

/** JSON-LD for /blog and /ru/blog. */
export function blogIndexStructuredData(locale: Locale): object[] {
  const s = blogStrings(locale).blog;
  const base = locale === "ru" ? "/ru" : "";
  return [
    blog({
      path: `${base}/blog`,
      name: locale === "ru" ? "Блог Orlowsky Discovery" : "Orlowsky Discovery Blog",
      description: s.indexSubtext,
      locale,
      posts: getPosts(locale).map((p) => ({ path: postPath(p.slug, locale), headline: p.title })),
    }),
    breadcrumbs([
      { name: s.home, path: base || "/" },
      { name: s.label, path: `${base}/blog` },
    ]),
  ];
}

/** A post's resolved call to action: its text plus the offer's WhatsApp link. */
export interface ResolvedPostCta extends BlogCta {
  href: string;
  code?: string;
  /** Ready for InnerPageLayout's `bookingCta` (the floating mobile pill). */
  floatingButton: { label: string; href: string };
}

/**
 * The post's own CTA, or null to use the site's generic one.
 *
 * Only while the post's offer is live: the CTA's whole point is the offer, so
 * when the offer is switched off (`active: false`) the band and the floating
 * pill fall back to "Book Stay" → booking engine without anyone editing the
 * post. The link is the same WhatsApp enquiry the offer block sends.
 */
export function postCta(post: BlogPost, offer: Offer | null): ResolvedPostCta | null {
  if (!post.cta || !offer) return null;
  const strings = blogStrings(post.locale).offers;
  const resolve = (v: LocalizedString) => (typeof v === "string" ? v : v[post.locale]);
  const href = buildWhatsAppUrl(offerEnquiryText(offer, resolve, strings));
  return {
    ...post.cta,
    href,
    code: offer.code,
    floatingButton: { label: post.cta.floating, href },
  };
}
