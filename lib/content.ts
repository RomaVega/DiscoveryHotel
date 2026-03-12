import type { HomePageData, ContactData } from "./types";

import homeData from "@/content/home.json";
import contactData from "@/content/contact.json";

export function getHomePageData(): HomePageData {
  return homeData as HomePageData;
}

export function getContactData(): ContactData {
  return contactData as ContactData;
}
