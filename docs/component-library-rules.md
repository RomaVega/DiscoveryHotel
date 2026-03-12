# Component Library Rules — Orlowsky Discovery Hotel Website

## Philosophy

This project uses three sources for UI components, each with a clear and non-overlapping purpose. Using the wrong source for a given component is the most common way to introduce unnecessary complexity.

- **shadcn/ui** — for all functional, interactive UI primitives: buttons, dialogs, forms, navigation menus, cards.
- **Aceternity UI** — for three specific visual "wow" effects. Nothing else.
- **Custom components** — for layout structure and page sections that combine the above into hotel-specific compositions.

If a component you need exists in shadcn/ui, use it. If a visual effect you need matches one of the three Aceternity components, use that. In all other cases, build a custom component using Tailwind CSS and Framer Motion.

Do not install additional UI libraries. The only UI-related npm packages in this project are `framer-motion`, `class-variance-authority`, `clsx`, and `tailwind-merge` (the last three come with shadcn/ui setup).

---

## shadcn/ui — Rules for Use

shadcn/ui components are installed into `components/ui/` by running the CLI command:
```bash
npx shadcn@latest add [component-name]
```

This copies the component's source code directly into your project. You own the code. You can read it, but treat it as a dependency — do not modify these files to add hotel-specific styling. Instead, wrap the shadcn component in a custom component that applies the hotel's design tokens.

**Example — correct pattern:**
```typescript
// components/common/primary-button.tsx
import { Button } from "@/components/ui/button";

interface PrimaryButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export function PrimaryButton({ children, href, onClick }: PrimaryButtonProps) {
  return (
    <Button
      className="bg-brand-teal hover:bg-deep-teal text-white font-inter font-semibold
                 px-8 py-3 rounded-none tracking-wide uppercase text-sm transition-colors"
      onClick={onClick}
      asChild={!!href}
    >
      {href ? <a href={href}>{children}</a> : children}
    </Button>
  );
}
```

**shadcn/ui components used in this project:**

| Component | Where used |
|---|---|
| `Button` | All CTAs, nav "Book Now" button, form submits |
| `Card` | Base for RoomCard, OfferCard, ExcursionCard |
| `Dialog` | Gallery lightbox |
| `NavigationMenu` | Desktop navigation |
| `Sheet` | Mobile navigation slide-out |
| `Separator` | Decorative horizontal rules in footer |
| `Badge` | Room feature tags, offer labels |

Install only these. Do not pre-install components speculatively.

---

## Aceternity UI — Three Components, Strict Budget

Aceternity components are **not installed from npm**. Visit [ui.aceternity.com](https://ui.aceternity.com), find the component, copy the source code, and paste it into `components/aceternity/`. You own the source and can modify it freely.

### 1. `parallax-hero.tsx`
**Source:** Aceternity "Parallax Scroll" component, adapted to accept a `<video>` element.
**Used on:** Home page hero section only.
**What it does:** Creates a subtle parallax depth effect where the background layer (video) scrolls at a different speed than the foreground text layer.
**Modification required:** The original component uses `next/image`. Adapt the background slot to accept `children` or a `backgroundElement` prop so a `<video>` tag can be passed instead.

### 2. `text-reveal.tsx`
**Source:** Aceternity "Text Generate Effect" or "Cover" component.
**Used on:** H2 section headings on all pages.
**What it does:** Words in the heading animate in from a masked/blurred state as the element enters the viewport.
**Usage rule:** Wrap only `<h2>` elements. One instance per page section. Never use on body text, captions, or navigation.

### 3. `spotlight-card.tsx`
**Source:** Aceternity "Card Spotlight" component.
**Used on:** Home page room teaser cards and Offers page offer cards.
**What it does:** A radial gradient spotlight follows the user's cursor within the card, creating a premium hover interaction on desktop.
**Usage rule:** Apply only to cards where the hover interaction adds value (room cards, offers). Do not apply to navigation, form elements, or small UI components. The effect is automatically disabled on touch devices.

**Budget is final.** If you find a fourth Aceternity effect appealing, replicate it with plain Framer Motion and CSS. The reason for limiting to three is maintenance: Aceternity releases updates and changes component APIs. Three copy-pasted files are manageable; ten are not.

---

## Custom Component Conventions

### Naming

Component files use PascalCase filenames matching the component's exported name:
```
components/sections/HeroVideo.tsx      ← wrong
components/sections/hero-video.tsx     ← correct, exports HeroVideo
```

Component names match what they render, not where they are used:
```
components/sections/home-rooms-teaser.tsx   ← wrong (too specific)
components/sections/rooms-grid.tsx          ← correct (describes what it renders)
```

### File Organization

```
components/
├── ui/             # shadcn/ui generated — do not add files here manually
├── aceternity/     # The three Aceternity components — these can be modified
├── layout/         # Components that appear on every page (Navbar, Footer, WhatsApp)
├── sections/       # Page-level composed sections (HeroVideo, RoomsGrid, GalleryGrid)
└── common/         # Small reusable primitives (SectionHeading, ImageCard, PrimaryButton)
```

The distinction between `sections/` and `common/` is size and specificity. A `section` is a full horizontal band of a page — it receives page-level data and returns a complete layout block. A `common` component is a small, reusable element used inside sections.

### Props Typing

Every component must have an explicit TypeScript interface for its props. Interfaces are defined inline in the component file if the component is the only consumer. If two or more components share a type (e.g., the `Room` type used in `RoomCard` and `RoomsGrid`), that type lives in `lib/types.ts`.

```typescript
// Do this:
interface RoomCardProps {
  name: string;
  tagline: string;
  image: string;
  priceFrom: string;
}

export function RoomCard({ name, tagline, image, priceFrom }: RoomCardProps) {
  ...
}
```

### The "Do Not Build From Scratch" List

These exist already in shadcn/ui or the standard library. Never build custom implementations:

- Modal / dialog → `shadcn Dialog`
- Dropdown menu → `shadcn DropdownMenu`
- Toast notifications → `shadcn Sonner`
- Accordion / FAQ → `shadcn Accordion`
- Button variants → `shadcn Button` with `variant` prop
- Image with fallback → `next/image`
- Link with prefetch → `next/link`
- Font loading → `next/font/google`
- Form input → `shadcn Input`

---

## Section Heading Pattern

Every page section that has a title follows the same pattern: an optional small label above the heading (in Inter, uppercase, brand-teal, `text-sm tracking-widest`), an H2 in Cormorant Garamond using the Aceternity text-reveal animation, and an optional subtext paragraph in Inter below.

This is implemented as `components/common/section-heading.tsx` and used identically across all pages. Changing the heading style site-wide requires editing one file.

```typescript
interface SectionHeadingProps {
  label?: string;      // e.g., "OUR SPACES"
  heading: string;     // e.g., "Rooms & Villas"
  subtext?: string;    // Optional one-sentence description
  centered?: boolean;  // Default: true
}
```

---

## Image Component Pattern

All images in the project use `next/image`, never a bare `<img>` tag (except inside the hero video fallback). The `next/image` component automatically:

- Converts images to WebP format
- Generates multiple sizes for responsive srcsets
- Lazy loads images below the fold
- Prevents layout shift when `width` and `height` are provided

For full-bleed section images, use `fill` mode with a positioned parent:
```typescript
<div className="relative h-[60vh] w-full">
  <Image
    src={src}
    alt={alt}
    fill
    className="object-cover"
    sizes="100vw"
  />
</div>
```

For gallery grid images, use explicit dimensions matching the grid cell aspect ratio (e.g., 800×600 for a 4:3 grid).
