/**
 * The booking engine's URL, in one place.
 *
 * It was written out three times — twice in `Navbar` (desktop bar and mobile
 * drawer) and once as `bookingUrl` in `content/home.json`. Three copies of one
 * URL is three things to miss when the engine moves; the JSON copy stays for
 * now because `BookingCtaData` is content-shaped, but every component-level
 * link should import this.
 */
export const BOOKING_URL = "https://secure.guestpro.net/odch";
