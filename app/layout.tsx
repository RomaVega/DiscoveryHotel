import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { LanguageProvider } from "@/lib/language-context";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/site";
import "./globals.css";

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
  title: {
    default: `${SITE_NAME} | Candidasa, Bali`,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  alternates: {
    canonical: "/",
    languages: {
      "en": `${SITE_URL}/`,
      "ru": `${SITE_URL}/`,
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preload hero video for faster LCP */}
        <link rel="preload" as="video" href="/video/hero-desktop.webm" type="video/webm" />
        {/* schema.org Hotel — structured data for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Hotel",
              "name": SITE_NAME,
              "description": description,
              "url": SITE_URL,
              "telephone": "+6282236655582",
              "email": "2794140@gmail.com",
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
              "sameAs": [
                "https://facebook.com/orlowskydiscovery",
                "https://instagram.com/orlowskydiscovery",
                "https://youtube.com/@orlowskydiscovery",
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`} suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var h=new Date().getHours();if(h<6||h>=20||window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.classList.add('night');})();` }} />
        <LanguageProvider>
          <LoadingScreen />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
