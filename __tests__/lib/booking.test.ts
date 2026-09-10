import { describe, it, expect } from "vitest";
import { serviceForRoute, BOOKING_URL } from "@/lib/booking";

/**
 * The booking engine books rooms and nothing else. A route that sells a dive,
 * a treatment or a wedding must not resolve to it — that shipped, and put a
 * permanent "Book Now" over pages whose own CTAs already pointed somewhere
 * correct.
 */
describe("serviceForRoute", () => {
  it.each([
    ["/spa", "spa"],
    ["/dining", "dining"],
    ["/transfer", "transfer"],
    ["/weddings", "weddings"],
    ["/experiences/diving", "diving"],
    ["/experiences/excursions", "excursions"],
    ["/experiences/car-bike-rental", "carRental"],
    ["/experiences/events", "events"],
  ])("%s sells %s, not a room", (route, expected) => {
    expect(serviceForRoute(route)).toBe(expected);
  });

  it.each(["/", "/rooms", "/offers", "/gallery", "/about", "/contact", "/faq", "/location", "/experiences"])(
    "%s books a room",
    (route) => {
      expect(serviceForRoute(route)).toBeNull();
    }
  );

  // Every service route is mirrored under /ru. Without stripping the prefix the
  // Russian pages all fall through to the room engine — the exact drift that
  // hid the missing button on the Russian home page.
  it.each([
    ["/ru/spa", "spa"],
    ["/ru/weddings", "weddings"],
    ["/ru/experiences/diving", "diving"],
    ["/ru/experiences/car-bike-rental", "carRental"],
  ])("%s resolves the same as its English route", (route, expected) => {
    expect(serviceForRoute(route)).toBe(expected);
  });

  it.each(["/ru", "/ru/", "/ru/rooms", "/ru/offers"])("%s books a room", (route) => {
    expect(serviceForRoute(route)).toBeNull();
  });

  it("tolerates a trailing slash", () => {
    expect(serviceForRoute("/spa/")).toBe("spa");
    expect(serviceForRoute("/ru/experiences/diving/")).toBe("diving");
  });

  it("does not match a route that merely starts with a service path", () => {
    expect(serviceForRoute("/spandex")).toBeNull();
    expect(serviceForRoute("/spa/pricing")).toBeNull();
  });

  it("keeps the engine URL pointing at the engine", () => {
    expect(BOOKING_URL).toContain("secure.guestpro.net");
  });
});
