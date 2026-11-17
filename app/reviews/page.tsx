import { getContactData, getGuestReviewsPageData, getHomePageData, getRatingAggregates } from "@/lib/content";
import { getGuestReviews, getReviewThemes, inLocale } from "@/lib/guest-reviews";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { ReviewsOverview } from "@/components/sections/ReviewsOverview";
import { ReviewThemes } from "@/components/sections/ReviewThemes";
import { ReviewWall } from "@/components/sections/ReviewWall";
import { ReviewInvite } from "@/components/sections/ReviewInvite";
import { BookingCta } from "@/components/sections/BookingCta";
import { SITE_URL } from "@/lib/site";
import { JsonLd, breadcrumbs, webPage } from "@/lib/jsonld";

const TITLE = "Guest Reviews — Orlowsky Discovery Hotel, Candidasa, Bali";
const DESCRIPTION = "Real guest reviews of Orlowsky Discovery Hotel from Google, Booking.com and Agoda, copied word for word — with the hotel's scores on every platform.";
const OG_IMAGE = `${SITE_URL}/images/gallery/orlowsky-hotel-garden-cottages-aerial.webp`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/reviews`,
    languages: {
      "en": `${SITE_URL}/reviews`,
      "ru": `${SITE_URL}/ru/reviews`,
      "x-default": `${SITE_URL}/reviews`,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/reviews`,
    images: [{ url: OG_IMAGE, width: 1152, height: 864 }],
  },
};

export default function ReviewsPage() {
  const data = getGuestReviewsPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      {/* No Review or AggregateRating markup: these reviews and scores come from
          other sites, which Google's review-snippet rules forbid marking up. */}
      <JsonLd data={[
        webPage({ path: "/reviews", name: TITLE, description: DESCRIPTION, image: OG_IMAGE, locale: "en" }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Reviews", path: "/reviews" },
        ]),
      ]} />
      <PageHero
        image="/images/gallery/orlowsky-hotel-garden-pathway-lanterns.webp"
        imageDesktop="/images/gallery/orlowsky-hotel-garden-cottages-aerial.webp"
        imageAlt={inLocale(data.heroAlt, "en")}
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <ReviewsOverview aggregates={getRatingAggregates()} locale="en" />
      <ReviewThemes copy={data.themes} themes={getReviewThemes("en")} locale="en" />
      <ReviewWall copy={data.wall} reviews={getGuestReviews("en")} />
      <ReviewInvite data={data.invite} />
      <BookingCta data={getHomePageData().bookingCta} />
    </InnerPageLayout>
  );
}
