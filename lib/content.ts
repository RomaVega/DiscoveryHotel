import type { HomePageData, ContactData, ReviewsData } from "./types";

import homeData from "@/content/home.json";
import contactData from "@/content/contact.json";
import reviewsData from "@/content/reviews.json";

export function getHomePageData(): HomePageData {
  return homeData as HomePageData;
}

export function getContactData(): ContactData {
  return contactData as ContactData;
}

export function getReviewsData(): ReviewsData {
  return reviewsData as ReviewsData;
}
