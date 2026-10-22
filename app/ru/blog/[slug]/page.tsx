import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { Article } from "@/components/sections/Article";
import { PostCtaBand } from "@/components/sections/PostCtaBand";
import { blogStrings, getPost, postStaticParams } from "@/lib/blog";
import { postCta, postMetadata, postStructuredData } from "@/lib/blog-meta";
import { getActiveOffer, getContactData, getHomePageData } from "@/lib/content";
import { JsonLd } from "@/lib/jsonld";

const LOCALE = "ru" as const;

// Static export: every post is generated at build, and an unknown slug is a 404
// rather than an attempt to render on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return postStaticParams(LOCALE);
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return postMetadata(slug, LOCALE);
}

export default async function BlogPostRuPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug, LOCALE);
  const offer = getActiveOffer(post.offer);
  const cta = postCta(post, offer);
  const strings = blogStrings(LOCALE);
  const contact = getContactData();
  const { bookingCta } = getHomePageData();

  return (
    <InnerPageLayout contact={contact} bookingCta={cta?.floatingButton}>
      <JsonLd data={postStructuredData(slug, LOCALE)} />
      <Article post={post} strings={strings} offer={offer} />
      <PostCtaBand cta={cta} fallback={bookingCta} strings={strings} />
    </InnerPageLayout>
  );
}
