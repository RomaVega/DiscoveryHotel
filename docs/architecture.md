# Architecture — Orlowsky Discovery Hotel Website

## Overview

This is a static marketing website for Orlowsky Discovery Hotel in Candidasa, Bali. It is built with Next.js 15 using the App Router and deployed to Vercel. All page content is stored in JSON files — there is no database, no CMS admin panel, and no backend server. Every page is generated at build time (Static Site Generation, or SSG), which means the site loads from a global CDN in milliseconds and has zero ongoing server costs.

The one exception to pure static rendering is the Gallery page, which renders the first 20 photos at build time and loads additional batches in the browser as the user scrolls to the bottom. This is handled entirely client-side by slicing a pre-bundled JSON array — no API calls are made at runtime.

The booking widget on the Home page is an `<iframe>` embed from GuestPro (`https://secure.guestpro.net/odch`). It is a third-party service and does not require any backend code on this project.

---

## Folder Structure

```
/
├── app/                          # Next.js App Router — one folder per page
│   ├── layout.tsx                # Root layout: fonts, Navbar, Footer, WhatsApp button
│   ├── page.tsx                  # Home (/)
│   ├── rooms/
│   │   └── page.tsx              # Rooms & Villas (/rooms)
│   ├── restaurant/
│   │   └── page.tsx              # Restaurant (/restaurant)
│   ├── spa/
│   │   └── page.tsx              # Spa & Wellness (/spa)
│   ├── gallery/
│   │   └── page.tsx              # Gallery (/gallery)
│   ├── excursions/
│   │   └── page.tsx              # Excursions (/excursions)
│   ├── transfer/
│   │   └── page.tsx              # Transfer (/transfer)
│   ├── rental/
│   │   └── page.tsx              # Rental (/rental)
│   ├── offers/
│   │   └── page.tsx              # Offers (/offers)
│   ├── about/
│   │   └── page.tsx              # About & Location (/about)
│   └── contact/
│       └── page.tsx              # Contact (/contact)
│
├── components/
│   ├── ui/                       # shadcn/ui components — auto-generated, never edit manually
│   ├── aceternity/               # Aceternity UI — copy-pasted source files, owned by this project
│   │   ├── parallax-hero.tsx     # Full-screen video/image hero with parallax scroll
│   │   ├── text-reveal.tsx       # Animated text reveal on scroll
│   │   └── spotlight-card.tsx    # Hover spotlight effect for room/offer cards
│   ├── layout/                   # Site-wide structural components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── whatsapp-button.tsx   # Floating animated WhatsApp button
│   ├── sections/                 # Page-level composed sections
│   │   ├── hero-video.tsx        # Full-screen video hero (Home)
│   │   ├── booking-widget.tsx    # GuestPro iframe wrapper (Home)
│   │   ├── room-card.tsx         # Room/villa display card (Rooms)
│   │   ├── gallery-grid.tsx      # Infinite-scroll photo grid (Gallery)
│   │   ├── offer-card.tsx        # Promotional offer card (Offers)
│   │   └── [other page sections] # One file per distinct section
│   └── common/                   # Small reusable primitives
│       ├── section-heading.tsx   # Consistent H2 + subtext pattern
│       └── image-card.tsx        # Aspect-ratio-locked image with caption
│
├── content/                      # All editable site content — JSON files
│   ├── home.json
│   ├── rooms.json
│   ├── restaurant.json
│   ├── spa.json
│   ├── gallery.json
│   ├── excursions.json
│   ├── transfer.json
│   ├── rental.json
│   ├── offers.json
│   ├── about.json
│   ├── contact.json
│   └── navigation.json           # Navbar links and footer links
│
├── lib/
│   ├── content.ts                # Typed helper functions to load JSON content
│   └── types.ts                  # TypeScript interfaces matching all JSON schemas
│
├── public/
│   ├── images/                   # All photography — see Asset Naming below
│   │   ├── hero/
│   │   ├── rooms/
│   │   │   ├── deluxe-cottage/
│   │   │   └── pool-villa/
│   │   ├── restaurant/
│   │   ├── spa/
│   │   ├── gallery/
│   │   ├── excursions/
│   │   ├── transfer/
│   │   ├── rental/
│   │   ├── offers/
│   │   ├── about/
│   │   └── logo/
│   └── videos/
│       ├── hero.mp4              # Primary video format (H.264)
│       └── hero.webm             # Fallback video format (VP9, smaller file size)
│
├── docs/                         # This documentation package
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## App Router Conventions

Each page lives in `app/[route]/page.tsx`. The root `app/layout.tsx` wraps every page with the `<Navbar>`, `<Footer>`, and `<WhatsAppButton>` so they appear automatically on all pages without any per-page wiring.

Page files should be kept thin — they import content from JSON, pass it as props to section components, and return a list of sections in order. All actual UI logic lives in `components/sections/`. This separation means you can reorder, add, or remove sections from a page by editing a single file, and you can test any section in isolation.

```typescript
// app/rooms/page.tsx — example of a thin page file
import roomsContent from "@/content/rooms.json";
import { PageHero } from "@/components/sections/page-hero";
import { RoomsGrid } from "@/components/sections/rooms-grid";
import { BookingCta } from "@/components/sections/booking-cta";

export default function RoomsPage() {
  return (
    <>
      <PageHero data={roomsContent.hero} />
      <RoomsGrid rooms={roomsContent.rooms} />
      <BookingCta data={roomsContent.cta} />
    </>
  );
}
```

---

## Rendering Strategy

| Route | Strategy | Reason |
|---|---|---|
| `/` | SSG | Content is static JSON; booking widget is a client-side iframe |
| `/rooms` | SSG | Two room types, content never changes between deployments |
| `/restaurant` | SSG | Static content |
| `/spa` | SSG | Static content |
| `/gallery` | SSG + Client hydration | First 20 photos at build time; infinite scroll runs in browser |
| `/excursions` | SSG | Static content |
| `/transfer` | SSG | Static content |
| `/rental` | SSG | Static content |
| `/offers` | SSG | Updated by redeployment when offers change |
| `/about` | SSG | Static content |
| `/contact` | SSG | Static content; WhatsApp link requires no server |

All pages use `export const dynamic = 'force-static'` (the Next.js 15 default for pages with no dynamic data). When content changes, you redeploy via Vercel — the site rebuilds in under 60 seconds and the new version goes live globally.

---

## Data Flow

Content flows in one direction: JSON file → TypeScript type → React component props → rendered HTML. Nothing reaches out to a database or external API at request time.

```
content/rooms.json
       ↓
lib/types.ts  (RoomsContent interface validates the shape)
       ↓
app/rooms/page.tsx  (imports JSON, passes to components)
       ↓
components/sections/rooms-grid.tsx  (renders from typed props)
       ↓
Vercel CDN  (fully static HTML, delivered globally)
```

The `lib/content.ts` file provides typed loader functions so TypeScript catches any mismatch between the JSON shape and what a component expects, before the site even builds.

```typescript
// lib/content.ts
import type { RoomsContent } from "./types";
import roomsData from "@/content/rooms.json";

export function getRoomsContent(): RoomsContent {
  return roomsData as RoomsContent;
}
```

---

## Asset Naming Conventions

All image files go inside `public/images/[section]/`. Use lowercase letters, numbers, and hyphens only — no spaces, no underscores, no uppercase.

**Naming pattern:** `[section]-[descriptor]-[sequence].[ext]`

Examples:
- `public/images/rooms/deluxe-cottage/deluxe-cottage-bedroom-01.jpg`
- `public/images/rooms/deluxe-cottage/deluxe-cottage-pool-01.jpg`
- `public/images/rooms/pool-villa/pool-villa-living-01.jpg`
- `public/images/gallery/gallery-01.jpg` through `gallery-30.jpg`
- `public/images/hero/hero-01.jpg` (fallback still image if video fails)
- `public/images/logo/logo-dark.svg` (on light backgrounds)
- `public/images/logo/logo-light.svg` (on dark/image backgrounds)

Video files go in `public/videos/`:
- `public/videos/hero.mp4` — H.264 encoded, 1920×1080 minimum, under 15 MB
- `public/videos/hero.webm` — VP9 encoded, same source, typically 30–40% smaller

In content JSON files, always reference images with paths starting from `/` (the public folder root):
```json
"image": "/images/rooms/deluxe-cottage/deluxe-cottage-bedroom-01.jpg"
```

---

## TypeScript Configuration

The project uses TypeScript in strict mode. The `tsconfig.json` sets `"strict": true`, which catches the most common class of bugs: accessing properties on potentially undefined values, passing the wrong shape to a component, forgetting to handle a null case.

The rule for this project is simple: the `any` type is never allowed. If TypeScript cannot infer a type, define it explicitly in `lib/types.ts`. This file is the single source of truth for all data shapes used across the project.

---

## Key Configuration Files

**`next.config.ts`** enables two important options:
- `images.formats: ['image/webp']` — Next.js automatically converts JPG/PNG to WebP and serves the right format per browser, reducing image size by 25–35% with no manual work.
- `images.domains` — if any images are hosted externally (not in `public/`), their domain must be listed here. For this project, all images live locally so this list stays empty.

**`tailwind.config.ts`** extends the default theme with the hotel's design tokens: the brand color `#4ca8b5`, the Cormorant Garamond and Inter font stacks, and any custom spacing or breakpoint values. All design decisions live here — never write raw hex codes inside component files.

---

## The GuestPro Booking Widget

The booking widget at `https://secure.guestpro.net/odch` is embedded as an HTML `<iframe>` inside a wrapper component (`components/sections/booking-widget.tsx`). The wrapper handles styling: background color matching the site, no visible border, appropriate dimensions.

**Important caveat:** Whether an iframe can be embedded on another domain depends on the server sending an `X-Frame-Options` or `Content-Security-Policy: frame-ancestors` header. If GuestPro blocks embedding, the iframe will silently fail to load. To verify: open browser DevTools → Network tab → load the booking page → look for `x-frame-options` in the response headers. If the value is `DENY` or `SAMEORIGIN`, contact GuestPro support and request that they whitelist your domain.

You **cannot** change the fonts, colors, or layout inside the iframe — that content is controlled by GuestPro's servers. You can only style the container around it. The widget will look identical to how it appears on the current Tilda site because it is the same iframe source.

**Fallback:** If GuestPro does not allow embedding, the booking widget section becomes a prominent "Book Now" button that opens `https://secure.guestpro.net/odch` in a new tab.
