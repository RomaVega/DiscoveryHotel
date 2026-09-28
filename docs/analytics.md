# Analytics & Google Ads

How measurement works on this site, what is configured where, and what is still
outstanding. Container state described here is **GTM version 6, published
28 Sept 2026 18:45 WITA**, as reported from the GTM UI. The booking-engine
findings come from reading its JavaScript bundle on 21 Sept 2026. Re-verify
before trusting either.

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
| `book_now_click` | [BookNowButton](../components/common/BookNowButton.tsx), [SecondaryButton](../components/common/SecondaryButton.tsx) with `data-cta-location` | `cta_location`, `cta_destination`, `page_path`, `page_locale` |
| `boundary_error` | [lib/report-error.ts](../lib/report-error.ts) | `description`, `fatal`, `error_name`, `error_digest`, `translator`, `browser_lang`, `page_locale`, `page_path` |

**`cta_location` for `booking_engine_click` comes from this push.** GTM v6
reads it as a Data Layer Variable off the `book_now_click` push, not off the
anchor. A GuestPro link that pushes nothing therefore inherits whatever
`cta_location` the previous push left in GTM's data model: a room-card click
after a navbar click would be reported as `navbar`.

`book_now_click` covers these surfaces:

| `cta_location` | Where | Destination |
|---|---|---|
| `floating` | mobile Book Now bar | engine, or a service enquiry/menu off room routes |
| `navbar` | desktop navbar | engine |
| `drawer` | mobile menu drawer | engine |
| `hero` | home hero | engine |
| `room_card` | home `RoomsPreview` "Check Availability" | engine |
| `dining` | home `DiningPreview` "View Menu" | menu |
| `booking_band` | deep-teal `BookingCta` band above the footer | engine |
| `offer_card` | `SpecialOffers` "Check Availability" | whatsapp |

**The push happens in `onClickCapture`, not `onClick`.** GTM's Link Click
listener and React's root listener both sit on `document`, so in the bubble
phase whichever registered first runs first. If GTM's does, its Link Click
reads the previous push. Capture runs before every bubble listener, so the push
always lands first. Both components have a test that registers a listener
before React mounts and asserts it already sees the push.

The value is also rendered as `data-cta-location` on the anchor, for DOM
inspection. GTM v6 does not read the attribute.

Not covered: the booking CTAs defined in `content/*.json` on inner pages
(`/rooms`, `/offers` and others). The GTM Link Click trigger still counts them
as `booking_engine_click`, but their `cta_location` is inherited from the
previous push or empty.

### The offer cards went to WhatsApp (23 Sept 2026)

The per-offer "Check Availability" buttons in `SpecialOffers` used to point at
`secure.guestpro.net/odch`; they now open WhatsApp with a prefilled enquiry.
Because the live trigger is `Click URL contains "wa.me"`, they will start
counting into `click_whatsapp` — a GA4 event **and** a Metrica goal, both with
real history — on the day this deploys. Nothing moves *out* of a series, since
the engine was never counted; the step is purely additive, and it mixes "a
guest wants to talk to us" with "a guest wants this specific offer".

They push `book_now_click` with `cta_location: "offer_card"` and
`cta_destination: "whatsapp"`, so the two intents stay separable. That is the
only thing distinguishing them from the floating chat button — both are
`wa.me/<number>?text=...` to a trigger that reads the click URL. Handle it in
GTM per [Outstanding](#outstanding), and annotate the deploy date in GA4.

**Do not sum `book_now_click` and `booking_engine_click`** — they overlap.
`booking_engine_click` is the counted one; `book_now_click` is diagnostic.

## Container state (v6, 28 Sept 2026)

Real property: **`G-XR996N4YKR`**, held in the Constant variable
`GA4 Measurement ID`. Every GA4 tag references `{{GA4 Measurement ID}}` rather
than a pasted string.

| Tag | Trigger | Sends |
|---|---|---|
| `__googtag` | All Pages | GA4 config |
| GA4 event `click_whatsapp` | Click URL contains `wa.me` | `click_whatsapp` |
| GA4 event `click_phone` / `click_email` / `click_instagram` | their click triggers | the named event |
| `GA4 Event - booking_engine_click` | `Click - GuestPro booking` | `booking_engine_click` + `cta_location` |
| `GA4 Event - exception (boundary_error)` | `CE - boundary_error` | `exception` + `ES - exception params` |
| `Conversion Linker` | All Pages | — |
| Custom HTML | `gtm.js` | Yandex Metrica loader, counter `111820344` |
| Custom HTML | Click URL contains `wa.me` | Metrica `reachGoal` for `click_whatsapp` |

**`Click - GuestPro booking`** is Just Links, Wait for Tags 2000 ms, Check
Validation off. It fires when `{{Click URL}}` contains `secure.guestpro.net`
**and** `{{Page Hostname}}` matches
`^(www\.)?(orlowsky\.id|orlowskybali\.id|orlowskyhotel\.com)$`. The hostname
clause stops it double-firing once the engine carries this container. Use the
one RegEx: several `Page Hostname equals` rows are ANDed and never fire.

**`cta_location`** on that tag is read from the `book_now_click` dataLayer push
(see [Events the site pushes](#events-the-site-pushes)).

**`ES - exception params`** carries six Data Layer Variables: `description`,
`translator`, `browser_lang`, `page_locale`, `error_digest`, `error_name`.
`error_name` is not a registered custom dimension, so GA4 collects it but does
not report it. `fatal` is pushed by the site but not mapped.

`G-XR966N4YKR` (note `966`) was pasted into `click_phone`, `click_email` and
`click_instagram` until v6. It is not a real property, so those three events
never arrived anywhere before 28 Sept 2026.

**Do not delete the two Custom HTML tags.** They are Yandex Metrica, with
`webvisor`, `clickmap` and `ecommerce: "dataLayer"`. Removing them drops
Metrica from the site entirely. Metrica's `tag.js` from `mc.yandex.ru` was
blocked by the CSP in [netlify.toml](../netlify.toml) until
`fix/cta-location-csp`, so check Metrica for a gap before that deploy.

Absent from the container: Ads remarketing tag, Consent Mode, and ecommerce
tags (`purchase` / `begin_checkout` / `view_item`).

## Google Ads

Account **`145-908-5801`**, linked to GA4. Conversion `booking_engine_click` is
imported from GA4 as **Primary**, category Outbound click. It measures intent,
not revenue: demote it to Secondary the day `purchase` arrives from the engine.
"Get directions" has been removed from the account-default goal.

Ads tags call `www.googleadservices.com`, `googleads.g.doubleclick.net`,
`td.doubleclick.net` and a few more collect hosts. They are allowed in the CSP
in [netlify.toml](../netlify.toml) as exact hosts; a new Ads feature that calls
another origin is blocked until it is added there.

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

## Where this stands (28 Sept 2026)

**Code** — `book_now_click` and `data-cta-location` are live since PR #10
(23 Sept 2026). `fix/cta-location-csp` adds `room_card`, `dining` and
`booking_band`, moves the push to the capture phase, and widens the CSP for
Google Ads and Yandex Metrica.

**GTM** — v6 published 28 Sept 2026 18:45 WITA. See
[Container state](#container-state-v6-28-sept-2026).

**GA4 — done**
- Unwanted referrals: `guestpro.net`
- Configure domains: `orlowsky.id` + `secure.guestpro.net`
- All six custom dimensions registered, Event scope: `cta_location`,
  `cta_destination`, `translator`, `browser_lang`, `page_locale`, `error_digest`
- Internal traffic rule: hotel Wi-Fi public IP **`182.253.40.248`**, match type
  IP address equals. Stable across a 7-day recheck (Biznet, AS17451).
- Linked to Google Ads `145-908-5801`

**GA4 — not confirmed**
- [ ] Data filter for internal traffic → switch **Testing → Active**. The rule
      only appends `traffic_type=internal`; the filter is what excludes it.
- [ ] Data retention → 14 months
- [ ] Internal traffic rule: a condition for the maintainer's own connection

> **Gotcha, already hit once.** Internal traffic matches the *visitor's* IP, not
> the server's. `orlowsky.id` resolving to Netlify's `98.84.224.111` /
> `18.208.88.157` is irrelevant — GA4 is client-side, so hits carry the
> browser's ISP address and the server IP never appears. Don't paper over a
> dynamic IP with a wide CIDR range: that filters real guests on the same ISP
> block.

**GuestPro** — email sent 21 Sept 2026 to `info@guestpro.id` asking for:
`google_tag_manager_id` = `GTM-KHDV2SW2` on the merchant record (and
`google_analytics_id` left empty); confirmation of the GA4 ecommerce events;
Google Free Booking Links enablement plus the landing URL and `merchant_id`;
and the booking engine's search query parameters. Awaiting reply.

## Outstanding

**Code**
- [ ] Give the inner-page GuestPro CTAs from `content/*.json` a surface name
      and a push. Until then their `booking_engine_click` carries an inherited
      or empty `cta_location`.

**GTM**
- [ ] Add `cta_location` as a parameter on the **`click_whatsapp`** tag, read
      from the `book_now_click` push like `booking_engine_click`. Without it the
      offer-card enquiries cannot be separated from the floating chat button.
- [ ] Optional, once that is on: a GA4 key event on `click_whatsapp` where
      `cta_location = offer_card` — the offer conversion.
- [ ] GA4 ecommerce tags for `purchase` / `begin_checkout` / `view_item` —
      only after GuestPro replies and sets the field
- [ ] Map `fatal` into `ES - exception params` if crash severity is wanted

**Google Ads**
- [ ] Demote `booking_engine_click` to Secondary once `purchase` exists
- [ ] Remarketing tag and audiences — needs Consent Mode v2 for EEA/UK
- [ ] Skip bidding setup until there is conversion history — Smart Bidding
      from zero performs badly

**Open questions**
- [ ] Consent Mode v2 — no CMP on the site; required for EEA/UK remarketing
      and conversion modelling. Its own project.
- [ ] Booking engine search query parameters (undocumented; capture the real
      redirect from GuestPro's WordPress booking bar to learn them)
- [ ] When the engine carries the container, check `page_view` in Preview: the
      engine SPA pushes its own per route while the config tag also sends one
      on load, so the first engine page likely double-counts. This is about the
      **engine**, not the marketing site's `historyChange-v2` page views.
