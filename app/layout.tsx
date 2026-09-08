import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { MotionProvider } from "@/components/common/MotionProvider";
import { GoogleAnalytics } from "@/components/layout/GoogleAnalytics";
import {
  GoogleTagManagerHead,
  GoogleTagManagerNoScript,
} from "@/components/layout/GoogleTagManager";
import { LanguageSuggestion } from "@/components/layout/LanguageSuggestion";
import { LanguageProvider } from "@/lib/language-context";
import { ALL_ROUTES } from "@/lib/image-manifest";
import { buildLangRedirectScript, enPathsWithRuTwin } from "@/lib/lang-redirect";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/site";
import { getWhatsAppNumber } from "@/lib/whatsapp";
import { getContactData, getRatingAggregates } from "@/lib/content";
import { aggregateRating } from "@/lib/jsonld";
import "./globals.css";

// Blocking pre-paint redirect: honours a stored language preference, an
// explicit ?lang=, and — for a first-time visitor with neither — the browser's
// own language list. Routing a Russian speaker to /ru before first paint is
// what stops Edge offering to translate the English page, which is how the
// translator gets a chance to break React's DOM. See lib/lang-redirect.ts.
const LANG_REDIRECT_SCRIPT = buildLangRedirectScript(enPathsWithRuTwin(ALL_ROUTES));

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});


const description =
  "Four-star boutique hotel on the shores of Candidasa, East Bali. Ocean-view villas, tropical gardens, spa, diving, and authentic Balinese hospitality.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // A plain string, deliberately not a { default, template } pair. Every page
  // writes its own complete title with the brand already placed in it — see the
  // canonical page pattern in CLAUDE.md — so a `%s | ${SITE_NAME}` template
  // appended the hotel's name a second time on all 37 pages that set one, and
  // titles like "Privacy Policy | Orlowsky Discovery Hotel" ended up carrying it
  // twice over. Pages that set no title of their own inherit this one.
  title: `${SITE_NAME} | Candidasa, Bali`,
  description,
  alternates: {
    canonical: "/",
    languages: {
      "en": `${SITE_URL}/`,
      "ru": `${SITE_URL}/ru`,
      "x-default": `${SITE_URL}/`,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Candidasa, Bali`,
    description,
    url: SITE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Orlowsky Discovery Hotel — Candidasa, East Bali" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Candidasa, Bali`,
    description,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // Google Search Console HTML-tag verification. Omitted entirely when the env
  // var is unset — a DNS TXT record on orlowsky.id verifies the same property
  // and is the preferred method (survives HTML changes, covers subdomains).
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Language redirect — must run before any rendering. Blocks parser briefly. */}
        <script dangerouslySetInnerHTML={{ __html: LANG_REDIRECT_SCRIPT }} />
        {/* Google Tag Manager. Google asks for this as high in <head> as
            possible; it sits second because the redirect above may send the
            visitor to the other locale, and a container booted before that
            would report a pageview for a URL we are about to leave. */}
        <GoogleTagManagerHead />
        {/* schema.org Hotel — structured data for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Hotel",
              "@id": `${SITE_URL}/#hotel`,
              "name": SITE_NAME,
              "description": description,
              "url": SITE_URL,
              "telephone": `+${getWhatsAppNumber()}`,
              "email": "info@orlowsky.co.id",
              "image": OG_IMAGE,
              "priceRange": "$$",
              "starRating": { "@type": "Rating", "ratingValue": "4" },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jalan Pantai Indah 06",
                "addressLocality": "Candidasa",
                "addressRegion": "Karangasem",
                "postalCode": "80851",
                "addressCountry": "ID",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -8.511625718417616,
                "longitude": 115.57505012094016,
              },
              "amenityFeature": [
                { "@type": "LocationFeatureSpecification", "name": "Swimming Pool",        "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Free WiFi",            "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Restaurant",           "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Spa",                  "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Beach Access",         "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Free Parking",         "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Airport Shuttle",      "value": true },
                { "@type": "LocationFeatureSpecification", "name": "24-Hour Front Desk",   "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Room Service",         "value": true },
                { "@type": "LocationFeatureSpecification", "name": "Laundry Service",      "value": true },
              ],
              "aggregateRating": aggregateRating(getRatingAggregates()),
              // Derived from contact.json rather than listed again here: this array
              // and the footer icons are the same claim about the same accounts, and
              // a second hardcoded copy is a second thing to forget. Three of the four
              // URLs here sat dead after the profiles moved.
              "sameAs": getContactData().socials.map((s) => s.url),
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`} suppressHydrationWarning>
        <GoogleTagManagerNoScript />
        <LanguageProvider>
          <MotionProvider>
            {children}
            <LanguageSuggestion />
          </MotionProvider>
        </LanguageProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
