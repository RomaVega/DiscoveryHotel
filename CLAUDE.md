# CLAUDE.md — Orlowsky Discovery Hotel Website

Static marketing site for Orlowsky Discovery Hotel, Candidasa, Bali. **Next.js 15 App Router**, Vercel, SSG. All content in JSON — no database, no CMS, no backend.

## Tech Stack & Versions

| Technology | Version | Notes |
|---|---|---|
| Next.js | `15.1.0` | App Router, SSG-first |
| TypeScript | `5.5.4` | Strict mode, no `any` |
| Tailwind CSS | `4.0.0` | CSS-first config (`@theme` in CSS, not JS config) |
| Framer Motion | `11.3.0` | Decorative animations only |
| shadcn/ui | CLI `2.1.0` | `npx shadcn@2.1.0 add [component]` |
| Aceternity UI | —  | Copy-paste source only, no npm package |
| lucide-react | `0.400.0` | Icon library used with shadcn/ui |

> Tailwind CSS 4 uses a CSS-first configuration (`@import "tailwindcss"` + `@theme` block in a `.css` file). There is no `tailwind.config.ts` — design tokens go into `app/globals.css` under `@theme`. See the [v4 migration guide](https://tailwindcss.com/docs/v4-upgrade) if coming from v3.

## Commands

```bash
npx tsc --noEmit       # Type-check
npm run lint           # Zero warnings required
npm run build          # Must pass before deploy
npm run check:bundle   # Fails if first-load JS > 500 KB
node scripts/check-images.js  # Catches broken image refs in JSON
```

Run all four checks before pushing to `main`.

## Folder Structure

```
app/                    # Thin page files only — import JSON, compose sections
components/
  ui/                   # shadcn/ui — NEVER edit, wrap instead
  aceternity/           # 3 components only (parallax-hero, text-reveal, spotlight-card)
  layout/               # Navbar, Footer, WhatsAppButton
  sections/             # Page-level sections (HeroVideo, RoomsGrid, etc.)
  common/               # Reusable primitives (SectionHeading, FadeIn, PrimaryButton)
content/                # All site content as JSON
lib/
  content.ts            # Typed JSON loaders — all pages must use these, never import JSON directly
  types.ts              # Single source of truth for all data shapes
  validation.ts         # TODO: runtime JSON shape checks — not yet implemented
public/images/          # Organized by section
public/videos/          # hero.mp4, hero.webm
```

## Architecture Rules

- **Pages are thin.** Import JSON → pass props to sections → return sections in order. No state, no effects, no styling in page files.
- **Data flow:** `content/*.json` → `lib/content.ts` (typed loaders) → page → section → static HTML → CDN.
- **No `any`.** Strict mode. All types in `lib/types.ts`. Add type before adding JSON field.
- **No runtime API calls** (except GuestPro iframe and gallery client-side slicing).
- **Server Components by default.** Only add `"use client"` when component uses hooks/browser APIs. Comment the reason: `"use client"; // Uses IntersectionObserver`.
- **No additional UI libraries.** Only: `framer-motion`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`.
- Aceternity budget is final — no fourth component. Each Aceternity component adds ~15–30 KB and requires copy-paste maintenance with no upstream updates. Build new effects with Framer Motion + CSS.

## Canonical Page Pattern

```tsx
// app/rooms/page.tsx — every page follows this shape
import { getRooms } from "@/lib/content";
import { HeroImage } from "@/components/sections/hero-image";
import { RoomsGrid } from "@/components/sections/rooms-grid";
import { BookingCta } from "@/components/sections/booking-cta";

export const metadata = {
  title: "Rooms & Suites | Orlowsky Discovery Hotel",
  description: "Five room categories in tropical gardens, Candidasa, East Bali.",
};

export default function RoomsPage() {
  const rooms = getRooms();
  return (
    <main>
      <HeroImage src="/images/rooms/rooms-hero.jpg"
        alt="Aerial view of the hotel's garden villas" title="Rooms & Suites" />
      <RoomsGrid rooms={rooms} />
      <BookingCta />
    </main>
  );
}
```

## Design Tokens (defined in `app/globals.css` under `@theme` — never raw hex in components)

- `brand-teal` (#4ca8b5) — primary CTAs, max one per viewport height. **Fails WCAG on white for body text** — use only for large/decorative text or interactive elements.
- `sand` (#f5f0e8) — page bg | `ivory` (#faf8f4) — card/modal bg
- `charcoal` (#1a1a1a) — body text, headings | `stone` (#8a8070) — captions, secondary
- `deep-teal` (#2a6b74) — footer, dark sections, scrolled nav | `white` (#ffffff) — text on dark bg

## Typography & Spacing

- **Headings:** Cormorant Garamond (300 display, 400 smaller). Never below 20px.
- **Body/UI:** Inter (400 body, 500 nav/labels, 600 buttons). 16px base, `leading-relaxed`.
- **Spacing:** 8px grid. Sections: `py-24`/`py-32`. Heading mb: `mb-16`. Content: `max-w-7xl` centered. Generous whitespace is the core design principle — never reduce spacing to fit content.

## Animation Rules

- **Scroll fade-in:** opacity 0→1, y 20→0, 0.6s easeOut via `<FadeIn>` wrapper.
- **Stagger:** 0.1s between cards, max 6 steps (0.5s cap).
- **Page transition:** opacity 0.4s, no slides. **Card hover:** scale 1.02, 0.3s. Never ≥1.1.
- **Only animate `opacity` and `transform`.** Never `width`, `height`, `top`, `left`, `margin`.
- Respect `prefers-reduced-motion: reduce` — show static fallback.
- Framer Motion is decorative only. CSS transitions for functional state changes.

## Image Rules

- Always `next/image`, never `<img>`. Full-bleed: `fill` + `sizes="100vw"`. Grid: explicit `width`/`height`.
- Paths in JSON: `/images/...` (not `public/images/...`). Naming: `[section]-[descriptor]-[sequence].ext`.
- Every image needs descriptive `alt` from JSON. Decorative: `alt=""` + `aria-hidden="true"`.

## Key Patterns

- **SectionHeading:** optional uppercase label (Inter, brand-teal, `text-sm tracking-widest`), H2 with text-reveal (Cormorant Garamond), optional subtext.
- **PrimaryButton:** `bg-brand-teal hover:bg-deep-teal text-white font-inter font-semibold px-8 py-3 rounded-none tracking-wide uppercase text-sm`.
- **SecondaryButton:** `inline-block bg-transparent border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white transition-all duration-300 px-5 py-2 rounded-full tracking-wide uppercase text-xs font-sans font-semibold`. Use for secondary CTAs (e.g., "View All", "Learn More"). Do not inline these styles — use the `SecondaryButton` component in `components/common/`. Supports `href` (internal or `external`) and `onClick` (renders as `<button>`).
- **WhatsApp:** `https://wa.me/[number]?text=[encoded]`. Number from `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER`, international format, no `+`, no spaces. Never hardcode the number in components.
- **GuestPro:** iframe from `https://secure.guestpro.net/odch`. On failure/timeout >5s, fall back to "Book Now" button opening URL in new tab.
- **Gallery:** First 20 SSG, then `IntersectionObserver` sentinel loads next 20 from bundled array (no network). Lightbox via shadcn Dialog.

## Accessibility (WCAG 2.1 AA — non-negotiable)

- 4.5:1 body text, 3:1 large text. Focus: `focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2`.
- Semantic HTML, one `<h1>` per page. Focus trap in modals, return focus on close.
- Skip link as first focusable element. Hero video: `muted autoPlay playsInline` + pause button.

## Performance

LCP < 2.5s (`priority` on hero), CLS < 0.1, INP < 200ms, JS < 500 KB. Bundle budget enforced by `check:bundle` script in CI.

## Git & Deploy

- Branches: `feat/`, `fix/`, `content/` + short description. Squash-merge to `main`.
- Commits: imperative, lowercase, ≤72 chars. E.g., `add spa treatment grid section`.
- Push to `main` → Vercel auto-deploys (30–90s). PRs get preview URLs — check before merging.

## Content Editing

- All changes are JSON edits in `content/`. **Add type in `lib/types.ts` before adding JSON fields.**
- Offers: set `"active": false` — never delete expired offers.
- New page: create page file (follow canonical pattern) → add to navbar → create sections → add JSON + types → verify with `tsc && build`.

## Environment Variables

- `NEXT_PUBLIC_WHATSAPP_NUMBER` (required) — used in all WhatsApp links, read via `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER`. This is the single source of truth for the number; do not hardcode it elsewhere.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)
- Never put secrets in `NEXT_PUBLIC_` — they're inlined into client JS.

## Common Mistakes

- Don't put logic (`useState`/`useEffect`/conditionals) in page files — move to section components.
- Don't add `"use client"` to fix type errors — fix the types instead.
- Don't nest `<section>` elements — sections are siblings within `<main>`.
- Don't skip `alt` attributes or use non-descriptive text.
