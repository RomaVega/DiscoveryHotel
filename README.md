# Orlowsky Discovery Hotel — Website

Static marketing website for **Orlowsky Discovery Hotel**, Candidasa, East Bali.

- Live site: https://discoveryhot.com
- Booking engine: https://secure.guestpro.net/odch

Built with Next.js 15 App Router and deployed as a fully static export (SSG) via Vercel/Netlify. All content is managed through JSON files — no database, no CMS, no backend.

---

## Tech Stack

| Technology | Version | Notes |
|---|---|---|
| Next.js | 15 | App Router, `output: "export"` (SSG) |
| React | 19 | Server Components by default |
| TypeScript | 5 | Strict mode, no `any` |
| Tailwind CSS | 4 | CSS-first config via `@theme` in `globals.css` |
| Framer Motion | 11 | Scroll animations and transitions |
| shadcn/ui | 2.1.0 | Accessible UI primitives |
| Vitest | 4 | Unit tests with jsdom + React Testing Library |
| Playwright | 1.58 | End-to-end tests |

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero video, highlights, reviews |
| `/rooms` | Room categories and amenities |
| `/dining` | Restaurant and bar |
| `/spa` | Spa treatments |
| `/experiences` | Overview of activities |
| `/experiences/diving` | Diving center |
| `/experiences/excursions` | Land excursions |
| `/experiences/events` | Private events |
| `/experiences/car-rental` | Car rental |
| `/offers` | Special offers |
| `/gallery` | Photo gallery with lightbox |
| `/weddings` | Wedding packages |
| `/transfer` | Airport transfer |
| `/about` | About the hotel |
| `/location` | How to get there |
| `/contact` | Contact and booking |
| `/faq` | Frequently asked questions |
| `/privacy` | Privacy policy |
| `/terms` | Terms and conditions |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=your_number_without_plus_or_spaces
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX   # optional
```

> **Never** put secrets in `NEXT_PUBLIC_` variables — they are inlined into client-side JS.

---

## Running the App

### Development server

```bash
npm run dev
```

Opens at **http://localhost:3000**

Uses Turbopack for fast refresh.

### Production build (static export)

```bash
npm run build
```

Generates a static site in the `out/` directory.

### Preview the production build

```bash
npm run start
```

Serves the production build at **http://localhost:3000**

---

## Running Tests

### Unit tests (Vitest + React Testing Library)

```bash
# Run once
npm test

# Watch mode (re-runs on file changes)
npm run test:watch
```

### End-to-end tests (Playwright)

```bash
npx playwright test
```

> Make sure the dev server is running (`npm run dev`) before running e2e tests.

---

## Quality Checks

Run all checks before pushing to `main`:

```bash
npx tsc --noEmit               # TypeScript type check
npm run lint                   # ESLint — zero warnings required
npm run build                  # Full production build must succeed
node scripts/check-images.js   # Catches broken image paths in JSON
```

---

## Project Structure

```
app/                    # Page files only — import JSON, compose sections
components/
  ui/                   # shadcn/ui — never edit directly, wrap instead
  aceternity/           # Parallax hero, text reveal, spotlight card
  layout/               # Navbar, Footer, WhatsApp button
  sections/             # Page-level sections (HeroVideo, RoomsGrid, etc.)
  common/               # Reusable primitives (SectionHeading, FadeIn, PrimaryButton)
content/                # All site content as JSON files
lib/
  content.ts            # Typed JSON loaders
  types.ts              # Single source of truth for all data types
  validation.ts         # Runtime JSON validation — build fails on bad data
public/
  images/               # Organized by section
  videos/               # hero.mp4, hero.webm
```

---

## Content Editing

All content lives in `content/*.json`. To edit content:

1. Open the relevant JSON file (e.g. `content/rooms.json`)
2. Make your changes
3. Run `npx tsc --noEmit` to verify types are still correct
4. Run `node scripts/check-images.js` to verify image paths

> When adding new JSON fields, always add the corresponding type to `lib/types.ts` first.

---

## Deployment

Push to `main` → Vercel auto-deploys in 30–90 seconds.

Pull requests automatically get preview URLs — verify before merging.

Branch naming: `feat/`, `fix/`, `content/` + short description.

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `brand-teal` | `#4ca8b5` | Primary CTAs, max one per viewport |
| `deep-teal` | `#2a6b74` | Footer, dark sections, scrolled nav |
| `sand` | `#f5f0e8` | Page background |
| `ivory` | `#faf8f4` | Card / modal background |
| `charcoal` | `#1a1a1a` | Body text, headings |
| `stone` | `#8a8070` | Captions, secondary text |

Fonts: **Cormorant Garamond** (headings) · **Inter** (body and UI)
