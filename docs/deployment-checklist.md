# Deployment Checklist — Orlowsky Discovery Hotel Website

This document covers the full path from a freshly cloned repository to a live production website on a custom domain. Work through each section in order. Check items off as you complete them.

---

## Prerequisites

Before starting, verify that you have:

- [ ] A GitHub account with the project repository pushed to it
- [ ] A Vercel account (create free at vercel.com — connect with your GitHub account)
- [ ] Access to the domain registrar where `discoveryhot.com` (or the new domain) is managed
- [ ] Node.js 20 or higher installed on your development machine (`node --version` to check)
- [ ] The project dependencies installed locally (`npm install` from the project root)

---

## 1. Local Build Verification

Before connecting anything to Vercel, confirm the site builds cleanly on your machine.

```bash
npm run build
```

A successful build ends with a table showing each route, its size, and its generation time. If the build fails, fix all errors before proceeding — Vercel will fail for the same reasons.

- [ ] `npm run build` completes with zero errors
- [ ] `npm run start` serves the site locally on `http://localhost:3000`
- [ ] All 11 pages load without errors in the browser
- [ ] No TypeScript errors (`npm run type-check` or `npx tsc --noEmit`)

---

## 2. Vercel Project Setup

1. Log in to `vercel.com` and click "Add New Project."
2. Select "Import Git Repository" and choose the project repository.
3. Vercel will detect Next.js automatically. Accept the default build settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (Vercel handles this automatically)
   - **Install Command:** `npm install`
4. Click "Deploy." Vercel builds and deploys to a temporary URL (e.g., `project-name.vercel.app`).

- [ ] Vercel project created and linked to GitHub repository
- [ ] First deployment succeeds (green checkmark in Vercel dashboard)
- [ ] Temporary Vercel URL loads correctly in browser

---

## 3. Environment Variables

This project has minimal environment variables because there is no database or authentication. The following variables must be set if any integrations are active:

| Variable | Value | When required |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | e.g., `6281234567890` | Always — drives the WhatsApp button |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | e.g., `G-XXXXXXXXXX` | Only when Google Analytics is connected |

To add environment variables in Vercel:
1. Go to your project → Settings → Environment Variables.
2. Add each variable with its value. Select "Production," "Preview," and "Development" for all variables.
3. Click Save, then redeploy the project (Vercel dashboard → Deployments → Redeploy).

If a variable is marked `NEXT_PUBLIC_`, it is embedded into the client-side JavaScript bundle and visible to anyone who inspects page source. Never put secrets (API keys, passwords) in `NEXT_PUBLIC_` variables.

- [ ] All environment variables added in Vercel dashboard
- [ ] Project redeployed after adding variables
- [ ] WhatsApp button opens correct number on the deployed site

---

## 4. Custom Domain Configuration

### Step 1 — Add domain in Vercel

1. Vercel project → Settings → Domains.
2. Enter your domain (e.g., `discoveryhot.com`) and click Add.
3. Vercel displays the DNS records you need to set.

### Step 2 — Update DNS at your registrar

Log in to wherever you purchased the domain. Add or update these records:

**For an apex domain (`discoveryhot.com`):**
- Type: `A`, Name: `@`, Value: `76.76.21.21`

**For the www subdomain (`www.discoveryhot.com`):**
- Type: `CNAME`, Name: `www`, Value: `cname.vercel-dns.com`

DNS changes propagate in 10 minutes to 24 hours. Vercel's dashboard shows "Valid Configuration" once it detects the correct records.

### Step 3 — Verify HTTPS

Vercel automatically provisions a free SSL certificate (Let's Encrypt) once DNS is verified. No manual configuration needed.

- [ ] Domain added in Vercel dashboard
- [ ] DNS records updated at domain registrar
- [ ] Vercel dashboard shows "Valid Configuration" for the domain
- [ ] `https://discoveryhot.com` loads with a padlock (HTTPS active)
- [ ] `https://www.discoveryhot.com` redirects to the apex domain (or vice versa — configure redirect in Vercel → Domains)

---

## 5. GuestPro Booking Widget Verification

The booking widget is an iframe from `https://secure.guestpro.net/odch`. Verify it loads correctly on the live production domain.

- [ ] Open the Home page on the production URL
- [ ] Open browser DevTools (F12) → Console tab
- [ ] No "Refused to display in a frame" or `X-Frame-Options` errors appear
- [ ] The booking widget renders and is interactive
- [ ] If the widget fails to load: contact GuestPro support and request that they add `discoveryhot.com` to their allowed-origins list

---

## 6. Pre-Launch QA Checklist

Complete this on the production domain, not on localhost or the Vercel preview URL.

### Content

- [ ] All 11 pages load without errors
- [ ] Hotel name, tagline, and contact details are correct on every page
- [ ] Room descriptions, prices, and amenities are accurate
- [ ] All photos load (no broken image icons)
- [ ] Hero video autoplays, loops, and is muted
- [ ] Offers page shows only active offers

### Navigation & Links

- [ ] Navbar links navigate to the correct pages
- [ ] Mobile hamburger menu opens and closes correctly
- [ ] Footer links work
- [ ] "Book Now" button opens the GuestPro widget or the correct URL
- [ ] WhatsApp button opens WhatsApp with the correct number and pre-filled message
- [ ] No 404 errors on any internal link (check with a browser link checker or manually click all nav items)

### Forms & Interactions

- [ ] Gallery infinite scroll loads the next batch of photos when scrolling to the bottom
- [ ] Gallery lightbox opens on photo click and closes on click-outside or Escape key
- [ ] All WhatsApp inquiry buttons (Restaurant, Spa, Excursions, etc.) open with the correct pre-filled messages

### Responsive Design

- [ ] Site tested on mobile (375px width) — no horizontal scroll, no overlapping text
- [ ] Site tested on tablet (768px) — layout switches correctly to two-column where expected
- [ ] Site tested on desktop (1280px+) — full nav visible, three-column grids render correctly
- [ ] Hero video replaced by static image on a test device with autoplay disabled

### Animations

- [ ] Hero parallax effect works on scroll
- [ ] Section headings animate in on scroll (text-reveal)
- [ ] Room cards show spotlight effect on hover (desktop only)
- [ ] WhatsApp button has pulse animation
- [ ] Animations are absent or reduced when OS has "Reduce Motion" enabled

---

## 7. SEO Verification

### Metadata

Each page must have a unique `<title>` and `<meta name="description">`. These are defined in `app/[page]/page.tsx` using Next.js's `export const metadata` export:

```typescript
export const metadata = {
  title: "Rooms & Villas — Orlowsky Discovery Hotel, Candidasa Bali",
  description: "Stay in our Deluxe Cottage or Three Bedrooms Pool Villa...",
};
```

- [ ] Every page has a unique title tag (visible in browser tab)
- [ ] Every page has a meta description under 160 characters
- [ ] Home page title includes the hotel name and location ("Candidasa Bali")

### Technical SEO

- [ ] `robots.txt` is accessible at `https://discoveryhot.com/robots.txt` — Next.js generates this automatically, verify it does not block crawlers
- [ ] `sitemap.xml` is accessible at `https://discoveryhot.com/sitemap.xml` — add `sitemap.ts` in `app/` if it does not exist (Next.js 15 supports this natively)
- [ ] Google Search Console: add and verify the property using the DNS verification method (your registrar → add a TXT record provided by Search Console)
- [ ] Submit the sitemap URL in Google Search Console

### Open Graph (Social Sharing)

When guests share a page link on WhatsApp or social media, a preview card appears. Add Open Graph tags to each page's metadata:

```typescript
export const metadata = {
  openGraph: {
    title: "Orlowsky Discovery Hotel",
    description: "Boutique hotel in Candidasa, East Bali",
    images: ["/images/og/og-home.jpg"], // 1200×630px image
  },
};
```

- [ ] OG image created (1200×630px) and placed in `public/images/og/`
- [ ] OG tags verified using Facebook's Sharing Debugger or opengraph.xyz

---

## 8. Post-Launch

After going live, perform these steps within the first 48 hours:

- [ ] Monitor Vercel dashboard for any build or function errors
- [ ] Check Google Search Console for any crawl errors after 48–72 hours
- [ ] Test the site on a real mobile device (not just DevTools simulation)
- [ ] Share the URL with one or two trusted people and ask them to browse naturally and report anything that feels broken
- [ ] Confirm the old Tilda site redirects to the new domain (or is taken offline) — this prevents duplicate content indexing

---

## Continuous Deployment

From this point forward, every push to the `main` branch on GitHub automatically triggers a new Vercel deployment. There is no manual deploy step. The workflow is:

1. Edit a JSON content file (or make a code change).
2. Commit and push to GitHub `main`.
3. Vercel builds and deploys in 30–90 seconds.
4. Changes are live globally.

Preview branches: if a developer pushes to any branch other than `main`, Vercel creates a unique preview URL for that branch. This allows reviewing and testing changes before they go live. Preview URLs follow the pattern `project-name-git-branch-name.vercel.app`.
