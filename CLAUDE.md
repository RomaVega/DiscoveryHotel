# CLAUDE.md — Orlowsky Discovery Hotel Website

## Project Overview

Static marketing website for Orlowsky Discovery Hotel in Candidasa, Bali. Built with **Next.js 15 (App Router)**, deployed to **Vercel**. All content lives in JSON files — no database, no CMS, no backend. Every page is statically generated (SSG) except Gallery, which hydrates client-side for infinite scroll.

## Quick Commands

- `npm run build` — build the site (must pass with zero errors before deploy)
- `npm run start` — serve locally at localhost:3000
- `npx tsc --noEmit` — type-check without emitting

## Architecture Rules

- **Pages are thin.** `app/[route]/page.tsx` imports JSON, passes props to section components, returns sections in order. All UI logic lives in `components/sections/`.
- **Data flows one direction:** `content/*.json` → `lib/types.ts` → page → section component → static HTML → Vercel CDN.
- **No `any` type.** TypeScript strict mode is enforced. Define all types in `lib/types.ts`.
- **No runtime API calls** (except the GuestPro iframe and gallery client-side array slicing).

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
public/images/          # All photography, organized by section
public/videos/          # hero.mp4 and hero.webm
```

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

- `brand-teal` (#4ca8b5) — primary CTAs, used sparingly (max one element per viewport height)
- `sand` (#f5f0e8) — page background
- `ivory` (#faf8f4) — card/modal backgrounds
- `charcoal` (#1a1a1a) — body text, headings on light bg
- `stone` (#8a8070) — captions, secondary text
- `deep-teal` (#2a6b74) — footer bg, dark sections, scrolled nav bg
- `white` (#ffffff) — text on dark/image backgrounds

## Typography

- **Headings:** Cormorant Garamond (Light 300 for display, Regular 400 for smaller). Never below 20px.
- **Body/UI:** Inter (400 body, 500 nav/labels, 600 buttons). Base 16px, `leading-relaxed`.
- Loaded via `next/font/google` in `app/layout.tsx`.

## Spacing

8px base grid. Section padding: `py-24` or `py-32`. Heading margin-bottom: `mb-16`. Max content width: `max-w-7xl` centered. Full-bleed sections use `w-full`. Do not reduce spacing to fit more content — generous whitespace is the core design principle.

## Animation Rules

- **Fade-in on scroll:** opacity 0→1, y 20→0, 0.6s easeOut via reusable `<FadeIn>` wrapper.
- **Staggered grid:** 0.1s delay between cards, max 6 stagger steps.
- **Page transition:** opacity fade 0.4s via `AnimatePresence` in layout. No slides.
- **Card hover:** scale 1→1.02, 0.3s. Never 1.1 or larger.
- **WhatsApp pulse:** scale 1→1.1→1 on 2s loop, 5s pause between pulses.
- Respect `prefers-reduced-motion: reduce` — show static fallback.
- Framer Motion is decorative only. Use CSS transitions for functional state changes.

## Image Rules

- Always use `next/image`, never bare `<img>` (except hero video fallback).
- Full-bleed: `fill` mode with positioned parent and `sizes="100vw"`.
- All images in `public/images/[section]/`. Naming: lowercase, hyphens only, pattern `[section]-[descriptor]-[sequence].[ext]`.
- JSON paths start with `/images/...` (not `public/images/...`).

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

## Accessibility (WCAG 2.1 AA — non-negotiable)

- 4.5:1 contrast for body text, 3:1 for large text. brand-teal on white fails for body text — use only for large/decorative text.
- Descriptive `alt` on all images (from JSON). Decorative images: `alt=""`.
- Full keyboard navigation including hamburger menu, lightbox, cards. Visible focus rings (`focus:ring-2 focus:ring-brand-teal`).
- Semantic HTML: `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`. One `<h1>` per page.
- Hero video must be muted for autoplay.

## Performance Targets

- LCP < 2.5s — `priority` on hero image, `preload` hero video
- CLS < 0.1 — explicit width/height on images, `next/font`
- INP < 200ms — no heavy JS on load
- Initial JS < 500 KB

## Environment Variables

- `NEXT_PUBLIC_WHATSAPP_NUMBER` — always required
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — only if Google Analytics is connected
- Never put secrets in `NEXT_PUBLIC_` variables.

## Content Editing

All content changes are JSON edits in `content/`. Push to `main` → Vercel auto-deploys in 30–90s. Offers use `"active": true/false` — never delete expired offers, just deactivate them.

## Deployment

Vercel auto-deploys on push to `main`. Preview URLs generated for other branches. Custom domain DNS: A record `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`. SSL is automatic.
