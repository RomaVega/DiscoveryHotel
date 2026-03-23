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

## SEO — Adding a New Language

When the site is complete and a new language is ready (e.g. Indonesian `id`, Chinese `zh`), use the prompt below to have an AI perform the full SEO setup for that language.

> **Готов добавить индонезийский или китайский?**
> Просто скопируй промпт ниже, замени `[LANGUAGE_NAME]` и `[LOCALE_CODE]` — и ИИ сделает всё по инструкции.
>
> | Язык | `[LANGUAGE_NAME]` | `[LOCALE_CODE]` |
> |---|---|---|
> | Индонезийский | Indonesian | `id` |
> | Китайский | Chinese | `zh` |

---

### Prompt: Add SEO-optimised language version

```
The site is a static Next.js 15 App Router hotel website (output: "export") for Orlowsky Discovery Hotel, Candidasa, Bali. Domain: https://discoveryhot.com.

Multilingual SEO architecture:
- English pages: /rooms, /dining, /spa, etc.
- Russian pages: /ru/rooms, /ru/dining, /ru/spa, etc. (see app/ru/)
- Each locale has its own LanguageProvider defaultLocale in app/ru/layout.tsx
- Translations: locales/en.json and locales/ru.json
- Content: content/*.json with { "en": "...", "ru": "..." } LocalizedString fields
- Sitemap: app/sitemap.ts (includes all locales)
- SEO constants: lib/site.ts

Task: add full SEO support for the "[LANGUAGE_NAME]" language (locale code: "[LOCALE_CODE]", e.g. "id" or "zh").

Steps to complete:

1. Create locales/[LOCALE_CODE].json — translate every key from locales/en.json into [LANGUAGE_NAME]. Match the neutral-professional tone of the English version. Keep hotel name "Orlowsky Discovery Hotel" untranslated.

2. Add "[LOCALE_CODE]" to LOCALE_FILES in lib/language-context.tsx and to the Locale type if not already present.

3. Add "[LOCALE_CODE]" field to every LocalizedString object in all content/*.json files. Translate from the English value. Keep proper nouns (Candidasa, Bali, USAT Liberty, etc.) as-is.

4. Create app/[LOCALE_CODE]/layout.tsx — identical pattern to app/ru/layout.tsx but with defaultLocale="[LOCALE_CODE]" and lang="[LOCALE_CODE]".

5. Create all locale pages under app/[LOCALE_CODE]/ — one page per English route (see Pages table in this README). Each page must have:
   - Translated title and description metadata in [LANGUAGE_NAME]
   - alternates.canonical pointing to /[LOCALE_CODE]/[path]
   - alternates.languages with all active locales (en, ru, [LOCALE_CODE], x-default)
   - openGraph with translated title/description and correct image URL
   - Identical component body to the English page

6. Update app/sitemap.ts — add /[LOCALE_CODE]/ routes for all content pages (same pattern as ruRoutes).

7. Update app/layout.tsx alternates.languages — add "[LOCALE_CODE]": `${SITE_URL}/[LOCALE_CODE]/`.

8. Update all existing English and Russian page metadata — add "[LOCALE_CODE]" to their alternates.languages.

9. Run npx tsc --noEmit and npm run build. Fix any errors. Build must pass with all pages generated.

10. Run node scripts/check-images.js — all image references must be valid.

SEO quality criteria:
- All translated text must read naturally — no machine-literal translations
- page title ≤ 60 chars, description 120–160 chars
- Every page has a unique title and description (no duplicates across locale)
- hreflang is consistent: every language version references all other language versions
```

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
