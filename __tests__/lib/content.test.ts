import { describe, it, expect } from "vitest";
import { getHomePageData, getContactData } from "@/lib/content";

describe("getHomePageData()", () => {
  it("returns an object", () => {
    expect(getHomePageData()).toBeDefined();
  });

  it("has all required top-level keys", () => {
    const data = getHomePageData();
    expect(data).toHaveProperty("hero");
    expect(data).toHaveProperty("welcome");
    expect(data).toHaveProperty("roomsPreview");
    expect(data).toHaveProperty("amenities");
    expect(data).toHaveProperty("experiences");
    expect(data).toHaveProperty("offers");
    expect(data).toHaveProperty("galleryPreview");
    expect(data).toHaveProperty("bookingCta");
  });

  it("hero has required fields", () => {
    const { hero } = getHomePageData();
    expect(hero).toHaveProperty("titleLine1");
    expect(hero).toHaveProperty("titleLine2");
    expect(hero).toHaveProperty("titleLine3");
    expect(hero).toHaveProperty("image");
    expect(hero).toHaveProperty("imageAlt");
  });

  it("roomsPreview.rooms is a non-empty array", () => {
    const { roomsPreview } = getHomePageData();
    expect(Array.isArray(roomsPreview.rooms)).toBe(true);
    expect(roomsPreview.rooms.length).toBeGreaterThan(0);
  });

  it("each room has required fields", () => {
    const { roomsPreview } = getHomePageData();
    roomsPreview.rooms.forEach((room) => {
      expect(room).toHaveProperty("title");
      expect(room).toHaveProperty("image");
      expect(room).toHaveProperty("href");
    });
  });

  it("offers.offers is an array", () => {
    const { offers } = getHomePageData();
    expect(Array.isArray(offers.offers)).toBe(true);
  });

  it("each offer has an active boolean", () => {
    const { offers } = getHomePageData();
    offers.offers.forEach((offer) => {
      expect(typeof offer.active).toBe("boolean");
    });
  });

  it("galleryPreview.images is a non-empty array", () => {
    const { galleryPreview } = getHomePageData();
    expect(Array.isArray(galleryPreview.images)).toBe(true);
    expect(galleryPreview.images.length).toBeGreaterThan(0);
  });

  it("every gallery image has src and alt", () => {
    const { galleryPreview } = getHomePageData();
    galleryPreview.images.forEach((img) => {
      expect(typeof img.src).toBe("string");
      expect(typeof img.alt).toBe("string");
    });
  });
});

describe("getContactData()", () => {
  it("returns an object", () => {
    expect(getContactData()).toBeDefined();
  });

  it("has required fields", () => {
    const data = getContactData();
    expect(data).toHaveProperty("hotelName");
    expect(data).toHaveProperty("stars");
    expect(data).toHaveProperty("address");
    expect(data).toHaveProperty("email");
    expect(data).toHaveProperty("whatsapp");
    expect(data).toHaveProperty("socials");
    expect(data).toHaveProperty("googleMapsUrl");
    expect(data).toHaveProperty("coordinates");
  });

  it("stars is a positive number", () => {
    const { stars } = getContactData();
    expect(typeof stars).toBe("number");
    expect(stars).toBeGreaterThan(0);
  });

  it("address is a non-empty array of strings", () => {
    const { address } = getContactData();
    expect(Array.isArray(address)).toBe(true);
    expect(address.length).toBeGreaterThan(0);
    address.forEach((line) => expect(typeof line).toBe("string"));
  });

  it("coordinates has lat and lng", () => {
    const { coordinates } = getContactData();
    expect(typeof coordinates.lat).toBe("number");
    expect(typeof coordinates.lng).toBe("number");
  });

  it("whatsappContacts each have number, locale, and greeting", () => {
    const { whatsappContacts } = getContactData();
    expect(Array.isArray(whatsappContacts)).toBe(true);
    whatsappContacts.forEach((c) => {
      expect(typeof c.number).toBe("string");
      expect(["ru", "en", "all"]).toContain(c.locale);
      expect(typeof c.greeting).toBe("string");
    });
  });
});
