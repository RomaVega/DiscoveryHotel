import type {
  HomePageData, ContactData, ReviewsData,
  RoomsPageData, DiningPageData, SpaPageData, TransferPageData,
} from "./types";

import homeData from "@/content/home.json";
import contactData from "@/content/contact.json";
import reviewsData from "@/content/reviews.json";
import roomsData from "@/content/rooms.json";
import diningData from "@/content/dining.json";
import spaData from "@/content/spa.json";
import transferData from "@/content/transfer.json";

export function getHomePageData(): HomePageData {
  return homeData as HomePageData;
}

export function getContactData(): ContactData {
  return contactData as ContactData;
}

export function getReviewsData(): ReviewsData {
  return reviewsData as ReviewsData;
}

export function getRoomsPageData(): RoomsPageData {
  return roomsData as unknown as RoomsPageData;
}

export function getDiningPageData(): DiningPageData {
  return diningData as unknown as DiningPageData;
}

export function getSpaPageData(): SpaPageData {
  return spaData as unknown as SpaPageData;
}

export function getTransferPageData(): TransferPageData {
  return transferData as unknown as TransferPageData;
}
