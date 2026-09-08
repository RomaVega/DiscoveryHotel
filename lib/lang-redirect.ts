/**
 * The blocking, pre-paint language redirect mounted first in <head> by
 * app/layout.tsx.
 *
 * Why it runs before paint rather than as a prompt after hydration: a Russian
 * speaker left on an English page gets Edge's or Chrome's "translate this
 * page" offer, and those translators replace our text nodes with their own
 * elements. React still holds references to the originals and throws on the
 * next removeChild — see lib/report-error.ts, which measures how often that
 * actually happens. Landing the visitor on /ru means the browser has nothing
 * to offer to translate in the first place, which removes the trigger instead
 * of coping with the crash.
 *
 * Escape hatches, so nobody is trapped in a locale they did not choose:
 *   - `?lang=en` (or `?lang=ru`) forces a locale and is remembered, so an
 *     English link stays English even for a Russian-locale visitor.
 *   - The language selector writes the same `odh-lang` key, and a stored
 *     preference always beats the browser's language list.
 * Only a visitor with no preference at all is routed by their browser language,
 * and only by the *primary* one. Matching anywhere in `navigator.languages`
 * would send an en-US-first visitor who also lists Russian to /ru, where the
 * browser would then offer to translate *into* English — recreating the exact
 * situation this exists to prevent, in the opposite direction.
 *
 * Crawlers are unaffected: Googlebot reports en-US, so it never matches the
 * Russian branch, and hreflang in the page metadata remains the authoritative
 * signal about which URL serves which language.
 *
 * The script is emitted as a string rather than a bundled module because it
 * has to execute before the parser reaches any markup. `__tests__/lib/
 * lang-redirect.test.ts` evaluates this exact string, so what ships is what is
 * tested — keep it ES5-plain and free of anything a bundler would need to
 * transpile with a helper.
 */

/** localStorage key holding an explicit language choice ("en" | "ru"). */
export const LANG_PREF_KEY = "odh-lang";

/**
 * EN paths that have a `/ru` twin, derived from the route manifest.
 *
 * Every EN route currently has one, so nothing is filtered out today — but the
 * manifest is regenerated on each build, and a new page added in EN only would
 * land here untranslated. Such a path must not redirect: sending a visitor to a
 * /ru URL that was never built is a 404, which is worse than English content.
 */
export function enPathsWithRuTwin(allRoutes: readonly string[]): string[] {
  return allRoutes
    .filter((r) => r === "/ru" || r.startsWith("/ru/"))
    .map((r) => (r === "/ru" ? "/" : r.slice(3)));
}

export function buildLangRedirectScript(ruPaths: readonly string[]): string {
  return `(function(){
var KEY=${JSON.stringify(LANG_PREF_KEY)};
var RU=${JSON.stringify(ruPaths)};
function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
function set(v){try{localStorage.setItem(KEY,v)}catch(e){}}
var path=location.pathname;
if(path.length>1&&path.charAt(path.length-1)==="/")path=path.slice(0,-1);
if(!path)path="/";
var onRu=path==="/ru"||path.slice(0,4)==="/ru/";
var tail=location.search+location.hash;
function goRu(){if(RU.indexOf(path)<0)return;location.replace((path==="/"?"/ru":"/ru"+path)+tail)}
function goEn(){location.replace((path.slice(3)||"/")+tail)}
var q="&"+location.search.slice(1);
var i=q.indexOf("&lang=");
var forced="";
if(i>-1){var v=q.slice(i+6),a=v.indexOf("&");if(a>-1)v=v.slice(0,a);if(v==="en"||v==="ru")forced=v}
if(forced)set(forced);
var pref=forced||get();
if(pref==="ru"){if(!onRu)goRu();return}
if(pref==="en"){if(onRu)goEn();return}
if(onRu)return;
var l;
try{l=((navigator.languages&&navigator.languages.length?navigator.languages[0]:navigator.language)||"").toLowerCase()}catch(e){return}
if(l==="ru"||l.slice(0,3)==="ru-")goRu();
})();`;
}
