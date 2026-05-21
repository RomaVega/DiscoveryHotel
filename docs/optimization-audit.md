# Optimization Audit — orlowsky.id

**Date:** May 20, 2026
**Goal:** Make the website as fast and reliable as possible. Ensure the entire site loads in the background so navigation between pages is instant — no blank or failed-to-load elements.

---

## The Big Picture

The site ships ~149 MB of images and ~133 MB of video to production. The custom image loader bypasses all Next.js optimization — visitors download raw originals. A user opening the dining page could pull 30+ MB of images alone. Zero cache headers means repeat visits re-download everything. This is why pages feel slow after navigation.

Preloading the entire site in the background is absolutely feasible — but only after we optimize the assets. You can't preload 120 MB on a Bali 4G connection. After optimization (~15 MB total), a tiered background prefetch becomes fast and invisible.

---

## Priority 0: Cache Headers (biggest ROI, zero effort)

**Problem:** No `Cache-Control` headers at all. Every page visit re-downloads images, JS, CSS.

**Fix:** Add cache headers to `netlify.toml` for static assets. Makes repeat visits and back-navigation instant.

**Status:** Not started

---

## Priority 1: Image Optimization (prerequisite for everything)

| Issue | Current | Target |
|---|---|---|
| Total image size | 149 MB | ~15 MB |
| Average image | 802 KB | 50-80 KB |
| Formats | JPG/PNG only | WebP |
| Largest image | 17 MB (dining PNG) | ~200 KB |
| Image loader | Pass-through (no optimization) | Netlify Image CDN or build-time pipeline |
| SVG logo | 619 KB (embedded raster) | ~10 KB (clean SVG or optimized PNG) |

**Worst offenders:**
- `dining/Oceanside-restaurant-and-bar.png` — 17 MB
- `rental/rental.png` — 10 MB
- `offers/special-offer-early-bird.jpg` — 8.4 MB
- `welcome/mobile.png` — 7.2 MB
- `dining/international-cuisine.png` — 7 MB
- `dining/chef-specials.jpg` — 6.9 MB

**Status:** Not started

---

## Priority 2: Delete Dead Assets (119 MB videos, 21 MB images)

**Orphaned videos (119 MB of 133 MB video folder is unused):**
- `video/V1_old/`, `video/V2/`, `video/V3/` — old versions
- Duplicate root-level files (`hero-desktop.mp4`, `hero-mobile.webm`, etc.)

**Orphaned images (~21 MB):** gallery raw camera files, screenshots, duplicates across folders.

**Status:** Not started

---

## Priority 3: Background Preloading (instant navigation)

**Strategy:** A `SitePreloader` client component that injects `<link rel="prefetch">` tags in tiers after the loading screen dismisses:

| Tier | When | What | Size (after optimization) |
|---|---|---|---|
| 1 | 2s after load | Hero images for 6 nav pages | ~500 KB |
| 2 | 10s idle | First 2-3 images per page | ~2-3 MB |
| 3 | 30s idle | All remaining page images | ~8-10 MB |
| 4 | 60s idle | Sub-page images (diving, excursions, etc.) | ~3-5 MB |

Total: ~15-20 MB over 60 seconds in background — invisible on 4G.

Respects `navigator.connection.saveData` and skips on 2G/3G.

No loading screen needed on inner pages — images are already cached by the time user clicks.

**Status:** Not started

---

## Priority 4: JS Bundle Optimization

| Issue | Impact | Fix |
|---|---|---|
| 22 components client-side only for `useLanguage` | 30-50 KB extra hydration per page | Restructure i18n — locale is known at build time from route (`/ru/*`) |
| Full framer-motion bundle (53 KB gzipped) on every page | Wasted JS | Switch to `LazyMotion` + `domAnimation`, replace `FadeIn` with CSS/IntersectionObserver |
| No code splitting (`next/dynamic`) | Heavy pages | Lazy-load below-fold components (ReviewScroller, MapLocation, Gallery lightbox) |
| 52 Lucide icons in Amenities | ~15 KB | Dynamic icon resolver |
| Hero video preloaded on ALL pages | Wasted bandwidth on subpages | Move `<link rel="preload">` to homepage only |

**Status:** Not started

---

## Priority 5: Minor Fixes

- Add WebM `<source>` for hero video (20-30% smaller)
- Change video `preload="auto"` to `preload="metadata"`
- Fix 13 broken image references in content JSON
- Move `shadcn` to devDependencies
- Create the missing `check:bundle` script

**Status:** Not started

---

## Feasibility of "instant navigation" goal

| Scenario | Image download | Time on 4G | Instant navigation? |
|---|---|---|---|
| Current (no optimization) | ~120 MB | 96 seconds | No |
| After image optimization | ~15 MB | 12 seconds | No (first visit) |
| Optimized + tiered prefetch | ~15 MB over 60s background | Invisible | **Yes** |
| Optimized + cache headers | 0 MB repeat visit | Instant | **Yes** |
