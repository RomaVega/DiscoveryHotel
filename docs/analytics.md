# Analytics & Google Ads

How measurement works on this site, what is configured where, and what is still
outstanding. Console state described here was verified on **21 Sept 2026** by
reading the public container (`https://www.googletagmanager.com/gtm.js?id=GTM-KHDV2SW2`)
and the booking engine's JavaScript bundle. Re-verify before trusting it.

## Architecture

**GTM owns every tag.** One container, `GTM-KHDV2SW2`, mounted by
[components/layout/GoogleTagManager.tsx](../components/layout/GoogleTagManager.tsx)
and gated to production builds. There is no GA4 environment variable and no
`gtag.js` in the page.

A direct GA4 mount used to sit beside the container behind
`NEXT_PUBLIC_GA_MEASUREMENT_ID`. It was removed because:

- Two GA4 configurations on one page send two `page_view` hits per load.
- Code that prefers `window.gtag` bypasses GTM entirely. **GTM loads gtag.js on
  behalf of the container's Google tag, so `window.gtag` exists in production.**
  Calling it pushes a gtag-style `arguments` object, which no GTM Custom Event
  trigger matches — the hit reaches GA4 while every trigger keyed on the event
  name, including the Google Ads conversion tag, stays silent.

So [lib/track.ts](../lib/track.ts) and [lib/report-error.ts](../lib/report-error.ts)
**always** push `{ event: name, ... }` to `dataLayer` and never call `gtag`.
Neither ever *creates* `dataLayer` — on a build with no container an orphan
queue would grow unbounded with nothing to drain it.

## Events the site pushes

| Event | Source | Parameters |
|---|---|---|
| `book_now_click` | [BookNowButton](../components/common/BookNowButton.tsx) | `cta_location`, `cta_destination`, `page_path`, `page_locale` |
| `boundary_error` | [lib/report-error.ts](../lib/report-error.ts) | `description`, `fatal`, `error_name`, `error_digest`, `translator`, `browser_lang`, `page_locale`, `page_path` |

`book_now_click` covers the four surfaces that render `BookNowButton` (floating
bar, desktop navbar, mobile drawer, hero). It does **not** cover the ~12 booking
CTAs defined in `content/*.json`, plus one hardcoded in
[SpecialOffers.tsx](../components/sections/SpecialOffers.tsx). Those are caught
by a GTM Link Click trigger on hostname instead, which cannot drift when someone
adds a CTA in JSON. `data-cta-location` on the anchor gives that trigger the
surface name where one exists.

**Do not sum `book_now_click` and `booking_engine_click`** — they overlap.
`booking_engine_click` is the counted one; `book_now_click` is diagnostic.

## Container state (21 Sept 2026)

Real property: **`G-XR996N4YKR`**.

| Tag | Event | Sends to | Status |
|---|---|---|---|
| `__googtag` | GA4 config | `G-XR996N4YKR` | OK |
| GA4 event | `click_whatsapp` | `G-XR996N4YKR` | OK |
| GA4 event | `click_phone` | `G-XR966N4YKR` | **Broken** |
| GA4 event | `click_email` | `G-XR966N4YKR` | **Broken** |
| GA4 event | `click_instagram` | `G-XR966N4YKR` | **Broken** |
| 2× Custom HTML | — | — | Empty, delete |

`G-XR966N4YKR` (note `966`, not `996`) is not a real property: its `gtag/js`
response is byte-identical to one served for an invented measurement ID. Those
three events have never arrived anywhere. Fix by pointing all tags at a
**Constant variable** rather than a pasted string, so the typo cannot recur.

Absent from the container: Conversion Linker, Google Ads conversion tag, Ads
remarketing tag, and triggers for `book_now_click` and `boundary_error`.

## The booking engine

`secure.guestpro.net/odch` is a Vue SPA on a third-party domain. Bookings
complete there, so without a tag on it the site cannot see revenue.

**GuestPro supports this natively.** Its bundle reads these fields off the
merchant record and injects the container itself:

```
google_tag_manager_id    google_analytics_id
google_ads_publisher_id  meta_pixel_id (+ use_meta_pixel_capi)
what_converts_url        google_tag_manager_posting_date
```

Once `google_tag_manager_id` is set, the engine fires a full GA4 ecommerce
funnel — `view_item`, `add_to_cart`, `begin_checkout`, `add_payment_info` and
`purchase` with `transaction_id`, plus per-route `page_view` and Meta
equivalents. `google_tag_manager_posting_date` is written back per booking so a
confirmation reload cannot double-count.

**Set `google_tag_manager_id` only. Leave `google_analytics_id` empty** — the
engine pushes to `dataLayer` always and *additionally* calls `gtag` when a GA4
ID is present, so setting both double-counts every purchase.

The field is not self-serve in the PMS UI; GuestPro support sets it. Requested
21 Sept 2026 — see [backlog.md](backlog.md).

### Google Free Booking Links

The engine has a purpose-built chrome-less route, `BeDirectBookingGoogle` at
`/google-direct-booking`, taking Google Hotel Center's itinerary variables:

```
merchant_id, checkin_year, checkin_month, checkin_day,
total_night, total_adult, total_child, currency_code, room_id
```

This is **GuestPro's URL, not a path to build on orlowsky.id**. GuestPro runs
the Hotel Center connection. `merchant_id` is visible in DevTools → Network on
the engine's `merchant/<id>` call to `api.marketconnect.id/guestapp-hotel/api/`.

### Not embeddable

`secure.guestpro.net` returns `x-frame-options: SAMEORIGIN`, so the engine
cannot be iframed on orlowsky.id. The `frame-src https://secure.guestpro.net`
allowance in [netlify.toml](../netlify.toml) is therefore unused.

## Outstanding

**GTM**
- [ ] Point `click_phone` / `click_email` / `click_instagram` at `G-XR996N4YKR`
- [ ] Delete the two empty Custom HTML tags
- [ ] Add Conversion Linker, All Pages
- [ ] Link Click trigger: Click URL contains `secure.guestpro.net` **AND Page
      Hostname equals `orlowsky.id`** → `booking_engine_click`. The hostname
      clause matters: once the engine carries this container, the trigger would
      otherwise fire on its internal navigation too.
- [ ] Custom Event trigger on `boundary_error`
- [ ] GA4 ecommerce tags for `purchase` / `begin_checkout` / `view_item`, built
      dormant so they work the moment GuestPro sets the field

**GA4** — do the first two *before* the engine carries the container
- [ ] List unwanted referrals: `guestpro.net`
- [ ] Configure domains: `orlowsky.id` + `secure.guestpro.net`
- [ ] Custom definitions: `cta_location`, `cta_destination`, `translator`,
      `browser_lang`, `page_locale`, `error_digest`
- [ ] Data retention → 14 months; internal traffic filter → Active
- [ ] Link to Google Ads

**Google Ads**
- [ ] Import GA4 key events as conversions
- [ ] `booking_engine_click` Primary *only until* `purchase` exists, then demote
- [ ] Remarketing tag and audiences

**Open questions**
- [ ] Booking engine search query parameters (undocumented; capture the real
      redirect from GuestPro's WordPress booking bar to learn them)
- [ ] Consent Mode v2 — no CMP on the site; required for EEA/UK remarketing
- [ ] When the engine carries the container, check `page_view` in Preview: the
      engine pushes its own per route while the config tag also sends one on
      load, so the first engine page likely double-counts
