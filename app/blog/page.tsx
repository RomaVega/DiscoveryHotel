import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { BlogIndex } from "@/components/sections/BlogIndex";
import { blogStrings, getPosts } from "@/lib/blog";
import { blogIndexMetadata, blogIndexStructuredData } from "@/lib/blog-meta";
import { getContactData } from "@/lib/content";
import { JsonLd } from "@/lib/jsonld";

export const metadata = blogIndexMetadata("en");

export default function BlogPage() {
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={blogIndexStructuredData("en")} />
      <BlogIndex posts={getPosts("en")} strings={blogStrings("en")} />
    </InnerPageLayout>
  );
}
