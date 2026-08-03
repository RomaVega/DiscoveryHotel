import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics 4 (gtag.js).
 *
 * Renders nothing unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set at build time,
 * so local dev — and any Netlify context where the variable is left unset —
 * stays out of the property's data.
 *
 * Client-side route changes are covered by GA4 Enhanced Measurement ("page
 * changes based on browser history events", on by default), so there is no
 * usePathname listener here. That keeps this a Server Component with no
 * client-bundle cost beyond gtag itself.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
