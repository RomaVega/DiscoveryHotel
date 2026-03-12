# Maintenance Guide — Orlowsky Discovery Hotel Website

This guide is written for the hotel owner and non-technical team members. You do not need to understand code to perform any of the tasks below. You only need to be comfortable editing a text file.

---

## How the Content System Works

Every piece of text and every image path on the website is stored in a simple text file inside the `/content` folder. These files use a format called JSON — it looks like a structured list with labels and values. Here is a small example:

```json
{
  "heroTagline": "Where East Bali Breathes",
  "introText": "Nestled in the quiet village of Candidasa..."
}
```

The label on the left (e.g., `"heroTagline"`) tells the website which part of the page this text belongs to. The value on the right (e.g., `"Where East Bali Breathes"`) is what appears on the page.

When you change a value and save the file, the website automatically rebuilds and shows your change within about 60 seconds. This is handled by Vercel — you do not need to do anything technical.

**The golden rule of JSON editing:** Always keep the labels intact. Only change the values (the text after the colon). And always keep quotation marks around both labels and values. If you accidentally break the JSON format, the website build will fail and show you an error — nothing will be deleted, and you can fix the mistake.

---

## How to Edit Content

### Option A — GitHub (Recommended for Regular Changes)

1. Go to the project's GitHub repository (your developer will give you the link).
2. Navigate to the `/content` folder.
3. Click the file you want to edit (e.g., `rooms.json`).
4. Click the pencil icon (Edit) in the top right.
5. Make your changes to the values (not the labels).
6. Scroll down and click "Commit changes" with a short note about what you changed (e.g., "Updated pool villa price").
7. The site rebuilds automatically. It is live in 1–2 minutes.

### Option B — Local Editor (For Larger Changes)

If you have the project on your computer, open the file in any text editor (Notepad++, VS Code, or even TextEdit). Edit the values, save the file, and push the change to GitHub using the instructions your developer provided.

---

## Changing Room Information

Open `content/rooms.json`. You will find two sections: `deluxeCottage` and `poolVilla`. Edit the values within each:

```json
{
  "deluxeCottage": {
    "name": "Deluxe Cottage",
    "tagline": "Intimate garden retreat with private terrace",
    "description": "Your room description goes here. Write as much as you need.",
    "size": "45 sqm",
    "capacity": "2 adults",
    "priceFrom": "USD 120 per night",
    "amenities": [
      "Air conditioning",
      "Free WiFi",
      "Private terrace",
      "Minibar",
      "Outdoor shower"
    ],
    "images": [
      "/images/rooms/deluxe-cottage/deluxe-cottage-bedroom-01.jpg",
      "/images/rooms/deluxe-cottage/deluxe-cottage-pool-01.jpg"
    ]
  }
}
```

To change the price: find `"priceFrom"` and update the value. To add an amenity: add a new line inside the amenities list (inside the square brackets `[]`), following the same format as existing items — `"New amenity"` with a comma after it if it is not the last item in the list.

---

## Adding or Changing Photos

### Step 1 — Prepare the photo

Name it following the convention in `architecture.md`. Examples:
- `deluxe-cottage-bedroom-02.jpg` (for a second bedroom photo)
- `gallery-31.jpg` (for a new gallery photo)
- `offers-summer-promo-01.jpg` (for an offer image)

Use lowercase letters, numbers, and hyphens only. No spaces.

**Recommended image size:** At least 1920px wide for full-bleed images, at least 800px wide for cards and gallery photos. JPEG format, quality 80–85% (keeps file size manageable without visible loss). The website automatically converts them to WebP for visitors.

### Step 2 — Upload the photo

Copy the file to the correct folder inside `public/images/`:
- Room photos → `public/images/rooms/deluxe-cottage/` or `public/images/rooms/pool-villa/`
- Gallery photos → `public/images/gallery/`
- Offer photos → `public/images/offers/`
- Restaurant photos → `public/images/restaurant/`

Push the file to GitHub (your developer can set up a simple upload process for you, or you can use the GitHub web interface to upload files directly into the folder).

### Step 3 — Reference the photo in the JSON file

In the relevant JSON file, update or add the image path. Always start the path with `/images/` (not `public/images/`):

```json
"images": [
  "/images/rooms/deluxe-cottage/deluxe-cottage-bedroom-01.jpg",
  "/images/rooms/deluxe-cottage/deluxe-cottage-bedroom-02.jpg"
]
```

---

## Adding or Deactivating an Offer

### To add a new offer

Open `content/offers.json`. Copy an existing offer block and paste it above the first item. Update all values:

```json
{
  "items": [
    {
      "id": "honeymoon-2025",
      "active": true,
      "title": "Honeymoon Package",
      "headline": "Celebrate love in paradise — complimentary flowers and dinner",
      "description": "Full description of what is included...",
      "validFrom": "2025-06-01",
      "validUntil": "2025-12-31",
      "image": "/images/offers/honeymoon-01.jpg",
      "conditions": "Minimum 4 nights. Subject to availability."
    },
    {
      ... existing offer here ...
    }
  ]
}
```

The `"id"` must be unique — use a short descriptive slug with no spaces (e.g., `"early-bird-march-2026"`).

### To deactivate an expired offer

Find the offer in `offers.json` and change `"active": true` to `"active": false`. The offer will disappear from the website but remain in the file for future reference. Do not delete the offer object — you may want to reactivate it for the next season.

---

## Updating the Restaurant Menu or Hours

Open `content/restaurant.json`. Find the `openingHours` section and update the times:

```json
{
  "openingHours": [
    { "period": "Breakfast", "hours": "07:00 – 10:30" },
    { "period": "Lunch",     "hours": "12:00 – 15:00" },
    { "period": "Dinner",    "hours": "18:30 – 22:00" }
  ]
}
```

---

## Updating the Hero Video

The hero video file lives at `public/videos/hero.mp4` (and `hero.webm`). To replace it:

1. Prepare the new video. See the spec in `ui-ux-guidelines.md`: H.264 MP4, 1920×1080, under 15 MB, no audio, 10–20 seconds.
2. Name the new file `hero.mp4`.
3. Replace the existing `public/videos/hero.mp4` with your new file. (Also replace `hero.webm` if you have a WebM version — your video editor or a free tool like HandBrake can convert MP4 to WebM.)
4. Push to GitHub. The site rebuilds and the new video goes live.

You do not need to change any code — the video component always looks for the file at the same path.

---

## Changing the WhatsApp Contact Number

Open `content/contact.json`. Find the `whatsappNumber` field and update it:

```json
{
  "whatsappNumber": "6281234567890",
  "whatsappMessage": "Hello, I am interested in booking at Orlowsky Discovery Hotel."
}
```

The number must be in full international format with the country code, no `+` sign, no spaces (e.g., `62` for Indonesia followed by the local number).

---

## Updating Gallery Photos

Open `content/gallery.json`. The `photos` array lists all gallery images in order. They appear on the website in the order listed here — put your best photos first.

```json
{
  "photos": [
    { "src": "/images/gallery/gallery-01.jpg", "alt": "Pool at sunset" },
    { "src": "/images/gallery/gallery-02.jpg", "alt": "Deluxe cottage bedroom" },
    { "src": "/images/gallery/gallery-03.jpg", "alt": "Spa treatment room" }
  ]
}
```

To add a photo: upload the file to `public/images/gallery/`, then add a new entry to the array with its path and a short description for the `alt` field. The `alt` text is read by screen readers for visually impaired users — describe what is in the photo in 5–10 words.

To remove a photo: delete its line from the `photos` array. You can also delete the file from `public/images/gallery/` afterward.

---

## After Making Changes — What Happens

Every time you push a change to GitHub (whether it is a JSON edit or a new image file), Vercel automatically detects the change and rebuilds the website. You can watch the progress at `vercel.com/dashboard` — the build typically takes 30–60 seconds. Once the build is marked "Ready," your changes are live worldwide.

If the build fails (shown in red on Vercel), it usually means there is a formatting error in the JSON file you edited. Check `deployment-checklist.md` for how to validate your JSON before pushing.

---

## Quick Reference — Which File to Edit

| What you want to change | File to edit |
|---|---|
| Home page text or images | `content/home.json` |
| Room descriptions, prices, amenities | `content/rooms.json` |
| Restaurant info or hours | `content/restaurant.json` |
| Spa treatments or prices | `content/spa.json` |
| Gallery photos | `content/gallery.json` |
| Excursion listings | `content/excursions.json` |
| Transfer routes and prices | `content/transfer.json` |
| Rental items and prices | `content/rental.json` |
| Special offers | `content/offers.json` |
| About page text | `content/about.json` |
| Phone, email, address | `content/contact.json` |
| Navigation menu links | `content/navigation.json` |
| Hero video | `public/videos/hero.mp4` (replace file) |
| Any photo | `public/images/[section]/` (replace file, update JSON path) |
