# Analytics & Google Ads

How measurement works on this site, what is configured where, and what is still
outstanding. Container state described here is **GTM version 7, published
30 Oct 2026 21:09 WITA**, as reported from the GTM UI. The booking-engine
findings come from reading its JavaScript bundle on 21 Sept and 30 Oct 2026,
and from a live check of the engine on 30 Oct 2026, the day GuestPro set the
container.
Re-verify before trusting either.

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
| `rooms_page` | `/rooms` `RoomsDetail` "Check Availability" (desktop and mobile buttons) | engine |
| `dining` | home `DiningPreview` "View Menu" | menu |
| `dining_page` | `/dining` `DiningDetail` "View Menu" and "Order Delivery" | menu |
| `booking_band` | deep-teal `BookingCta` band above the footer | engine |
| `book_direct` | "Why Book Direct" section on `/offers` | engine |
| `offer_card` | `SpecialOffers` "Check Availability" | whatsapp |
| `blog_offer` | offer block inside a blog post (`ArticleOffer`) | whatsapp |
| `blog_band` | CTA band at the foot of a blog post with a live offer (`PostCtaBand`) | whatsapp |
| `footer` | "Book a stay" text link in the footer | engine |

**The push happens in `onClickCapture`, not `onClick`.** GTM's Link Click
listener and React's root listener both sit on `document`, so in the bubble
phase whichever registered first runs first. If GTM's does, its Link Click
reads the previous push. Capture runs before every bubble listener, so the push
always lands first. Both components have a test that registers a listener
before React mounts and asserts it already sees the push.

The value is also rendered as `data-cta-location` on the anchor, for DOM
inspection. GTM v6 does not read the attribute.

Every engine link the site renders pushes a surface.
[InnerPageCtas.test.tsx](../__tests__/components/InnerPageCtas.test.tsx) pins
this for `/rooms` and `/dining`, the last two that pushed nothing until
30 Oct 2026. The `bookingCta` blocks in the inner-page JSON files (car rental,
diving, events, excursions, rooms, spa, transfer, weddings) are validated but
rendered by no page, so they produce no clicks at all.

**`booking_engine_click` includes menu views.** Its trigger matches any click
URL containing `secure.guestpro.net`, and the in-room dining menu lives there
too. Separate them with `cta_destination` (`menu` vs `engine`).

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

## Container state (v7, 30 Oct 2026)

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
| `GA4 Event - GuestPro ecommerce` | `CE - GuestPro ecommerce` | the engine's event, by name (`{{Event}}`), with its ecommerce data from the Data Layer |
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

**`CE - GuestPro ecommerce`** (v7) is a Custom Event trigger with regex
`^(view_item_list|view_item|add_to_cart|begin_checkout|add_payment_info|purchase|payment_pending)$`.
These events are pushed only by the booking engine, so it needs no hostname
clause. Tested in Preview on 30 Oct 2026: `view_item_list` ×2, `add_to_cart`
×2 and `begin_checkout` ×1 each reached `G-XR996N4YKR` with `cu=IDR`,
`epn.value` and the room as `pr1`.

`G-XR966N4YKR` (note `966`) was pasted into `click_phone`, `click_email` and
`click_instagram` until v6. It is not a real property, so those three events
never arrived anywhere before 28 Sept 2026.

**Do not delete the two Custom HTML tags.** They are Yandex Metrica, with
`webvisor`, `clickmap` and `ecommerce: "dataLayer"`. Removing them drops
Metrica from the site entirely. Metrica's `tag.js` from `mc.yandex.ru` was
blocked by the CSP in [netlify.toml](../netlify.toml) until
`fix/cta-location-csp`, so check Metrica for a gap before that deploy.

Absent from the container: Consent Mode. No separate Ads remarketing tag is
needed: the Google tag already sends to Google Ads
`AW-18400798863` as a destination (`rmkt/collect`, `viewthroughconversion`,
`1p-user-list` hits seen on the engine on 30 Oct 2026).

## Google Ads

Account **`145-908-5801`**, linked to GA4. Conversion actions as of 30 Oct 2026:

| Conversion action | Source | Optimization | Notes |
|---|---|---|---|
| Orlowsky Discovery Candidasa Hotel (web) purchase | GA4 `purchase` | **Primary** | Since 30 Oct 2026. Category Purchase, count Every, value from GA4 |
| `booking_engine_click` | GA4 custom event | **Primary** | Category Outbound click, count One since 20 Oct 2026. Intent, not revenue |
| Local actions: Other engagements, Directions, Website visits | Google hosted | **Primary** | Google Business Profile taps, not bookings |
| Store visits | Store visits | **Primary** | Modelled |
| Clicks to call | Google hosted | **Primary** | A phone call is a real booking lead |
| Get directions | Webpage | Secondary | Removed from the account-default goal |

The day `purchase` records its first conversion, move `booking_engine_click`,
the three Local actions and Store visits to **Secondary**, and keep `purchase`
and Clicks to call Primary. Until then the Conversions column is mostly taps,
which is also why Google keeps recommending target CPA. Bidding is Maximise
clicks, so none of this changes spend yet.

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

The field is not self-serve in the PMS UI; GuestPro support sets it. They set
it on **30 Oct 2026**, after a second, single-ask request (the first, on
21 Sept, bundled four asks and went unanswered).

### What the engine sends (checked 30 Oct 2026)

Search, add a room, open the guest details page, no payment:

- `GTM-KHDV2SW2` loads on `secure.guestpro.net/odch`, and the Google tag loads
  through it (`gtag/js?id=G-XR996N4YKR&cx=c`). There is no second GA4 config,
  so `google_analytics_id` is empty as asked.
- GA4 gets **one `page_view` per engine route** (`/odch`, `/odch/booking`,
  `/odch/cart`): the config tag's history-change page view. The engine's own
  `page_view` dataLayer push is matched by no tag, so nothing double-counts.
- dataLayer events: `page_view`, `view_item_list`, `availability`,
  `search_room`, `add_to_cart`, `begin_checkout`. The ecommerce ones are in GA4
  shape. `begin_checkout` also carries the stay:

  ```
  { event: "begin_checkout",
    ecommerce: { value: 1393643.88, currency: "IDR",
      items: [{ item_name: "Deluxe Cottage", item_variant: "B&B DC Flexible",
                item_category: "Room", price: 1393643.88, quantity: 1, … }] },
    check_in_date: "2026-10-30", check_out_date: "2026-10-31",
    adults: 2, children: 0, infants: 0 }
  ```

- `purchase` was not observed, since it needs a completed booking — see
  [When a booking counts](#when-a-booking-counts).
- Since **v7** these reach GA4 through `GA4 Event - GuestPro ecommerce`.

### When a booking counts

Read from the engine's bundle on 30 Oct 2026 (`processSingleTracking` in the
payment-result component). The final "Book Now" on `/odch/cart` pushes
`add_payment_info`, with `payment_type` "Pay at Hotel" or the payment method's
name. The booking's own event is pushed later, on the **`BePaymentResult`**
route, and depends on the booking's status when that page loads:

| Status on the result page | Event pushed | Counts in Google Ads |
|---|---|---|
| `COMPLETE` | `purchase` (`transaction_id`, value, items, check-in/out) | Yes, the Primary conversion |
| `WAITING_PAYMENT_CONFIRMATION` or `WAITING_CONFIRMATION` | `payment_pending`, same payload | No, not imported |
| `CANCELLED` | `transaction_cancelled` | No |

Each is pushed once per booking: the engine first writes a posting date
(`google_tag_manager_posting_date` for pending, `..._COMPLETE_...`,
`..._CANCELLED_...`) to the booking and skips the push if one exists, so a
reload does not double-count. **A booking that is still waiting when the guest
sees the result page reports `payment_pending`, and becomes `purchase` only if
the result page is opened again after it is confirmed** (for example from the
confirmation email). Which status website bookings start in is unconfirmed;
asked of reception on 30 Oct 2026. `payment_pending` is in the v7 trigger so
those bookings reach GA4 either way.

Values are in **IDR including taxes and fees**, which is what Google Ads
reports as conversion value. The engine also has a **Promo Code** field on its
search form.

Because the container now runs on the engine, every All Pages tag fires there
too: Yandex Metrica, the Conversion Linker, and the click triggers (the
engine's own phone and WhatsApp icons count as `click_phone` /
`click_whatsapp`).

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

## Where this stands (30 Oct 2026)

**Code** — `book_now_click` and `data-cta-location` are live since PR #10
(23 Sept 2026). `fix/cta-location-csp` adds `room_card`, `dining` and
`booking_band`, moves the push to the capture phase, and widens the CSP for
Google Ads and Yandex Metrica. `feat/inner-cta-tracking` adds `rooms_page` and
`dining_page`, so every rendered engine link now pushes a surface.

**GTM** — v7 published 30 Oct 2026 21:09 WITA, live on the engine (the
served `gtm.js` is version 7 and carries the new trigger). See
[Container state](#container-state-v7-30-oct-2026).

**GA4 — done**
- Unwanted referrals: `guestpro.net`
- Configure domains: `orlowsky.id` + `secure.guestpro.net`
- All six custom dimensions registered, Event scope: `cta_location`,
  `cta_destination`, `translator`, `browser_lang`, `page_locale`, `error_digest`
- Internal traffic rule: hotel Wi-Fi public IP **`182.253.40.248`**, match type
  IP address equals. Stable across a 7-day recheck (Biznet, AS17451).
- Data filter for internal traffic switched **Testing → Active**. The rule
  only appends `traffic_type=internal`; the filter is what excludes it.
- Data retention: 14 months
- Linked to Google Ads `145-908-5801`
- Key events include `purchase`, `booking_engine_click` and `click_whatsapp`
  (checked 30 Oct 2026)

**GA4 — not confirmed**
- [ ] Internal traffic rule: a condition for the maintainer's own connection

> **Gotcha, already hit once.** Internal traffic matches the *visitor's* IP, not
> the server's. `orlowsky.id` resolving to Netlify's `98.84.224.111` /
> `18.208.88.157` is irrelevant — GA4 is client-side, so hits carry the
> browser's ISP address and the server IP never appears. Don't paper over a
> dynamic IP with a wide CIDR range: that filters real guests on the same ISP
> block.

**GuestPro** — `google_tag_manager_id` = `GTM-KHDV2SW2` set on 30 Oct 2026
and verified live (see [What the engine sends](#what-the-engine-sends-checked-30-oct-2026)).
Still to ask, one request per email: Google Free Booking Links (enablement,
landing URL, `merchant_id`), and the engine's search query parameters.

## Outstanding

**Code**
- [ ] Decide whether the unrendered `bookingCta` blocks in the inner-page JSON
      should be rendered or removed.

**GTM**
- [ ] Add `cta_location` as a parameter on the **`click_whatsapp`** tag, read
      from the `book_now_click` push like `booking_engine_click`. Without it the
      offer-card enquiries cannot be separated from the floating chat button.
- [ ] Optional, once that is on: a GA4 key event on `click_whatsapp` where
      `cta_location = offer_card`, `blog_offer` or `blog_band` — the offer
      conversion; `blog_offer` + `blog_band` are what the blog brings in. (A
      blog post's floating pill reports `floating` with destination `whatsapp`.)
- [ ] Map `fatal` into `ES - exception params` if crash severity is wanted

**Google Ads**
- [ ] Once reception says which status website bookings start in: if they
      usually start waiting, import `payment_pending` too (see
      [When a booking counts](#when-a-booking-counts))
- [ ] Once `purchase` records its first conversion: `booking_engine_click`,
      the three Local actions and Store visits to Secondary (see
      [Google Ads](#google-ads))
- [ ] Remarketing audiences: all visitors; began checkout but didn't book. The
      Google tag already collects for `AW-18400798863`. A list needs 1,000
      active users before Search can use it. Needs Consent Mode v2 for EEA/UK
      and a remarketing line in the privacy policy
- [ ] Skip bidding setup until there is conversion history — Smart Bidding
      from zero performs badly

**Open questions**
- [ ] Consent Mode v2 — no CMP on the site; required for EEA/UK remarketing
      and conversion modelling. Its own project.
- [ ] Booking engine search query parameters (undocumented; ask GuestPro, or
      capture the real redirect from GuestPro's WordPress booking bar)
- [ ] Google Free Booking Links: ask GuestPro to enable it through their Hotel
      Center connection, with the landing URL and `merchant_id`
