/**
 * Google Tag Manager (container GTM-KHDV2SW2).
 *
 * The container ID is public (it ships in every page), so it lives here rather
 * than in an env var. What *is* gated is where the container loads: dev builds
 * and Netlify's deploy-preview / branch-deploy contexts render nothing, so the
 * same rule that keeps GA4 out of non-production data (see GoogleAnalytics)
 * holds for GTM. `CONTEXT` is set by Netlify at build time; when it is absent
 * (a local `npm run build`) a production build still loads the container, which
 * is what you want when smoke-testing the export.
 *
 * Two parts, per Google's install instructions: `GoogleTagManagerHead` goes as
 * high in <head> as possible, `GoogleTagManagerNoScript` immediately after the
 * opening <body> tag. Both are Server Components — the markup is baked into the
 * static HTML, so the container starts loading from the raw document rather
 * than waiting on hydration.
 */

const GTM_ID = "GTM-KHDV2SW2";

const netlifyContext = process.env.CONTEXT;

const ENABLED =
  process.env.NODE_ENV === "production" &&
  (netlifyContext === undefined || netlifyContext === "production");

const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

export function GoogleTagManagerHead() {
  if (!ENABLED) return null;

  return <script dangerouslySetInnerHTML={{ __html: GTM_SCRIPT }} />;
}

export function GoogleTagManagerNoScript() {
  if (!ENABLED) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
