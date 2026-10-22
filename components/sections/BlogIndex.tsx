// Server Component: the /blog listing.
import { PostList } from "@/components/sections/PostList";
import type { BlogStrings } from "@/lib/blog";
import type { BlogPostMeta } from "@/lib/types";

interface BlogIndexProps {
  posts: BlogPostMeta[];
  strings: BlogStrings;
}

export function BlogIndex({ posts, strings }: BlogIndexProps) {
  return (
    <section className="bg-sand pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <p className="font-sans text-sm uppercase tracking-widest text-accent-text">{strings.blog.label}</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium text-charcoal text-balance">
            {strings.blog.indexHeading}
          </h1>
          <p className="mt-4 font-sans text-lg leading-relaxed text-charcoal/80">{strings.blog.indexSubtext}</p>
        </header>
        {posts.length > 0 ? (
          <PostList posts={posts} strings={strings} />
        ) : (
          <p className="text-center font-sans text-charcoal/80">{strings.blog.empty}</p>
        )}
      </div>
    </section>
  );
}
