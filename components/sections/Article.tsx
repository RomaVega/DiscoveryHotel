// Server Component: a blog post, fully rendered at build time.
import Image from "next/image";
import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ArticleBody } from "@/components/sections/ArticleBody";
import { ArticleDistance } from "@/components/sections/ArticleDistance";
import { ArticleOffer } from "@/components/sections/ArticleOffer";
import { formatPostDate, type BlogStrings } from "@/lib/blog";
import { lexMarkdown, tableOfContents } from "@/lib/markdown";
import type { BlogPost, Offer } from "@/lib/types";
import { fill } from "@/lib/utils";

interface ArticleProps {
  post: BlogPost;
  strings: BlogStrings;
  /** The live offer `[[offer]]` places in the prose — `null` renders nothing there. */
  offer: Offer | null;
}

const CRUMB_LINK =
  "underline-offset-[3px] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 rounded-sm";

/**
 * Layout of a post. Unlike the other inner pages there is no full-screen
 * PageHero: a reader arrives from search wanting the answer, so the title,
 * the summary and the key facts sit above the fold and the photo follows.
 * Text runs at `max-w-3xl` (~70 characters a line); the photo gets more room.
 */
export function Article({ post, strings, offer }: ArticleProps) {
  const s = strings.blog;
  const toc = tableOfContents(lexMarkdown(post.body));
  const published = formatPostDate(post.published, post.locale);
  const updated = post.updated !== post.published ? formatPostDate(post.updated, post.locale) : null;

  return (
    <article className="bg-sand pt-28 md:pt-36 pb-16 md:pb-24">
      <header className="mx-auto max-w-3xl px-6">
        {post.draft && (
          // Editor-facing, so English on both locales. Never reaches orlowsky.id:
          // production builds leave drafts out (SHOW_DRAFTS in lib/blog.ts).
          <p role="note" className="mb-6 rounded-md border border-charcoal/20 bg-parchment px-4 py-3 font-sans text-sm text-charcoal">
            <strong className="font-semibold">Draft.</strong> Visible on previews only. Set{" "}
            <code className="font-mono">draft: false</code> in the post to publish it.
          </p>
        )}
        <nav aria-label="Breadcrumb" className="font-sans text-sm text-charcoal/70">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li><LocalizedLink href="/" className={CRUMB_LINK}>{s.home}</LocalizedLink></li>
            <li aria-hidden="true">/</li>
            <li><LocalizedLink href="/blog" className={CRUMB_LINK}>{s.label}</LocalizedLink></li>
          </ol>
        </nav>
        <h1 className="mt-5 font-serif text-4xl md:text-5xl font-medium leading-tight text-charcoal text-balance">
          {post.title}
        </h1>
        <p className="mt-5 font-sans text-lg leading-relaxed text-charcoal/80">{post.excerpt}</p>
        <div className="mt-6 font-sans text-sm text-charcoal/70">
          <p>{fill(s.byline, { author: post.author })}</p>
          <p className="mt-1 flex flex-wrap gap-x-3">
            <time dateTime={post.published}>{fill(s.published, { date: published })}</time>
            {updated && (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={post.updated}>{fill(s.updated, { date: updated })}</time>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{fill(s.readingTime, { minutes: String(post.readingMinutes) })}</span>
          </p>
        </div>
      </header>

      <figure className="mx-auto mt-10 max-w-5xl sm:px-6">
        <Image
          src={post.hero.src}
          alt={post.hero.alt}
          width={post.hero.width}
          height={post.hero.height}
          priority
          sizes="(max-width: 1024px) 100vw, 976px"
          className="h-auto max-h-[70vh] w-full object-cover sm:rounded-md"
        />
      </figure>

      <div className="mx-auto mt-10 max-w-3xl px-6">
        {post.keyFacts && (
          <aside aria-labelledby="key-facts" className="rounded-md border border-charcoal/10 bg-ivory p-6 md:p-8">
            <h2 id="key-facts" className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-text">
              {post.keyFacts.heading}
            </h2>
            <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-[max-content_1fr]">
              {post.keyFacts.items.map((item) => (
                <div key={item.label} className="contents">
                  <dt className="font-sans text-sm font-semibold text-charcoal">{item.label}</dt>
                  <dd className="-mt-2 font-sans text-sm leading-relaxed text-charcoal sm:mt-0">{item.value}</dd>
                </div>
              ))}
            </dl>
            {post.keyFacts.links.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                {post.keyFacts.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm font-semibold text-accent-text underline underline-offset-[3px] hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 rounded-sm"
                    >
                      {link.label}
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {post.factsChecked && (
              <p className="mt-4 font-sans text-xs leading-relaxed text-charcoal/70">
                {fill(s.factsChecked, { date: formatPostDate(post.factsChecked, post.locale) })}
              </p>
            )}
          </aside>
        )}

        {toc.length > 2 && (
          <nav aria-labelledby="toc" className="mt-10">
            <h2 id="toc" className="font-sans text-sm font-semibold text-charcoal">{s.toc}</h2>
            <ol className="mt-3 space-y-1.5 border-l border-charcoal/15 pl-4 font-sans text-sm">
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className={`text-accent-text ${CRUMB_LINK}`}>{h.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <ArticleBody
          markdown={post.body}
          slots={{
            offer: offer && <ArticleOffer offer={offer} locale={post.locale} strings={strings} />,
            distance: post.distance && <ArticleDistance data={post.distance} />,
          }}
        />

        {post.faq.length > 0 && (
          <section aria-labelledby="faq" className="mt-16">
            <h2 id="faq" className="scroll-mt-28 font-serif text-3xl md:text-4xl font-medium text-charcoal">{s.faq}</h2>
            <div className="mt-6 divide-y divide-charcoal/10 border-y border-charcoal/10">
              {post.faq.map((item) => (
                <div key={item.q} className="py-5">
                  <h3 className="font-sans text-base font-semibold text-charcoal">{item.q}</h3>
                  <p className="mt-2 font-sans leading-relaxed text-charcoal">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="mt-12 font-sans text-sm">
          <LocalizedLink href="/blog" className={`font-semibold text-accent-text ${CRUMB_LINK} underline`}>
            ← {s.allPosts}
          </LocalizedLink>
        </p>
      </div>
    </article>
  );
}
