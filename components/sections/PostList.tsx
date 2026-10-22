// Server Component: post cards for /blog and the "From our blog" blocks.
import Image from "next/image";
import { LocalizedLink } from "@/components/common/LocalizedLink";
import { formatPostDate, type BlogStrings } from "@/lib/blog";
import type { BlogPostMeta } from "@/lib/types";

interface PostListProps {
  posts: BlogPostMeta[];
  strings: BlogStrings;
  /** `h2` on /blog, where the cards are the page; `h3` under a section heading. */
  titleLevel?: "h2" | "h3";
}

/**
 * The whole card is one link, so it is one tab stop and one screen-reader
 * announcement (the title); the "Read the guide" text is decoration within it.
 * Card titles are Inter, per Typography in CLAUDE.md.
 */
export function PostList({ posts, strings, titleLevel = "h2" }: PostListProps) {
  const Title = titleLevel;
  return (
    <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {posts.map((post) => (
        <li key={post.slug}>
          <LocalizedLink
            href={`/blog/${post.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-md bg-ivory shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={post.hero.src}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover motion-safe:transition-[scale] motion-safe:duration-300 motion-safe:group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-1 flex-col p-5 md:p-8">
              <p className="font-sans text-xs text-charcoal/70">
                <time dateTime={post.published}>{formatPostDate(post.published, post.locale)}</time>
              </p>
              <Title className="mt-2 font-sans text-lg font-semibold text-charcoal">{post.title}</Title>
              <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-charcoal/80">{post.excerpt}</p>
              <p className="mt-5 font-sans text-sm font-semibold text-accent-text underline-offset-[3px] group-hover:underline">
                {strings.blog.readPost} →
              </p>
            </div>
          </LocalizedLink>
        </li>
      ))}
    </ul>
  );
}

/** "From our blog" — a short band of related posts at the foot of a page. */
export function RelatedPosts({ posts, strings }: { posts: BlogPostMeta[]; strings: BlogStrings }) {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="related-posts" className="bg-sand py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 id="related-posts" className="mb-10 font-serif text-3xl md:text-4xl font-semibold text-charcoal">
          {strings.blog.related}
        </h2>
        <PostList posts={posts} strings={strings} titleLevel="h3" />
      </div>
    </section>
  );
}
