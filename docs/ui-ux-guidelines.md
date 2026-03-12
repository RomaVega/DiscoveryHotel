# UI/UX Guidelines — Orlowsky Discovery Hotel Website

## Visual References & Design Philosophy

The two reference sites are The Peninsula Tokyo (`peninsula.com`) and Aman (`aman.com`). These share a specific visual language: extreme generosity of whitespace, near-monochromatic base palettes interrupted by a single strong accent, serif typography for all display text, and photography that fills the screen without feeling crowded. Animations are slow, deliberate, and felt rather than noticed. Nothing jumps; everything breathes.

The goal for Orlowsky Discovery is this same feeling at a smaller scale. The site should feel like it belongs alongside these brands while remaining honest to a boutique property in east Bali — warm, natural, personal.

---

## Design Tokens

All tokens are defined in `tailwind.config.ts`. Component files reference token names only — no raw hex codes, no hardcoded `px` values outside of Tailwind's scale.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `brand-teal` | `#4ca8b5` | Primary CTA buttons, active nav indicator, icon accents, border highlights — used sparingly |
| `sand` | `#f5f0e8` | Page background, light section fills |
| `ivory` | `#faf8f4` | Card backgrounds, modal backgrounds |
| `charcoal` | `#1a1a1a` | Body text, headings on light backgrounds |
| `stone` | `#8a8070` | Captions, secondary text, meta information |
| `deep-teal` | `#2a6b74` | Footer background, dark section fills, nav background when scrolled |
| `white` | `#ffffff` | Text on dark/image backgrounds, nav logo area |

**The rule for brand-teal:** It appears in at most one element per viewport height. Overuse destroys its impact. Correct uses: the "Book Now" button, a hover underline on the active nav link, a thin border accent on a featured card, the WhatsApp button background. Incorrect uses: section backgrounds, large text blocks, decorative dividers.

### Typography

**Display / Headings:** Cormorant Garamond (Google Fonts)
- Used for: all H1, H2, H3 headings; hero taglines; pull quotes; room names
- Weight: 300 (Light) for large display text, 400 (Regular) for smaller headings
- Letter-spacing: `tracking-wide` (0.05em) for uppercase labels, none for sentence-case headings
- Never use Cormorant Garamond below 20px — it loses elegance at small sizes

**Body / UI:** Inter (Google Fonts)
- Used for: all body text, navigation, buttons, form labels, captions, meta text, prices
- Weight: 400 for body, 500 for navigation and labels, 600 for button text
- Standard body size: 16px / `text-base`; line-height: `leading-relaxed` (1.625)

**Loading strategy:** Both fonts are loaded via `next/font/google` in `app/layout.tsx`. This eliminates layout shift (FOUT) by inlining font metrics before the font file downloads.

### Spacing & Layout

The site uses an 8px base grid. All section vertical padding uses Tailwind's `py-24` (96px) or `py-32` (128px). Section headings have `mb-16` (64px) of space below them before content begins. This generous spacing is the primary mechanism for the "Peninsula/Aman" feeling — do not reduce it to fit more content.

Maximum content width: `max-w-7xl` (1280px), centered with `mx-auto`. Full-bleed sections (heroes, image backgrounds) ignore this constraint and use `w-full`.

---

## Mobile-First Rules

Tailwind CSS is mobile-first by default. Every component is designed for a 390px viewport width and scaled up. Specific rules:

- Navigation: hamburger menu on mobile, full horizontal nav on `md:` (768px) and above. The nav collapses to a full-screen overlay on mobile, not a dropdown — this feels more premium.
- Grid layouts: single column on mobile, two columns on `md:`, three columns on `lg:` (1024px).
- Hero video: on mobile, the video is paused and replaced by a static image (`hero-01.jpg`) to respect bandwidth and battery. This is handled with a CSS media query (`@media (prefers-reduced-motion: reduce)`) and a JavaScript check for connection type if needed.
- Font sizes: hero H1 is `text-4xl` on mobile, `text-6xl` on `lg:`. Never smaller than `text-xl` for any heading.
- Touch targets: all interactive elements (buttons, nav links, cards) have a minimum tap area of 44×44px, per WCAG 2.1 AA.

---

## Animation Budget

Animations are used to add depth and elegance, not to demonstrate technical ability. The rule: if removing an animation makes the page feel flat, it belongs. If removing it makes no difference, remove it.

### Framer Motion — Permitted Uses

**Fade-in on scroll:** Every section heading and the first paragraph of content fades in (`opacity: 0 → 1`) with a `y: 20 → 0` translate as it enters the viewport. Duration: 0.6s. Easing: `easeOut`. Implemented via a reusable `<FadeIn>` wrapper component so it is consistent everywhere.

**Staggered children:** When a grid of cards enters the viewport, each card fades in with a 0.1s delay between them. This creates a gentle cascade effect. Maximum stagger count: 6 items. Beyond 6, all remaining items share the last delay value.

**Page transition:** A simple `opacity: 0 → 1` fade over 0.4s on route change. Implemented in `app/layout.tsx` using Framer Motion's `AnimatePresence`. No slide transitions — they feel disorienting on content-heavy sites.

**Hover states:** Subtle `scale: 1 → 1.02` on room cards and offer cards. Duration: 0.3s. Never `scale: 1.1` or larger — that feels cheap.

**What Framer Motion is NOT used for:** Loading spinners, button press animations, form validation feedback, or anything functional. Framer Motion is decoration; use CSS transitions for functional state changes.

### Aceternity UI — The Three Components

This project uses exactly three Aceternity components. These are copy-pasted source files, not installed as a package, so they can be modified freely.

**1. `parallax-hero.tsx` — used on the Home page hero only.**
This component creates the parallax scrolling effect where the background (video) moves slower than the foreground (text), adding depth. The video itself autoplays, loops, and is muted. The overlay text (hotel name, tagline, scroll indicator) is positioned with `z-index` above the video. Modification note: the original Aceternity component uses a static image; adapt it to accept a `<video>` element as the background instead of `next/image`.

**2. `text-reveal.tsx` — used on section headings across all pages.**
As the heading scrolls into view, individual words or characters animate in from a masked position. This creates the "typing through silk" effect seen on Peninsula and Aman. Use this for H1 and H2 headings only — applying it to body text would be exhausting to read. Limit: one text-reveal animation per page section.

**3. `spotlight-card.tsx` — used on the Home page room teaser cards and Offers page cards.**
A radial gradient spotlight follows the mouse cursor within the card boundaries, creating a subtle glow that highlights card content on hover. This works only on desktop (pointer: fine). On mobile/touch, the component renders as a standard card with no special effect.

**The three-component budget is fixed.** If a fourth Aceternity component seems appealing, implement the same effect with plain Framer Motion and CSS instead.

---

## Video Hero Implementation

The hero video follows the Aman reference: full-screen, no controls, no sound, seamless loop.

Technical implementation in `components/sections/hero-video.tsx`:

```typescript
<div className="relative h-screen w-full overflow-hidden">
  <video
    autoPlay
    muted
    loop
    playsInline          // required for iOS Safari autoplay
    className="absolute inset-0 h-full w-full object-cover"
  >
    <source src="/videos/hero.webm" type="video/webm" />
    <source src="/videos/hero.mp4"  type="video/mp4" />
    {/* Fallback for browsers that block video */}
    <img src="/images/hero/hero-01.jpg" alt="Orlowsky Discovery Hotel" />
  </video>
  {/* Dark overlay for text readability */}
  <div className="absolute inset-0 bg-black/30" />
  {/* Text content */}
  <div className="relative z-10 flex h-full flex-col items-center justify-center text-white">
    ...
  </div>
</div>
```

The WebM source is listed first because it is typically 30–40% smaller than MP4. Browsers that support WebM (Chrome, Firefox, Edge) use it; Safari falls back to MP4.

**Video production specs for the videographer:** H.264 MP4, 1920×1080, 10–20 seconds, under 15 MB, no audio track. The video should be color-graded for the overlay — slightly underexposed scenes work better under a `bg-black/30` overlay than bright, contrasty footage.

---

## The WhatsApp Button

A floating button fixed to the bottom-right of every page (`position: fixed; bottom: 2rem; right: 2rem`). It is rendered once in `app/layout.tsx` so it appears everywhere without being added to individual pages.

**Animation:** A repeating "heartbeat" pulse using Framer Motion's `animate` prop. The button scales from `1 → 1.1 → 1` on a 2-second loop with a 5-second pause between pulses (`repeatDelay: 5`). This draws the eye without being annoying — the pulse is slow enough to feel natural.

**Behavior:** Clicking opens WhatsApp with a pre-filled message. The URL format:
```
https://wa.me/[phone-number]?text=Hello%2C%20I%20am%20interested%20in%20booking%20at%20Orlowsky%20Discovery%20Hotel.
```
Replace `[phone-number]` with the full international number including country code (e.g., `6281234567890` for Indonesia), no `+` sign, no spaces.

The phone number and default message are stored in `content/contact.json` so they can be changed without touching component code.

**Visual:** The WhatsApp green (`#25D366`) background with the white WhatsApp logo icon from a local SVG. Do not use brand-teal for this button — the universally recognized WhatsApp green builds instant recognition.

---

## Gallery Infinite Scroll

The gallery uses browser-native `IntersectionObserver` to detect when the user reaches the bottom of the photo grid. No library is needed.

```typescript
// Simplified logic inside gallery-grid.tsx
const [visibleCount, setVisibleCount] = useState(20);
const sentinelRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + 20, photos.length));
      }
    },
    { threshold: 0.1 }
  );
  if (sentinelRef.current) observer.observe(sentinelRef.current);
  return () => observer.disconnect();
}, [photos.length]);
```

Photos render with `next/image` using `loading="lazy"` and explicit `width`/`height` attributes to prevent layout shift. The lightbox (shadcn/ui `Dialog`) displays the full-resolution image when a photo is clicked.

---

## Accessibility — WCAG 2.1 AA

The following requirements are non-negotiable and must be verified before launch:

- **Colour contrast:** All body text on backgrounds meets 4.5:1 contrast ratio. Large text (24px+) meets 3:1. Use the Colour Contrast Analyser tool to verify. Brand-teal `#4ca8b5` on white `#ffffff` fails 4.5:1 — never place body text in brand-teal on a white background. It can be used for large display text or decorative elements only.
- **Alt text:** Every `<img>` and `next/image` has a descriptive `alt` attribute. Decorative images that add no information use `alt=""`. Alt text is stored in the content JSON alongside the image path.
- **Keyboard navigation:** The entire site — including the hamburger menu, gallery lightbox, and all interactive cards — must be navigable by keyboard alone. Tab order follows reading order. Focus indicators are visible (Tailwind's `focus:ring-2 focus:ring-brand-teal`).
- **Video autoplay:** The hero video must be muted (required by all browsers for autoplay). Users with `prefers-reduced-motion: reduce` set in their OS receive the static fallback image instead.
- **Semantic HTML:** Page sections use `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, and `<article>` elements correctly. Headings follow a logical hierarchy: one `<h1>` per page, `<h2>` for sections, `<h3>` for cards.

---

## Performance Targets (Core Web Vitals)

| Metric | Target | How achieved |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | `next/image` with `priority` on hero image; `preload` link for hero video |
| CLS (Cumulative Layout Shift) | < 0.1 | Explicit `width`/`height` on all images; `next/font` eliminates font shift |
| INP (Interaction to Next Paint) | < 200ms | No heavy JavaScript on load; Framer Motion deferred to after hydration |
| Page weight (initial) | < 500 KB JS | No unnecessary npm packages; Aceternity components are local files |

The hero video is the largest asset on the site (target: under 15 MB). It does not affect LCP because it is not the Largest Contentful Paint element — the text overlay is. The video loads in the background and replaces the static fallback image seamlessly once buffered.
