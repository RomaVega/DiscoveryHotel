// Server Component: a blog post, fully rendered at build time.
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ArticleBody } from "@/components/sections/ArticleBody";
import { ArticleDistance } from "@/components/sections/ArticleDistance";
import { ArticleOffer } from "@/components/sections/ArticleOffer";
import { ArticleRaces } from "@/components/sections/ArticleRaces";
import { ArticleSchedule } from "@/components/sections/ArticleSchedule";
import { datePartsOf, formatPostDate, type BlogStrings } from "@/lib/blog";
import { lexMarkdown, tableOfContents } from "@/lib/markdown";
import type { BlogEvent, BlogPost, Locale, Offer } from "@/lib/types";
import { fill } from "@/lib/utils";

interface ArticleProps {
  post: BlogPost;
  strings: BlogStrings;
  /** The live offer `[[offer]]` places in the prose — `null` renders nothing there. */
  offer: Offer | null;
}

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 rounded-sm";
const CRUMB_LINK = `underline-offset-[3px] hover:underline ${FOCUS}`;
/** The reading column — see ArticleBody. */
const COLUMN = "mx-auto max-w-[42rem] px-6";

/**
 * The event's dates set large under the title — the first thing a reader
 * arriving from a search for the race wants, so it is answered over the photo.
 * The month is formatted beside a day, which puts Russian in the genitive
 * («12–13 декабря»).
 */
function EventDate({ event, locale }: { event: BlogEvent; locale: Locale }) {
  const a = datePartsOf(event.start, locale);
  const b = datePartsOf(event.end, locale);
  const oneDay = event.start === event.end;
  const month =
    a.month === b.month && a.year === b.year ? `${a.month} ${a.year}` : `${a.monthShort} – ${b.monthShort} ${b.year}`;
  return (
    <p className="mt-7 flex items-center gap-4 sm:gap-6 lg:mt-9">
      <span className="shrink-0 whitespace-nowrap font-serif text-[3.25rem] font-medium leading-none lining-nums sm:text-7xl lg:text-8xl">
        <time dateTime={event.start}>{a.day}</time>
        {!oneDay && (
          <>
            –<time dateTime={event.end}>{b.day}</time>
          </>
        )}
      </span>
      <span aria-hidden="true" className="w-px shrink-0 self-stretch bg-logo-gold" />
      <span className="min-w-0 font-sans text-xs font-medium uppercase leading-relaxed tracking-[0.15em] sm:text-sm sm:tracking-[0.2em]">
        <span className="block">{month}</span>
        <span className="block text-balance text-white/85">{event.place}</span>
      </span>
    </p>
  );
}

/**
 * Layout of a post. The hero is the event itself: its photo edge to edge, with
 * the title and the dates set large beside it, so the answer to "when" is above
 * the fold before a word of the text. Text runs at `max-w-[42rem]` (~70
 * characters a line at 18px); photos step out of it, and blocks named in
 * `bleed` span the page.
 */
export function Article({ post, strings, offer }: ArticleProps) {
  const s = strings.blog;
  const toc = tableOfContents(lexMarkdown(post.body));
  const published = formatPostDate(post.published, post.locale);
  const updated = post.updated !== post.published ? formatPostDate(post.updated, post.locale) : null;

  return (
    <article className="bg-sand pb-16 md:pb-24">
      {/*
        Two compositions. Below lg the photo sits under the navbar (square on
        phones, 16:10 on tablets) and melts into espresso, and the title is set
        on that dark panel: a phone crop puts the subject (the temple gates)
        exactly where an overlaid title would land. From lg the photo fills the
        hero, cropped from the left, and the text sits bottom right, clear of a
        subject in the left half. A hero photo for a post should have its
        subject left of centre.
      */}
      <header className="relative isolate overflow-hidden bg-espresso pt-14 text-white lg:flex lg:h-[88svh] lg:min-h-[36rem] lg:max-h-[60rem] lg:flex-col lg:justify-end lg:pt-0">
        <figure className="relative aspect-square max-h-[70svh] w-full sm:aspect-[16/10] lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto lg:max-h-none">
          <Image src={post.hero.src} alt={post.hero.alt} fill priority sizes="100vw" className="object-cover lg:object-right" />
          {/* White text needs a dark ground whatever the photo does. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/0 via-50% lg:bg-[linear-gradient(to_top,rgb(0_0_0/0.55),transparent_50%),linear-gradient(to_left,rgb(0_0_0/0.62),rgb(0_0_0/0.45)_45%,transparent_78%)]"
          />
          {post.hero.credit && (
            <figcaption className="absolute right-3 top-3 rounded-sm bg-black/50 px-2 py-0.5 font-sans text-[11px] text-white sm:right-5 lg:bottom-3 lg:top-auto lg:bg-transparent lg:p-0 lg:text-white/80">
              {post.hero.credit}
            </figcaption>
          )}
        </figure>

        <div className="relative mx-auto -mt-16 w-full max-w-7xl px-6 pb-12 sm:-mt-20 lg:mt-0 lg:px-10 lg:pb-20">
          <div className="lg:ml-auto lg:max-w-[36rem]">
            <nav aria-label="Breadcrumb" className="font-sans text-sm text-white text-shadow-subtle">
              <ol className="flex flex-wrap items-center gap-x-2">
                <li><LocalizedLink href="/" className={CRUMB_LINK}>{s.home}</LocalizedLink></li>
                <li aria-hidden="true">/</li>
                <li><LocalizedLink href="/blog" className={CRUMB_LINK}>{s.label}</LocalizedLink></li>
              </ol>
            </nav>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] text-balance text-shadow-subtle sm:text-5xl lg:text-[3.5rem]">
              {post.title}
            </h1>
            {post.event && <EventDate event={post.event} locale={post.locale} />}
          </div>
        </div>
      </header>

      <div className={`${COLUMN} pt-12 md:pt-16`}>
        {post.draft && (
          // Editor-facing, so English on both locales. Never reaches orlowsky.id:
          // production builds leave drafts out (SHOW_DRAFTS in lib/blog.ts).
          <p role="note" className="mb-8 rounded-md border border-charcoal/20 bg-parchment px-4 py-3 font-sans text-sm text-charcoal">
            <strong className="font-semibold">Draft.</strong> Visible on previews only. Set{" "}
            <code className="font-mono">draft: false</code> in the post to publish it.
          </p>
        )}
        <p className="font-serif text-2xl leading-snug text-pretty text-charcoal md:text-[1.75rem]">{post.excerpt}</p>
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

        {post.keyFacts && (
          <aside aria-labelledby="key-facts" className="mt-10 rounded-md border border-charcoal/10 bg-ivory p-6 md:p-8">
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
                      className={`font-sans text-sm font-semibold text-accent-text underline underline-offset-[3px] hover:decoration-2 ${FOCUS}`}
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
      </div>

      <ArticleBody
        markdown={post.body}
        bleed={["races"]}
        slots={{
          offer: offer && <ArticleOffer offer={offer} locale={post.locale} strings={strings} />,
          distance: post.distance && <ArticleDistance data={post.distance} />,
          races: post.races && <ArticleRaces races={post.races} locale={post.locale} strings={strings} />,
          schedule: post.schedule && <ArticleSchedule days={post.schedule} locale={post.locale} strings={strings} />,
        }}
      />

      <div className={COLUMN}>
        {post.faq.length > 0 && (
          <section aria-labelledby="faq" className="mt-16">
            <h2 id="faq" className="scroll-mt-28 font-serif text-3xl md:text-4xl font-semibold text-charcoal">{s.faq}</h2>
            {/*
              Native <details> sharing one `name`: opening a question closes the
              one that was open, with no JavaScript. Answers stay in the HTML, so
              search engines read them and the browser's find-in-page opens the
              match. Browsers without exclusive-<details> support simply allow
              several open at once. Looks like the /faq page's cards; answers are
              charcoal, not that page's `stone` (3.43:1 fails AA at body size).
              No height animation (Animation Rules) — the answer fades in.
            */}
            <div className="mt-6 space-y-3">
              {post.faq.map((item) => (
                <details key={item.q} name="post-faq" className="group rounded-md bg-ivory shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                    <span className="font-sans text-base font-semibold text-charcoal">{item.q}</span>
                    <ChevronDown
                      aria-hidden="true"
                      size={18}
                      className="shrink-0 text-stone motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <p className="px-5 pb-5 font-sans md:text-lg leading-relaxed text-pretty text-charcoal motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200">
                    {item.a}
                  </p>
                </details>
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
