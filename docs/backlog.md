# Backlog — Deferred Work

Genuinely deferred items. Things we intend to do but aren't doing now because the site is otherwise functional and other work has higher priority.

Not a wishlist — only things with a real plan for "when."

---

## Accessibility Audit

**Status:** Deferred until late-stage polish (no other open work).

**Scope when we pick it up:**

1. Run `axe-core` against every built route (`out/*.html`) — automate via a script that walks the export and feeds each page to `@axe-core/cli` or a headless-browser harness.
2. Manual keyboard navigation pass: tab order on every page, focus visibility, modal focus traps (GuestPro iframe, gallery lightbox), skip-link target verification.
3. Screen-reader pass on the three flows that matter most: home → booking widget, rooms → individual room, contact → WhatsApp. macOS VoiceOver + iOS Safari.
4. Color-contrast verification against design tokens: `brand-teal` body text on white already fails WCAG AA per CLAUDE.md — confirm it's nowhere we shouldn't use it.
5. Reduced-motion: confirm every `framer-motion` decoration has a static fallback under `prefers-reduced-motion: reduce`.

**Why deferred:** the site already follows CLAUDE.md's accessibility rules (semantic HTML, focus rings, alt text from JSON, skip link, single h1). A full audit will catch real issues but they're unlikely to be show-stoppers — better return on time spent finishing the open perf/UX items first.
