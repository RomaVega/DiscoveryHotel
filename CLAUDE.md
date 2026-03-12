# CLAUDE.md — Orlowsky Discovery Hotel Website

## Project Overview

Static marketing website for Orlowsky Discovery Hotel in Candidasa, Bali. Built with **Next.js 15 (App Router)**, deployed to **Vercel**. All content lives in JSON files — no database, no CMS, no backend. Every page is statically generated (SSG) except Gallery, which hydrates client-side for infinite scroll.

## Quick Commands

```bash
npm run build          # Build the site — must pass with zero errors before deploy
npm run start          # Serve locally at localhost:3000
npx tsc --noEmit       # Type-check without emitting
npm run lint           # ESLint — must pass with zero warnings
npm run check:bundle   # Verify JS bundle stays under 500 KB (see Performance section)
```

## Local Verification Workflow

Before pushing to `main`, always run these in order:

```bash
npx tsc --noEmit       # 1. Types OK?
npm run lint           # 2. Lint clean?
npm run build          # 3. Build succeeds?
npm run start          # 4. Spot-check at localhost:3000
```

If any step fails, fix it before pushing. Vercel will reject broken builds, but catching locally saves the 60–90s deploy cycle.

## Architecture Rules

- **Pages are thin.** `app/[route]/page.tsx` imports JSON, passes props to section components, returns sections in order. All UI logic lives in `components/sections/`.
- **Data flows one direction:** `content/*.json` → `lib/types.ts` → page → section component → static HTML → Vercel CDN.
- **No `any` type.** TypeScript strict mode is enforced. Define all types in `lib/types.ts`.
- **No runtime API calls** (except the GuestPro iframe and gallery client-side array slicing).
- **No `"use client"` unless required.** Default to Server Components. Only add `"use client"` when the component uses hooks, browser APIs, or event handlers. Document the reason in a comment at the top of the file:
  ```tsx
  "use client"; // Client: uses IntersectionObserver for infinite scroll
  ```

## Folder Structure

```
app/                    # One folder per route, thin page files only
components/
  ui/                   # shadcn/ui — auto-generated, NEVER edit manually
  aceternity/           # 3 copy-pasted Aceternity components (can modify)
  layout/               # Navbar, Footer, WhatsAppButton (site-wide)
  sections/             # Page-level composed sections (HeroVideo, RoomsGrid, etc.)
  common/               # Small reusable primitives (SectionHeading, ImageCard, PrimaryButton)
content/                # All editable site content — JSON files
lib/
  content.ts            # Typed JSON loader functions
  types.ts              # Single source of truth for all data shapes
  validation.ts         # Runtime JSON shape checks (see Error Handling section)
public/images/          # All photography, organized by section
public/videos/          # hero.mp4 and hero.webm
```

## Canonical Patterns

### Page File (app/rooms/page.tsx)

Every page follows this exact shape. No exceptions.

```tsx
import { getRooms } from "@/lib/content";
import { HeroImage } from "@/components/sections/hero-image";
import { RoomsGrid } from "@/components/sections/rooms-grid";
import { BookingCta } from "@/components/sections/booking-cta";

export const metadata = {
  title: "Rooms & Suites | Orlowsky Discovery Hotel",
  description: "Five room categories set among tropical gardens in Candidasa, East Bali.",
};

export default function RoomsPage() {
  const rooms = getRooms();

  return (
    <main>
      <HeroImage
        src="/images/rooms/rooms-hero.jpg"
        alt="Aerial view of the hotel's garden villas"
        title="Rooms & Suites"
      />
      <RoomsGrid rooms={rooms} />
      <BookingCta />
    </main>
  );
}
```

Key points: page imports data, passes it as props, composes sections in reading order. No state, no effects, no styling logic.

### Section Component (components/sections/rooms-grid.tsx)

```tsx
import { Room } from "@/lib/types";
import { SectionHeading } from "@/components/common/section-heading";
import { RoomCard } from "@/components/common/room-card";
import { FadeIn } from "@/components/common/fade-in";

interface RoomsGridProps {
  rooms: Room[];
}

export function RoomsGrid({ rooms }: RoomsGridProps) {
  return (
    <section className="py-24 bg-sand">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading label="Accommodation" title="Find Your Sanctuary" />
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, i) => (
            <FadeIn key={room.slug} delay={Math.min(i * 0.1, 0.5)}>
              <RoomCard room={room} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Key points: typed props interface, uses design tokens (`bg-sand`, `max-w-7xl`, `py-24`), stagger delay capped at 0.5s.

### JSON Content Loader (lib/content.ts)

```tsx
import roomsData from "@/content/rooms.json";
import { Room } from "@/lib/types";
import { validateArray } from "@/lib/validation";

export function getRooms(): Room[] {
  return validateArray<Room>(roomsData, "rooms");
}
```

### Type Definition (lib/types.ts)

```tsx
export interface Room {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;       // path starting with /images/
  alt: string;         // descriptive alt text, never empty
  priceFrom: number;
  features: string[];
  maxGuests: number;
}
```

Every JSON file has a corresponding interface here. If you add a field to JSON, add it to the type first.

## Error Handling

### Malformed JSON Content

`lib/validation.ts` provides runtime guards that run at build time (during static generation). If a JSON file has missing or invalid fields, the build fails immediately with a clear message instead of producing a broken page.

```tsx
export function validateArray<T>(data: unknown, label: string): T[] {
  if (!Array.isArray(data)) {
    throw new Error(`[Content Error] "${label}" expected an array, got ${typeof data}`);
  }
  if (data.length === 0) {
    throw new Error(`[Content Error] "${label}" array is empty — is the JSON file populated?`);
  }
  return data as T[];
}
```

### Missing Images

If an image path in JSON doesn't exist in `public/`, Next.js will serve a 404. To catch this during development, run:

```bash
node scripts/check-images.js
```

This script cross-references all image paths in `content/*.json` against `public/images/` and reports missing files.

### GuestPro Iframe Fallback

The booking widget loads in an iframe. If it fails (X-Frame-Options, network error, or timeout > 5s), render a "Book Now" button that opens `https://secure.guestpro.net/odch` in a new tab. Never show a broken iframe to a guest.

## Component Library — Three Sources Only

1. **shadcn/ui** — all functional UI primitives (Button, Card, Dialog, NavigationMenu, Sheet, Separator, Badge). Install via `npx shadcn@latest add [name]`. Never edit files in `components/ui/` directly; wrap them in custom components instead.
2. **Aceternity UI** — exactly 3 components, copy-pasted into `components/aceternity/`:
   - `parallax-hero.tsx` — Home page hero parallax (adapted for `<video>`)
   - `text-reveal.tsx` — H2 section heading animations only
   - `spotlight-card.tsx` — Room teaser and offer card hover effect (desktop only)
   - **Budget is final.** No fourth Aceternity component. Replicate new effects with Framer Motion + CSS.
3. **Custom components** — everything else, built with Tailwind CSS and Framer Motion.

**Do not install additional UI libraries.** Only UI-related packages: `framer-motion`, `class-variance-authority`, `clsx`, `tailwind-merge`.

## Design Tokens (defined in tailwind.config.ts — never use raw hex in components)

| Token          | Hex       | Usage                                               |
|----------------|-----------|-----------------------------------------------------|
| `brand-teal`   | `#4ca8b5` | Primary CTAs only — max one element per viewport height |
| `sand`         | `#f5f0e8` | Page background                                     |
| `ivory`        | `#faf8f4` | Card/modal backgrounds                              |
| `charcoal`     | `#1a1a1a` | Body text, headings on light backgrounds             |
| `stone`        | `#8a8070` | Captions, secondary text                            |
| `deep-teal`    | `#2a6b74` | Footer bg, dark sections, scrolled nav bg            |
| `white`        | `#ffffff` | Text on dark/image backgrounds                      |

If you need a new color, add it to `tailwind.config.ts` with a semantic name. Never use raw hex values (`bg-[#4ca8b5]`) in component files.

## Typography

- **Headings:** Cormorant Garamond (Light 300 for display, Regular 400 for smaller). Never below 20px.
- **Body/UI:** Inter (400 body, 500 nav/labels, 600 buttons). Base 16px, `leading-relaxed`.
- Loaded via `next/font/google` in `app/layout.tsx`.

## Spacing

8px base grid. Section padding: `py-24` or `py-32`. Heading margin-bottom: `mb-16`. Max content width: `max-w-7xl` centered. Full-bleed sections use `w-full`. Do not reduce spacing to fit more content — generous whitespace is the core design principle.

## Animation Rules

- **Fade-in on scroll:** opacity 0→1, y 20→0, 0.6s easeOut via reusable `<FadeIn>` wrapper.
- **Staggered grid:** 0.1s delay between cards, max 6 stagger steps (capped at 0.5s total).
- **Page transition:** opacity fade 0.4s via `AnimatePresence` in layout. No slides.
- **Card hover:** scale 1→1.02, 0.3s. Never 1.1 or larger.
- **WhatsApp pulse:** scale 1→1.1→1 on 2s loop, 5s pause between pulses.
- Respect `prefers-reduced-motion: reduce` — disable all transforms and opacity transitions, show static content immediately.
- Framer Motion is decorative only. Use CSS transitions for functional state changes (e.g., nav open/close).

## Image Rules

- Always use `next/image`, never bare `<img>` (except hero video poster fallback).
- Full-bleed: `fill` mode with positioned parent and `sizes="100vw"`.
- Grid cards: explicit `width`/`height` props matching aspect ratio (e.g., `width={640} height={427}` for 3:2).
- All images in `public/images/[section]/`. Naming: lowercase, hyphens only, pattern `[section]-[descriptor]-[sequence].[ext]`.
- JSON paths start with `/images/...` (not `public/images/...`).
- Every image must have a descriptive `alt` from JSON. Decorative images: `alt=""` and `aria-hidden="true"`.

## Key Patterns

### Section Heading (components/common/section-heading.tsx)
Every section title: optional uppercase label (Inter, brand-teal, `text-sm tracking-widest`), H2 with text-reveal animation (Cormorant Garamond), optional subtext (Inter).

### Primary Button (wraps shadcn Button)
`bg-brand-teal hover:bg-deep-teal text-white font-inter font-semibold px-8 py-3 rounded-none tracking-wide uppercase text-sm`.

### WhatsApp Links
Format: `https://wa.me/[number]?text=[encoded-message]`. Number from `content/contact.json`, international format, no `+`, no spaces.

### GuestPro Booking Widget
iframe from `https://secure.guestpro.net/odch`. Cannot style iframe contents. If embedding is blocked (X-Frame-Options), fall back to a "Book Now" button opening the URL in a new tab.

## File Naming

- Component files: kebab-case (`hero-video.tsx` exports `HeroVideo`)
- Components describe what they render, not where used (`rooms-grid.tsx`, not `home-rooms-teaser.tsx`)
- Asset files: lowercase, hyphens, no spaces/underscores (`deluxe-cottage-bedroom-01.jpg`)

## Pages (all SSG unless noted)

`/` (Home), `/rooms`, `/restaurant`, `/spa`, `/gallery` (SSG + client hydration for infinite scroll), `/excursions`, `/transfer`, `/rental`, `/offers`, `/about`, `/contact`

## Gallery Infinite Scroll

`gallery.json` contains all photos. First 20 rendered at build. `IntersectionObserver` on a sentinel div loads next 20 from the already-bundled array — no network request. Lightbox uses shadcn Dialog.

```tsx
// Sentinel pattern (simplified)
const sentinel = useRef<HTMLDivElement>(null);
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) loadMore(); },
    { rootMargin: "200px" }
  );
  if (sentinel.current) observer.observe(sentinel.current);
  return () => observer.disconnect();
}, [loadMore]);
```

## Accessibility (WCAG 2.1 AA — non-negotiable)

- 4.5:1 contrast for body text, 3:1 for large text. `brand-teal` on white fails for body text — use only for large/decorative text or interactive elements with sufficient size.
- Descriptive `alt` on all images (from JSON). Decorative images: `alt=""` and `aria-hidden="true"`.
- Full keyboard navigation including hamburger menu, lightbox, cards. Visible focus rings (`focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2`).
- Semantic HTML: `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`. One `<h1>` per page.
- Focus trap inside open modals (lightbox, mobile nav). Return focus to trigger element on close.
- Hero video: `muted`, `autoPlay`, `playsInline`, no audio track. Provide a pause button.
- Skip link: first focusable element on every page — `<a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>`.

## Performance Targets & Enforcement

| Metric       | Target   | How to verify                                         |
|--------------|----------|-------------------------------------------------------|
| LCP          | < 2.5s   | Lighthouse CI in GitHub Actions; `priority` on hero image, `preload` hero video |
| CLS          | < 0.1    | Explicit width/height on images, `next/font`          |
| INP          | < 200ms  | No heavy JS on load; test with Chrome DevTools Performance panel |
| Total JS     | < 500 KB | `npm run check:bundle` — script in `scripts/check-bundle-size.js` parses `.next/build-manifest.json` and fails if first-load JS exceeds 500 KB |

The `check:bundle` script runs in CI. If the budget is exceeded, the build fails with a message showing which route(s) crossed the threshold and by how much.

## Testing Strategy

### What We Test

This is a static marketing site, not a web app. Testing is proportional:

1. **Type safety (primary guard):** `npx tsc --noEmit` catches most content and component mismatches. Run on every commit via pre-push hook.
2. **Build integrity:** `npm run build` must complete with zero errors. This validates all static pages can generate, all JSON loads correctly, and all imports resolve.
3. **Bundle budget:** `npm run check:bundle` enforces the 500 KB JS limit.
4. **Image audit:** `node scripts/check-images.js` ensures no broken image references in JSON.
5. **Lighthouse CI (GitHub Actions):** Runs against the Vercel preview URL on every PR. Fails the check if LCP > 2.5s, CLS > 0.1, or accessibility score < 95.

### What We Don't Test

No unit tests for individual components (the cost/benefit ratio is wrong for a static site with no business logic). No E2E framework — Lighthouse CI and manual spot-checks on preview URLs cover the critical paths.

## Git Workflow

- **Branch naming:** `feat/[short-description]`, `fix/[short-description]`, `content/[short-description]`
  - Examples: `feat/spa-booking-section`, `fix/mobile-nav-overlap`, `content/update-room-prices`
- **Commit messages:** imperative mood, lowercase, max 72 chars. Reference the area of change.
  - Good: `add spa treatment grid section`, `fix navbar z-index on gallery page`, `update room prices for 2026 season`
  - Bad: `Updated stuff`, `WIP`, `fix bug`
- **Merge strategy:** squash-merge feature branches into `main`. Every commit on `main` should represent a complete, working change.
- **Deploy flow:** push to `main` → Vercel auto-deploys (30–90s). PRs generate preview URLs — always check the preview before merging.

## Content Editing Guide

All content changes are JSON edits in `content/`. Push to `main` → Vercel auto-deploys.

### Adding a New Room

1. Add the room object to `content/rooms.json`, following the existing shape exactly.
2. Add the room type to `lib/types.ts` if it introduces new fields.
3. Add images to `public/images/rooms/` following naming convention.
4. Run `node scripts/check-images.js` to verify paths.
5. Run `npm run build` to confirm the page renders.

### Managing Offers

Offers in `content/offers.json` use `"active": true/false`. Never delete expired offers — set `"active": false`. This preserves history and makes reactivation trivial.

### Adding a New Page

1. Create `app/[route]/page.tsx` following the canonical page pattern above.
2. Add the route to `components/layout/navbar.tsx` navigation items.
3. Create corresponding section components in `components/sections/`.
4. Add content JSON file if needed, with matching types in `lib/types.ts`.
5. Verify: `npx tsc --noEmit && npm run build`.

## Environment Variables

| Variable                           | Required | Purpose                    |
|------------------------------------|----------|----------------------------|
| `NEXT_PUBLIC_WHATSAPP_NUMBER`      | Yes      | WhatsApp CTA links         |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`    | No       | Google Analytics            |

Never put secrets in `NEXT_PUBLIC_` variables — they are inlined into client JS.

## Deployment

Vercel auto-deploys on push to `main`. Preview URLs generated for PRs. Custom domain DNS: A record `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`. SSL is automatic.

## Troubleshooting

| Symptom                                   | Likely cause                                         | Fix                                                      |
|-------------------------------------------|------------------------------------------------------|----------------------------------------------------------|
| Build fails with "Cannot find module"     | Missing JSON file or wrong import path               | Check `content/` filenames match imports in `lib/content.ts` |
| Image shows as broken on deployed site    | JSON path includes `public/` prefix                  | Remove `public/` — use `/images/...` not `public/images/...` |
| Hydration mismatch warning                | Server/client render different output                | Check for `Date.now()`, `Math.random()`, or browser-only APIs in Server Components |
| GuestPro iframe blank                     | X-Frame-Options blocking embed                       | Fallback button should render automatically; if not, check the timeout logic in `BookingWidget` |
| Brand-teal text unreadable                | Used on white bg for small text (fails 4.5:1)        | Use `charcoal` for body text; `brand-teal` only for large text, icons, or interactive elements |
| Bundle size CI check fails                | New dependency or unintended client-side code         | Run `npm run check:bundle` locally, check for unnecessary `"use client"` directives |
| Animation jank on mobile                  | Too many simultaneous Framer Motion animations       | Reduce stagger count, simplify variants, test on throttled CPU |
| `prefers-reduced-motion` not respected    | Missing motion query in component                    | Wrap animations in `useReducedMotion()` hook or CSS `@media` query |

## Common Mistakes to Avoid

- **Don't put logic in page files.** If you're writing `useState`, `useEffect`, or a conditional in a page file, move it to a section or common component.
- **Don't add `"use client"` to fix type errors.** If TypeScript complains in a Server Component, the fix is almost always a type correction, not switching to client rendering.
- **Don't add new colors as raw hex.** If you need a new shade, define it in `tailwind.config.ts` with a semantic name.
- **Don't skip the `alt` attribute.** Every `<Image>` needs either a descriptive `alt` from JSON or `alt=""` with `aria-hidden="true"` for decorative images.
- **Don't nest sections.** Each section component renders one `<section>` element. Sections are siblings within `<main>`, never nested.
- **Don't animate layout properties.** Only animate `opacity` and `transform`. Never animate `width`, `height`, `top`, `left`, or `margin` — these trigger expensive layout recalculations.
