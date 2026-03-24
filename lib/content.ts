import type {
  HomePageData, ContactData, ReviewsData,
  RoomsPageData, DiningPageData, SpaPageData, TransferPageData,
  DivingPageData, ExcursionsPageData, EventsPageData, CarRentalPageData,
  AboutPageData, ExperiencesHubData,
} from "./types";

import homeData from "@/content/home.json";
import contactData from "@/content/contact.json";
import reviewsData from "@/content/reviews.json";
import roomsData from "@/content/rooms.json";
import diningData from "@/content/dining.json";
import spaData from "@/content/spa.json";
import transferData from "@/content/transfer.json";
import divingData from "@/content/diving.json";
import excursionsData from "@/content/excursions.json";
import eventsData from "@/content/events.json";
import carRentalData from "@/content/car-rental.json";
import aboutData from "@/content/about.json";
import experiencesData from "@/content/experiences.json";

// Note: several JSON files contain extra fields (e.g. `bedrooms` in rooms.json)
// not yet reflected in lib/types.ts. `as unknown as Type` is used until
// types.ts is fully aligned with the JSON structure.

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

export function getDivingPageData(): DivingPageData {
  return divingData as unknown as DivingPageData;
}

export function getExcursionsPageData(): ExcursionsPageData {
  return excursionsData as unknown as ExcursionsPageData;
}

export function getEventsPageData(): EventsPageData {
  return eventsData as unknown as EventsPageData;
}

export function getCarRentalPageData(): CarRentalPageData {
  return carRentalData as unknown as CarRentalPageData;
}

export function getAboutPageData(): AboutPageData {
  return aboutData as unknown as AboutPageData;
}

export function getExperiencesHubData(): ExperiencesHubData {
  return experiencesData as unknown as ExperiencesHubData;
}
