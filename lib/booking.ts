/**
 * Where the booking CTAs point.
 *
 * `BOOKING_URL` was written out three times before this existed — twice in
 * `Navbar` and once as `bookingUrl` in `content/home.json`. Three copies of one
 * URL is three things to miss when the engine moves.
 */
export const BOOKING_URL = "https://secure.guestpro.net/odch";

/** The in-room dining menu. Was written out only in `DiningDetail`; it is a
    second CTA destination now, so it lives beside the engine's URL. */
export const MENU_URL = "https://secure.guestpro.net/odch/concierge/room-dining";

/**
 * The services the hotel sells that the booking engine does not handle.
 *
 * The engine books rooms. It does not book a dive, a treatment or a wedding,
 * so a "Book Now" pinned to the bottom of those pages sent people into a room
 * reservation form — and worse, contradicted the page's own correct CTAs,
 * which already open WhatsApp about the specific programme. `/weddings` and
 * `/transfer` had no correct path at all.
 *
 * Structural, so it lives here rather than in `content/` — these are the app's
 * own paths, not copy anyone edits. The wording is in `locales/*.json` under
 * `serviceCta`.
 */
export type ServiceKey =
  | "spa" | "dining" | "transfer" | "weddings"
  | "diving" | "excursions" | "carRental" | "events";

const SERVICE_BY_ROUTE: Readonly<Record<string, ServiceKey>> = {
  "/spa": "spa",
  "/dining": "dining",
  "/transfer": "transfer",
  "/weddings": "weddings",
  "/experiences/diving": "diving",
  "/experiences/excursions": "excursions",
  "/experiences/car-bike-rental": "carRental",
  "/experiences/events": "events",
};

/**
 * Services that have a real destination rather than a conversation.
 *
 * Most of these are enquiries — there is no engine that books a dive — but the
 * restaurant already publishes a menu, and sending someone to read it is a
 * better first step than asking them to message about a table when the
 * restaurant is quiet anyway.
 */
export const SERVICE_URL: Partial<Record<ServiceKey, string>> = {
  dining: MENU_URL,
};

/**
 * The service a route sells, or `null` for the routes the engine does serve —
 * `/`, `/rooms`, `/offers`, `/gallery` and the rest all book a room.
 *
 * The `/ru` prefix comes off first: the map holds locale-agnostic paths, and
 * without this every Russian route would fall through to the room engine.
 * Same normalisation `Navbar`'s `isActive` uses.
 */
export function serviceForRoute(pathname: string): ServiceKey | null {
  const route = pathname.replace(/^\/ru(?=\/|$)/, "") || "/";
  const trimmed = route.length > 1 ? route.replace(/\/$/, "") : route;
  return SERVICE_BY_ROUTE[trimmed] ?? null;
}
