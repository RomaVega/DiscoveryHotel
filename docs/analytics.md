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

### The offer cards went to WhatsApp (23 Sept 2026)

The per-offer "Check Availability" buttons in `SpecialOffers` used to point at
`secure.guestpro.net/odch`; they now open WhatsApp with a prefilled enquiry.
Because the live trigger is `Click URL contains "wa.me"`, they will start
counting into `click_whatsapp` — a GA4 event **and** a Metrica goal, both with
real history — on the day this deploys. Nothing moves *out* of a series, since
the engine was never counted; the step is purely additive, and it mixes "a
guest wants to talk to us" with "a guest wants this specific offer".

They carry `data-cta-location="offer_card"` so the two intents stay separable.
That attribute is the only thing distinguishing them from the floating chat
button — both are `wa.me/<number>?text=...` to a trigger that reads the click
URL — and it had to ship **before** the trigger that reads it, because the
separation cannot be applied to hits already collected. Handle it in GTM per
[Outstanding](#outstanding), and annotate the deploy date in GA4.

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
| Custom HTML | — | Yandex Metrica `111820344` | **Live — do not delete** |
| Custom HTML | `click_whatsapp` | Yandex Metrica goal | **Live — do not delete** |

`G-XR966N4YKR` (note `966`, not `996`) is not a real property: its `gtag/js`
response is byte-identical to one served for an invented measurement ID. Those
three events have never arrived anywhere. Fix by pointing all tags at a
**Constant variable** rather than a pasted string, so the typo cannot recur.

> **Correction, 23 Sept 2026.** The 21 Sept audit recorded the two Custom HTML
> tags as empty and told the next person to delete them. They are not empty.
> One is the **Yandex Metrica loader** (counter `111820344`, with `webvisor`,
> `clickmap` and `ecommerce: "dataLayer"`), fired on `gtm.js`; the other pushes
> a Metrica `reachGoal` for `click_whatsapp`. Deleting them removes Metrica
> from the site entirely — which, for a property whose second audience is
> Russian-speaking, is the one tag you would least want to drop silently.
> Re-read from the container, not from this table, before deleting anything.

**The only click trigger that exists is `Click URL contains "wa.me"`** →
`gtm.linkClick`. It fires both the GA4 `click_whatsapp` tag (on the correct
property) and the Metrica goal. There is **no** `secure.guestpro.net` predicate
in the container: `booking_engine_click` is a plan in [Outstanding](#outstanding),
not a live tag, so no booking CTA on this site is counted today.

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

## Where this stands (23 Sept 2026)

**Code** — four commits on `feat/book-now-tracking`, plus a merge bringing in
the 22 Sept `main`, pushed to GitHub, **not merged and not deployed**.
Production therefore still emits no `book_now_click` and no
`data-cta-location`. The merge-vs-fast-forward question is settled: CLAUDE.md
now requires a branch and a PR for every change, so this goes in as a PR and
`main` auto-deploys on merge.

The 22 Sept work on `main` renamed the booking CTAs to "Check Availability"
and gave them `aria-label`s. It does not touch tracking — the GTM Link Click
trigger keys on the click URL and hostname, never the label — but the visible
string in a screenshot or a GA4 `link_text` will differ from earlier notes.

**GA4 — done**
- Unwanted referrals: `guestpro.net`
- Configure domains: `orlowsky.id` + `secure.guestpro.net`
- All six custom dimensions registered, Event scope: `cta_location`,
  `cta_destination`, `translator`, `browser_lang`, `page_locale`, `error_digest`

**GA4 — in progress / not started**
- [ ] Internal traffic rule — started, needs the right IPs (see gotcha below)
- [ ] Data filter for internal traffic → switch **Testing → Active**. The rule
      only appends `traffic_type=internal`; the filter is what excludes it.
- [ ] Data retention → 14 months
- [ ] Link GA4 ↔ Google Ads

> **Gotcha, already hit once.** Internal traffic matches the *visitor's* IP, not
> the server's. `orlowsky.id` resolving to `98.84.224.111` / `18.208.88.157` is
> irrelevant — GA4 is client-side, so hits carry the browser's ISP address and
> the server IP never appears. Use the hotel WiFi's public egress IP and the
> maintainer's own connection, match type **IP address equals**. Don't paper
> over a dynamic IP with a wide CIDR range: that filters real guests on the same
> ISP block.

**GTM — nothing done yet.** Container still in its audited state above,
including the three tags pointing at the non-existent `G-XR966N4YKR`.

**GuestPro** — email sent 21 Sept 2026 to `info@guestpro.id` asking for:
`google_tag_manager_id` = `GTM-KHDV2SW2` on the merchant record (and
`google_analytics_id` left empty); confirmation of the GA4 ecommerce events;
Google Free Booking Links enablement plus the landing URL and `merchant_id`;
and the booking engine's search query parameters. Awaiting reply.

## Outstanding

**GTM** — none of this needs the deploy except the last line
- [ ] Constant variable `GA4 Measurement ID` = `G-XR996N4YKR`; point every tag at it
- [ ] Fix `click_phone` / `click_email` / `click_instagram` (currently firing into nothing)
- [ ] ~~Delete the two empty Custom HTML tags~~ — **do not**; they are Yandex
      Metrica (see the correction above)
- [ ] Add Conversion Linker, All Pages
- [ ] Auto-Event Variable `CTA Location` → Element Attribute → `data-cta-location`
- [ ] Link Click trigger: Click URL contains `secure.guestpro.net` **AND Page
      Hostname equals `orlowsky.id`** → GA4 event `booking_engine_click` with
      `cta_location`. The hostname clause stops it double-firing once the engine
      carries this container.
- [ ] Add `cta_location` (the existing Auto-Event Variable) as a parameter on
      the **`click_whatsapp`** tag. Do this in the same publish as the deploy:
      without it the offer-card clicks land in `click_whatsapp` and the
      increment cannot be explained afterwards. Segmenting beats excluding —
      an offer enquiry *is* a WhatsApp click, and the totals should stay whole.
- [ ] Optional, once `cta_location` is on the tag: a GA4 key event on
      `click_whatsapp` where `cta_location = offer_card`, which is the offer
      conversion. Worth more to Ads than the undifferentiated event.
- [ ] GA4 annotation on the deploy date: "offer CTAs moved from the booking
      engine to WhatsApp — `click_whatsapp` steps up, additively"
- [ ] Custom Event trigger on `boundary_error` → GA4 `exception`
- [ ] GA4 ecommerce tags for `purchase` / `begin_checkout` / `view_item`, built
      dormant so they work the moment GuestPro sets the field
- [ ] Preview, confirm each tag fires **once**, publish with version notes
      *(needs the deploy first)*

**Google Ads**
- [ ] Import GA4 key events as conversions
- [ ] `booking_engine_click` Primary *only until* `purchase` exists, then demote
- [ ] Remarketing tag and audiences
- [ ] Skip the bidding setup entirely if no campaigns are running yet — Smart
      Bidding from zero conversion history performs badly

**Open questions**
- [ ] Booking engine search query parameters (undocumented; capture the real
      redirect from GuestPro's WordPress booking bar to learn them)
- [ ] Consent Mode v2 — no CMP on the site; required for EEA/UK remarketing
- [ ] When the engine carries the container, check `page_view` in Preview: the
      engine pushes its own per route while the config tag also sends one on
      load, so the first engine page likely double-counts
