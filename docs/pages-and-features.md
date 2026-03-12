# Pages & Features — Orlowsky Discovery Hotel Website

Every page in this project follows the same pattern: a thin `page.tsx` file imports a JSON content file, passes data as props to section components, and returns those sections in order. The sections themselves handle all layout and animation logic. See `architecture.md` for the full data flow explanation.

---

## Home — `/`

**Purpose:** First impression, conversion gateway. Guests land here from search and social. The goal is to communicate luxury and place immediately, then funnel to booking.

**Sections, top to bottom:**

1. **Hero Video** (`components/sections/hero-video.tsx`) — Full-screen autoplay looping video with no controls. A muted `<video>` tag with both `.mp4` and `.webm` sources. The hotel name and tagline overlay the video with a Framer Motion fade-in on load. A static fallback image (from `public/images/hero/hero-01.jpg`) displays if the browser blocks autoplay. Implemented using the Aceternity `parallax-hero.tsx` component as the base layer.

2. **Booking Widget** (`components/sections/booking-widget.tsx`) — The GuestPro iframe embed (`https://secure.guestpro.net/odch`). Displayed in a full-width section with a neutral background matching the site palette. See `architecture.md` for notes on the iframe embedding caveat and fallback strategy.

3. **Introduction / About Teaser** — Two to three sentences introducing the hotel's character and location. Pulls from `home.json`. Uses the Aceternity `text-reveal.tsx` for the heading animation on scroll.

4. **Rooms Teaser** — Two cards (one per room type: Deluxe Cottage, Three Bedrooms Pool Villa) with a photo, name, one-line description, and a "View Rooms" link. Uses the Aceternity `spotlight-card.tsx` for the hover effect. Data from `home.json` (`roomsTeaser` key).

5. **Restaurant Teaser** — Full-width image with an overlaid text block. One headline, two sentences, link to `/restaurant`.

6. **Spa Teaser** — Mirror layout of the Restaurant teaser (image on opposite side for visual rhythm).

7. **Offers Strip** — Horizontal scrollable row of 2–3 active offer cards. Data from `home.json` (`featuredOffers` key), which mirrors a subset of `offers.json`. If no offers are active, this section is hidden via a conditional render.

8. **Location Block** — A static map image or a Google Maps embed (iframe), hotel address, and brief "How to reach us" text. Data from `home.json`.

**Data source:** `content/home.json`

**Rendering:** SSG. The GuestPro iframe loads client-side in the browser after the static HTML is served — this is expected behavior and does not affect Core Web Vitals scores for the rest of the page.

---

## Rooms & Villas — `/rooms`

**Purpose:** Allow guests to explore both room types in detail and understand the difference. The single-page scrollable layout means both room types are compared in one reading session.

**Sections, top to bottom:**

1. **Page Hero** — Static full-bleed image (not video), hotel name + "Rooms & Villas" subtitle. Consistent hero pattern used on all non-home pages.

2. **Deluxe Cottage Section** — Full description, amenities list, pricing note (or "from" price if applicable), and a horizontal photo gallery (3–5 images using a CSS scroll-snap carousel). Data from `rooms.json` under the `deluxeCottage` key.

3. **Three Bedrooms Pool Villa Section** — Same structure as above. Data from `rooms.json` under the `poolVilla` key.

4. **Booking CTA** — A prominent full-width section with a headline ("Ready to book?"), a short line of text, and a "Book Now" button linking to the GuestPro widget (either the same Home page section via anchor `/#booking`, or directly to `https://secure.guestpro.net/odch` in a new tab).

**Data source:** `content/rooms.json`

**Room JSON schema example:**
```json
{
  "deluxeCottage": {
    "name": "Deluxe Cottage",
    "tagline": "Intimate garden retreat with private terrace",
    "description": "Full paragraph description here...",
    "size": "45 sqm",
    "capacity": "2 adults",
    "priceFrom": "USD 120",
    "amenities": ["Air conditioning", "Free WiFi", "Private terrace", "Minibar"],
    "images": [
      "/images/rooms/deluxe-cottage/deluxe-cottage-bedroom-01.jpg",
      "/images/rooms/deluxe-cottage/deluxe-cottage-bathroom-01.jpg",
      "/images/rooms/deluxe-cottage/deluxe-cottage-terrace-01.jpg"
    ]
  }
}
```

---

## Restaurant — `/restaurant`

**Purpose:** Showcase the dining experience. Attract both hotel guests and external diners.

**Sections:**

1. **Page Hero** — Static full-bleed image, "Restaurant" title.
2. **Introduction** — Restaurant name (if it has a distinct name), concept description, cuisine type. Data from `restaurant.json`.
3. **Highlights Grid** — 3–4 featured dishes or atmosphere photos in a 2-column grid with short captions.
4. **Opening Hours & Info** — Table of meal periods (Breakfast, Lunch, Dinner), times, and a short note. Data from `restaurant.json`.
5. **Gallery Strip** — 4–6 food/atmosphere photos in a horizontal scroll. Uses `image-card.tsx`.
6. **Reservation CTA** — "Reserve a Table" button opening a WhatsApp link with a pre-filled message: "Hello, I would like to reserve a table at the restaurant."

**Data source:** `content/restaurant.json`

---

## Spa & Wellness — `/spa`

**Purpose:** Communicate the spa's treatments, atmosphere, and booking process.

**Sections:**

1. **Page Hero** — Static full-bleed image, "Spa & Wellness" title.
2. **Introduction** — Philosophy, approach, atmosphere description. Data from `spa.json`.
3. **Treatments Grid** — Cards for each treatment category (massage, body scrub, facial, etc.), each with a name, duration, price, and short description. Data from `spa.json` (`treatments` array).
4. **Gallery Strip** — 4–6 spa atmosphere photos.
5. **Booking CTA** — "Book a Treatment" WhatsApp button with pre-filled message.

**Data source:** `content/spa.json`

---

## Gallery — `/gallery`

**Purpose:** Showcase the property's photography. Acts as a visual portfolio.

**Implementation:** This is the only page with client-side interactivity beyond hover effects.

**How the infinite scroll works:** The `gallery.json` file contains an array of all 30 photo paths. The page component passes this full array to `GalleryGrid`. On first render (SSG), only the first 20 images are displayed. An `IntersectionObserver` watches a sentinel `<div>` at the bottom of the grid. When that div enters the viewport, the component increments an internal counter and renders the next 20 items from the array. Since the array is already in the browser (bundled with the page), no network request is made — it is a pure client-side slice operation.

**Sections:**

1. **Page Hero** — Minimal hero, just the title "Gallery" over a blurred background image.
2. **Photo Grid** (`components/sections/gallery-grid.tsx`) — Masonry or uniform grid layout. Each image opens in a full-screen lightbox on click, using the shadcn/ui `Dialog` component. Images are served via `next/image` for automatic WebP conversion and lazy loading.
3. **Scroll Sentinel** — An invisible `<div ref={sentinelRef}>` at the bottom of the grid. When it enters the viewport, the next 20 photos load. No button, no loading spinner — the transition is seamless. If all photos are loaded, the sentinel is removed from the DOM.

**Data source:** `content/gallery.json`

**Gallery JSON schema:**
```json
{
  "photos": [
    { "src": "/images/gallery/gallery-01.jpg", "alt": "Pool at sunset" },
    { "src": "/images/gallery/gallery-02.jpg", "alt": "Deluxe cottage bedroom" }
  ]
}
```

---

## Excursions — `/excursions`

**Purpose:** Showcase activities and day trips the hotel arranges for guests.

**Sections:**

1. **Page Hero** — Static image, "Excursions" title.
2. **Intro Text** — One paragraph about the hotel's approach to curated experiences.
3. **Excursion Cards Grid** — A card for each excursion: name, duration, difficulty or type, short description, photo. Data from `excursions.json` (`items` array). Uses `spotlight-card.tsx` for hover effect if the budget allows (see `component-library-rules.md` for Aceternity budget).
4. **Inquiry CTA** — "Ask About Excursions" WhatsApp button.

**Data source:** `content/excursions.json`

---

## Transfer — `/transfer`

**Purpose:** Explain airport and inter-island transfer services.

**Sections:**

1. **Page Hero** — Static image, "Transfer" title.
2. **Service Description** — How transfers work, available routes, vehicle types. Data from `transfer.json`.
3. **Route Cards** — Cards for each route (e.g., Ngurah Rai Airport → Candidasa, Ubud → Candidasa), with estimated time and price. Data from `transfer.json` (`routes` array).
4. **Booking CTA** — "Book a Transfer" WhatsApp button.

**Data source:** `content/transfer.json`

---

## Rental — `/rental`

**Purpose:** Showcase vehicle or equipment rental services (motorbike, car, bicycle — confirm the specific offerings when writing content).

**Sections:**

1. **Page Hero** — Static image, "Rental" title.
2. **Intro Text** — Brief description of the rental service.
3. **Vehicle/Item Cards** — Card per rental option: name, price per day, photo, basic specs or notes. Data from `rental.json` (`items` array).
4. **Inquiry CTA** — "Inquire About Rental" WhatsApp button.

**Data source:** `content/rental.json`

---

## Offers — `/offers`

**Purpose:** Display seasonal promotions, packages, and special rates.

**Sections:**

1. **Page Hero** — Static image, "Special Offers" title.
2. **Active Offers Grid** — Full cards for each active offer: headline, photo, short description, validity dates, conditions, and a "Book This Offer" WhatsApp button. Data from `offers.json` (`items` array).
3. **Terms Note** — A small-text block with booking terms or conditions if needed.

**Note on offer management:** When an offer expires, set its `active` field to `false` in `offers.json` and redeploy. The component filters out inactive offers automatically. Do not delete expired offer objects — keeping them as `active: false` maintains history and makes it easy to re-activate seasonal promotions.

**Data source:** `content/offers.json`

**Offer JSON schema:**
```json
{
  "items": [
    {
      "id": "early-bird-2025",
      "active": true,
      "title": "Early Bird Discount",
      "headline": "Book 30 days ahead and save 20%",
      "description": "Full description of the offer...",
      "validFrom": "2025-01-01",
      "validUntil": "2025-12-31",
      "image": "/images/offers/early-bird-01.jpg",
      "conditions": "Minimum 3 nights. Non-refundable."
    }
  ]
}
```

---

## About & Location — `/about`

**Purpose:** Tell the hotel's story, describe the location, and help guests understand how to get there.

**Sections:**

1. **Page Hero** — Static image, "About Orlowsky Discovery" title.
2. **Story Section** — 2–3 paragraphs about the hotel's history and philosophy. Data from `about.json`.
3. **Location Section** — Description of Candidasa, Bali; what makes the area special. Accompanied by a map (Google Maps iframe embed) and address details. Data from `about.json`.
4. **How to Get Here** — Practical information: nearest airport (Ngurah Rai, ~2.5 hours), driving directions, transfer service link (links to `/transfer`).
5. **Photo Strip** — 3–4 location/area photos.

**Data source:** `content/about.json`

---

## Contact — `/contact`

**Purpose:** Provide all contact methods and a direct inquiry path.

**Sections:**

1. **Page Hero** — Minimal hero, "Contact Us" title.
2. **Contact Details Block** — Phone, email, WhatsApp number, address, Google Maps link. Data from `contact.json`.
3. **WhatsApp CTA** — Prominent "Message Us on WhatsApp" button, styled as a primary call to action.
4. **Social Links** — Instagram, Facebook, or other active channels. Data from `contact.json`.
5. **Map Embed** — Reused from About page, or a more detailed embed zoomed into the property.

**Data source:** `content/contact.json`

---

## Navigation — All Pages

The `navigation.json` file drives both the Navbar and the Footer link lists. This means renaming a page or reordering navigation items requires editing one file only.

```json
{
  "navLinks": [
    { "label": "Rooms & Villas", "href": "/rooms" },
    { "label": "Restaurant", "href": "/restaurant" },
    { "label": "Spa & Wellness", "href": "/spa" },
    { "label": "Excursions", "href": "/excursions" },
    { "label": "Gallery", "href": "/gallery" },
    { "label": "Offers", "href": "/offers" },
    { "label": "About", "href": "/about" },
    { "label": "Contact", "href": "/contact" }
  ],
  "footerColumns": [
    {
      "heading": "Services",
      "links": [
        { "label": "Transfer", "href": "/transfer" },
        { "label": "Rental", "href": "/rental" }
      ]
    }
  ]
}
```
