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

const TITLE = "Отзывы Гостей — Orlowsky Discovery Hotel, Чандидаса, Бали";
const DESCRIPTION = "Настоящие отзывы гостей Orlowsky Discovery Hotel с Google, Booking.com и Agoda — дословно, с оценками отеля на каждой площадке.";
const OG_IMAGE = `${SITE_URL}/images/gallery/orlowsky-hotel-garden-cottages-aerial.webp`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/ru/reviews`,
    languages: {
      "en": `${SITE_URL}/reviews`,
      "ru": `${SITE_URL}/ru/reviews`,
      "x-default": `${SITE_URL}/reviews`,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/ru/reviews`,
    images: [{ url: OG_IMAGE, width: 1152, height: 864 }],
  },
};

export default function ReviewsRuPage() {
  const data = getGuestReviewsPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      {/* No Review or AggregateRating markup: these reviews and scores come from
          other sites, which Google's review-snippet rules forbid marking up. */}
      <JsonLd data={[
        webPage({ path: "/ru/reviews", name: TITLE, description: DESCRIPTION, image: OG_IMAGE, locale: "ru" }),
        breadcrumbs([
          { name: "Главная", path: "/ru" },
          { name: "Отзывы", path: "/ru/reviews" },
        ]),
      ]} />
      <PageHero
        image="/images/gallery/orlowsky-hotel-garden-pathway-lanterns.webp"
        imageDesktop="/images/gallery/orlowsky-hotel-garden-cottages-aerial.webp"
        imageAlt={inLocale(data.heroAlt, "ru")}
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <ReviewsOverview aggregates={getRatingAggregates()} locale="ru" />
      <ReviewThemes copy={data.themes} themes={getReviewThemes("ru")} locale="ru" />
      <ReviewWall copy={data.wall} reviews={getGuestReviews("ru")} />
      <ReviewInvite data={data.invite} />
      <BookingCta data={getHomePageData().bookingCta} />
    </InnerPageLayout>
  );
}
