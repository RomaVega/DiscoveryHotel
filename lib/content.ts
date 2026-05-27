import type {
  HomePageData, ContactData, ReviewsData,
  RoomsPageData, DiningPageData, SpaPageData, TransferPageData,
  DivingPageData, ExcursionsPageData, EventsPageData, CarRentalPageData,
  AboutPageData, ExperiencesHubData,
} from "./types";
import {
  homePageSchema, contactSchema, reviewsSchema,
  roomsPageSchema, diningPageSchema, spaPageSchema, transferPageSchema,
  divingPageSchema, excursionsPageSchema, eventsPageSchema, carRentalPageSchema,
  aboutPageSchema, experiencesHubSchema,
} from "./validation";

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

export function getHomePageData(): HomePageData {
  return homePageSchema.parse(homeData);
}

export function getContactData(): ContactData {
  return contactSchema.parse(contactData);
}

export function getReviewsData(): ReviewsData {
  return reviewsSchema.parse(reviewsData);
}

export function getRoomsPageData(): RoomsPageData {
  return roomsPageSchema.parse(roomsData);
}

export function getDiningPageData(): DiningPageData {
  return diningPageSchema.parse(diningData);
}

export function getSpaPageData(): SpaPageData {
  return spaPageSchema.parse(spaData);
}

export function getTransferPageData(): TransferPageData {
  return transferPageSchema.parse(transferData);
}

export function getDivingPageData(): DivingPageData {
  return divingPageSchema.parse(divingData);
}

export function getExcursionsPageData(): ExcursionsPageData {
  return excursionsPageSchema.parse(excursionsData);
}

export function getEventsPageData(): EventsPageData {
  return eventsPageSchema.parse(eventsData);
}

export function getCarRentalPageData(): CarRentalPageData {
  return carRentalPageSchema.parse(carRentalData);
}

export function getAboutPageData(): AboutPageData {
  return aboutPageSchema.parse(aboutData);
}

export function getExperiencesHubData(): ExperiencesHubData {
  return experiencesHubSchema.parse(experiencesData);
}
